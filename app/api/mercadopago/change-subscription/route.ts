import { NextResponse } from "next/server"
import { MercadoPagoConfig, PreApproval } from "mercadopago"
import { prisma } from "@/lib/prisma"

type Cycle = "mensal" | "anual"

function normalizeSessions(n?: number): 2 | 3 | 5 | undefined {
  if (!n) return undefined
  if (n === 2 || n === 3 || n === 5) return n
  return undefined
}

function computePrices(targetSessions: 2 | 3 | 5, cycle: Cycle) {
  const monthly = targetSessions === 2 ? 25 : targetSessions === 3 ? 70 : 60
  const annual = targetSessions === 2 ? monthly * 12 : monthly * 12 * 0.9
  const isMonthly = cycle === "mensal"
  return {
    amount: isMonthly ? monthly : annual,
    reason:
      targetSessions === 2
        ? `Plano Individual - ${isMonthly ? "Mensal" : "Anual"}`
        : `Plano Personalizado - ${isMonthly ? "Mensal" : "Anual"} - ${targetSessions} sessões`,
  }
}

export async function POST(req: Request) {
  try {
    const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!token) {
      return NextResponse.json({ error: "Access token ausente" }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const { targetSessions, cycle = "mensal", payerEmail }: { targetSessions?: number; cycle?: Cycle; payerEmail?: string } = body || {}

    const normalizedSessions = normalizeSessions(Number(targetSessions))
    if (!normalizedSessions) {
      return NextResponse.json({ error: "targetSessions inválido. Use 2, 3 ou 5." }, { status: 400 })
    }
    if (cycle !== "mensal" && cycle !== "anual") {
      return NextResponse.json({ error: "cycle inválido. Use 'mensal' ou 'anual'." }, { status: 400 })
    }

    const loginEmail = typeof payerEmail === "string" && payerEmail.includes("@") ? payerEmail : undefined
    if (!loginEmail) {
      return NextResponse.json({ error: "payerEmail ausente. Forneça o e-mail de login do assinante." }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { login: loginEmail } })
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // 1) Tentar encontrar preapproval associado via UserPayment (caminho ideal)
    const userPayments = await prisma.userPayment.findMany({ where: { userId: user.id }, include: { payment: true } })
    let preapprovalPayment = userPayments
      .map((up) => up.payment)
      .find((p) => (p?.metadata as any)?.type === "preapproval" && p?.status === "authorized")

    // 2) Fallback: procurar Payment pelo e-mail do pagador ou external_reference contendo o login
    if (!preapprovalPayment) {
      const fallback = await prisma.payment.findFirst({
        where: {
          OR: [
            { payerEmail: loginEmail },
            { externalReference: { contains: loginEmail } },
          ],
        },
        orderBy: { createdAt: "desc" },
      })
      if (fallback && (fallback.metadata as any)?.type === "preapproval") {
        preapprovalPayment = fallback
      }
    }

    const preapprovalId = preapprovalPayment?.paymentId
    if (!preapprovalId) {
      return NextResponse.json({
        error: "Assinatura recorrente (preapproval) não encontrada para o usuário.",
        hint: "Verifique se a assinatura mensal foi autorizada e se o webhook vinculou o preapproval ao usuário.",
        details: {
          hasUserPayments: userPayments.length > 0,
          foundFallback: Boolean(preapprovalPayment),
        },
      }, { status: 404 })
    }

    // Mudança de ciclo para anual não é suportada via update de preapproval.
    // Para anual, use o fluxo de compra anual (Preference) já existente.
    if (cycle === "anual") {
      return NextResponse.json({ error: "Mudança para anual não suportada via assinatura. Use o pagamento anual." }, { status: 400 })
    }

    const mp = new MercadoPagoConfig({ accessToken: token })
    const preApproval = new PreApproval(mp)

    const { amount, reason } = computePrices(normalizedSessions, cycle)

    const external_reference = `${loginEmail}|plan=${normalizedSessions === 2 ? "individual" : "personalizado"}|sessions=${normalizedSessions}`

    const updated = await preApproval.update({
      id: preapprovalId,
      body: {
        reason,
        external_reference,
        auto_recurring: {
          transaction_amount: amount,
          currency_id: process.env.SUBSCRIPTION_CURRENCY || "BRL",
        },
      },
    })

    await prisma.user.update({ where: { id: user.id }, data: { max_sessions: normalizedSessions, pagante: "s" } })

    return NextResponse.json({ ok: true, preapproval_id: preapprovalId, next_cycle: { amount, cycle }, updated })
  } catch (e: any) {
    console.error("Erro ao atualizar assinatura:", e)
    return NextResponse.json({ error: e?.message || "Falha inesperada ao atualizar assinatura" }, { status: 500 })
  }
}