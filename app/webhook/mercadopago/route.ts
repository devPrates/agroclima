import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

function getQuery(url: string) {
  try {
    const u = new URL(url)
    return u.searchParams
  } catch {
    return new URLSearchParams()
  }
}

export async function POST(req: Request) {
  const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN
  const secret = process.env.MP_WEBHOOK_SECRET || process.env.MERCADOPAGO_WEBHOOK_SECRET || process.env.MERCADO_PAGO_WEBHOOK_SECRET

  // Headers com possível assinatura (varia por conta/região)
  const signature = req.headers.get("x-signature") || req.headers.get("X-Signature") || undefined
  const requestId = req.headers.get("x-request-id") || req.headers.get("X-Request-Id") || undefined

  const body = await req.json().catch(() => ({}))
  const params = getQuery(req.url)
  const topic = params.get("type") || params.get("topic") || body?.topic || body?.type || "unknown"
  const id = params.get("id") || params.get("data.id") || body?.data?.id || body?.id || undefined

  // TODO: validar assinatura (se configurado). Por ora, apenas loga.
  const meta = { topic, id, signature: Boolean(signature), requestId }

  // Busca detalhes do recurso quando possível
  let resource: any = null
  if (token && id && topic) {
    try {
      let url: string | null = null
      if (topic === "payment") url = `https://api.mercadopago.com/v1/payments/${id}`
      else if (topic === "subscription_preapproval" || topic === "preapproval") url = `https://api.mercadopago.com/preapproval/${id}`
      else if (topic === "subscription_authorized_payment" || topic === "authorized_payment") url = `https://api.mercadopago.com/authorized_payments/${id}`

      if (url) {
        const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        resource = await r.json()
      }
    } catch (e) {
      resource = { error: "Falha ao obter recurso" }
    }
  }

  // Persistir/atualizar pagamento conforme o tópico
  try {
    if (topic === "payment" && resource) {
      const paymentId = String(resource.id)
      const status = String(resource.status || "pending") as any
      const amount = Number(resource.transaction_amount || resource.amount || 0)
      const currency = String(resource.currency_id || "BRL")
      const payerEmail = resource?.payer?.email || undefined
      const externalReference = resource?.external_reference || undefined
      const preferenceId = resource?.preference_id || undefined
      const orderId = resource?.order?.id ? String(resource.order.id) : undefined

      // Tentar associar ao registro criado na criação da preferência
      if (preferenceId) {
        const existing = await prisma.payment.findFirst({ where: { preferenceId } })
        if (existing) {
          await prisma.payment.update({
            where: { id: existing.id },
            data: {
              paymentId,
              status,
              amount,
              currency,
              payerEmail,
              externalReference,
              preferenceId,
              orderId,
              metadata: {
                status_detail: resource?.status_detail,
              },
            },
          })
        } else {
          // Caso não exista, criar pelo paymentId
          await prisma.payment.upsert({
            where: { paymentId },
            update: {
              status,
              amount,
              currency,
              payerEmail,
              externalReference,
              preferenceId,
              orderId,
              metadata: { status_detail: resource?.status_detail },
            },
            create: {
              paymentId,
              status,
              amount,
              currency,
              payerEmail,
              externalReference,
              preferenceId,
              orderId,
              metadata: { status_detail: resource?.status_detail },
            },
          })
        }
      } else {
        // Sem preferenceId: garantir persistência via paymentId
        await prisma.payment.upsert({
          where: { paymentId },
          update: {
            status,
            amount,
            currency,
            payerEmail,
            externalReference,
            orderId,
            metadata: { status_detail: resource?.status_detail },
          },
          create: {
            paymentId,
            status,
            amount,
            currency,
            payerEmail,
            externalReference,
            orderId,
            metadata: { status_detail: resource?.status_detail },
          },
        })
      }
    }

    // Assinaturas: preapproval
    if ((topic === "subscription_preapproval" || topic === "preapproval") && resource) {
      const paymentId = String(resource.id)
      const status = String(resource.status || "authorized") as any
      const payerEmail = resource?.payer_email || undefined
      const externalReference = resource?.external_reference || undefined

      await prisma.payment.upsert({
        where: { paymentId },
        update: {
          status,
          payerEmail,
          externalReference,
          metadata: { type: "preapproval" },
        },
        create: {
          paymentId,
          status,
          currency: "BRL",
          payerEmail,
          externalReference,
          metadata: { type: "preapproval" },
        },
      })
    }

    // Autorização de pagamento recorrente
    if ((topic === "subscription_authorized_payment" || topic === "authorized_payment") && resource) {
      const paymentId = String(resource.id)
      const status = String(resource.status || "approved") as any
      const amount = Number(resource?.transaction_amount || 0)
      const currency = String(resource?.currency_id || "BRL")

      await prisma.payment.upsert({
        where: { paymentId },
        update: { status, amount, currency, metadata: { type: "authorized_payment" } },
        create: { paymentId, status, amount, currency, metadata: { type: "authorized_payment" } },
      })
    }
  } catch (persistErr) {
    console.error("Falha ao persistir atualização de pagamento:", persistErr)
  }

  return NextResponse.json({ ok: true, meta, resource })
}

export async function GET(req: Request) {
  // Alguns testes de webhook usam GET para verificar disponibilidade
  return NextResponse.json({ ok: true })
}