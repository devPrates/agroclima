import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { alterUserOnBackend, upsertUserFromApi } from "@/actions/user-actions"
import { MercadoPagoConfig, Payment, PreApproval } from "mercadopago"

function getQuery(url: string) {
  try {
    const u = new URL(url)
    return u.searchParams
  } catch {
    return new URLSearchParams()
  }
}

// Normaliza status vindos do Mercado Pago para o enum do Prisma
function normalizeStatus(raw: any) {
  const s = String(raw || "").toLowerCase()
  switch (s) {
    case "processed":
      // MP pode retornar "processed" em authorized payments; tratamos como "approved"
      return "approved"
    case "canceled":
      // Garantir grafia alinhada ao enum
      return "cancelled"
    case "approved":
    case "pending":
    case "authorized":
    case "in_process":
    case "rejected":
    case "refunded":
    case "charged_back":
    case "cancelled":
      return s
    default:
      return "pending"
  }
}

// Extrai sessões de external_reference, no formato "...|sessions=3" ou "sessions=5"
function parseSessionsFromExternalReference(ref?: string): number | undefined {
  if (!ref || typeof ref !== "string") return undefined
  const m = ref.match(/(?:^|[|&])sessions=(\d+)/i)
  if (m) {
    const s = Number(m[1])
    if (s === 2 || s === 3 || s === 5) return s
  }
  return undefined
}

// Valida se um número pode ser usado como max_sessions
function isValidSessions(n: any): n is number {
  return n === 2 || n === 3 || n === 5
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
   console.log("[MP] webhook recebido", { url: req.url, topic, id, hasSignature: Boolean(signature), requestId })

  // Busca detalhes do recurso quando possível
  let resource: any = null
  if (token && id && topic) {
    try {
      const mp = new MercadoPagoConfig({ accessToken: token })
      if (topic === "payment") {
        const payment = new Payment(mp)
        resource = await payment.get({ id: Number(id) })
      } else if (topic === "subscription_preapproval" || topic === "preapproval") {
        const preapproval = new PreApproval(mp)
        resource = await preapproval.get({ id })
      } else if (topic === "subscription_authorized_payment" || topic === "authorized_payment") {
        // A SDK pode não ter um wrapper direto para authorized_payments; manter fallback HTTP
        const r = await fetch(`https://api.mercadopago.com/authorized_payments/${id}`, { headers: { Authorization: `Bearer ${token}` } })
        resource = await r.json()
      }
      console.log("[MP] recurso obtido", { topic, id, ok: resource && !resource.error, keys: resource ? Object.keys(resource) : [] })
    } catch (e) {
      console.error("[MP] falha ao obter recurso", { topic, id, error: String(e) })
      resource = { error: "Falha ao obter recurso" }
    }
  } else {
    console.warn("[MP] sem token/id/topic para obter recurso", { hasToken: Boolean(token), id, topic })
  }

  // Persistir/atualizar pagamento conforme o tópico
  try {
    async function markUserPaidByEmail(email?: string, sessions?: number) {
      if (!email) {
        console.warn("[MP] markUserPaidByEmail sem email", { sessions })
        return
      }
      try {
        const data: any = { pagante: "s" }
        if (isValidSessions(sessions)) {
          data.max_sessions = sessions
        }
        console.log("[MP] atualizando usuário como pagante", { email, sessions })
        await prisma.user.update({ where: { login: email }, data })
        console.log("[MP] usuário atualizado com sucesso", { email })
      } catch (e) {
        console.error("[MP] falha ao atualizar usuário como pagante", { email, error: String(e) })
        try {
          console.log("[MP] tentando upsert do usuário via API", { email })
          const res = await upsertUserFromApi(email)
          console.log("[MP] resultado upsert API", { email, success: Boolean(res?.success) })
          if (res?.success) {
            const data2: any = { pagante: "s" }
            if (isValidSessions(sessions)) data2.max_sessions = sessions
            await prisma.user.update({ where: { login: email }, data: data2 })
            console.log("[MP] usuário atualizado após upsert", { email })
          }
        } catch (e2) {
          console.error("[MP] retry de atualização após upsert falhou", { email, error: String(e2) })
        }
      }
    }

    if (topic === "payment" && resource) {
      const paymentId = String(resource.id)
      const status = normalizeStatus(resource.status || "pending") as any
      const amount = Number(resource.transaction_amount || resource.amount || 0)
      const currency = String(resource.currency_id || "BRL")
      const payerEmail = resource?.payer?.email || undefined
      const externalReference = resource?.external_reference || undefined
      const preferenceId = resource?.preference_id || undefined
      const orderId = resource?.order?.id ? String(resource.order.id) : undefined
      const approvedAtStr = resource?.date_approved || undefined
      const createdAtStr = resource?.date_created || undefined
      const approvedAt = approvedAtStr ? new Date(approvedAtStr) : undefined
      const createdAt = createdAtStr ? new Date(createdAtStr) : undefined
      const loginFromExternalRef = externalReference ? String(externalReference).split("|")[0] : undefined
      const loginEmail = payerEmail || loginFromExternalRef
      console.log("[MP] processando payment", { paymentId, status, externalReference, preferenceId, payerEmail, loginEmail })

      // Tentar associar ao registro criado na criação da preferência
      if (preferenceId) {
        const existing = await prisma.payment.findFirst({ where: { preferenceId } })
        if (existing) {
          const prevMeta: any = existing.metadata || {}
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
                ...prevMeta,
                status_detail: resource?.status_detail,
              },
            },
          })

          // Se pagamento aprovado, marcar usuário como pagante e definir sessões
          if (status === "approved") {
            // Priorizar derivação: external_reference -> metadata.sessions -> descrição
            let sessionsForUser: number | undefined = parseSessionsFromExternalReference(externalReference)
            if (!isValidSessions(sessionsForUser)) {
              const sMeta = Number(prevMeta?.sessions)
              if (isValidSessions(sMeta)) sessionsForUser = sMeta
            }
            if (!isValidSessions(sessionsForUser)) {
              const desc = typeof prevMeta?.description === "string" ? prevMeta.description.toLowerCase() : ""
              if (desc.includes("personalizado")) {
                const m = desc.match(/(\d+)\s*sess/i)
                if (m) {
                  const s = Number(m[1])
                  if (isValidSessions(s)) sessionsForUser = s
                }
              } else if (desc.includes("individual")) {
                sessionsForUser = 2
              }
            }

            console.log("pagamento aprovado", { paymentId, login: loginEmail, sessionsForUser })
            await markUserPaidByEmail(loginEmail, sessionsForUser)

            // Enviar PUT para backend externo identificando pelo login
            if (loginEmail && isValidSessions(sessionsForUser)) {
              try {
                await alterUserOnBackend({ login: loginEmail, max_sessions: sessionsForUser, pagante: "s" })
              } catch (e) {
                console.error("Falha ao enviar PUT ao backend (approved/preferenceId):", e)
              }
            }

            // Vincular pagamento ao usuário
            if (loginEmail) {
              const userRecord = await prisma.user.findUnique({ where: { login: loginEmail } })
              if (userRecord) {
                const assocId = `user-${userRecord.id}-payment-${existing.id}`
                await prisma.$executeRaw`INSERT INTO "UserPayment" ("id", "userId", "paymentId") VALUES (${assocId}, ${userRecord.id}, ${existing.id}) ON CONFLICT ("userId", "paymentId") DO NOTHING`
              }
            }
          }
        } else {
          // Caso não exista, criar pelo paymentId
          const saved = await prisma.payment.upsert({
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

          if (status === "approved") {
            // Derivar sessões: external_reference -> metadata.sessions -> descrição
            let sessionsForUser: number | undefined = parseSessionsFromExternalReference(externalReference)
            const mpMeta = resource?.metadata || {}
            if (!isValidSessions(sessionsForUser)) {
              const sMeta = Number(mpMeta?.sessions)
              if (isValidSessions(sMeta)) sessionsForUser = sMeta
            }
            if (!isValidSessions(sessionsForUser)) {
              const descStr = String(
                resource?.description || resource?.additional_info?.items?.[0]?.title || ""
              ).toLowerCase()
              if (descStr.includes("personalizado")) {
                const m = descStr.match(/(\d+)\s*sess/i)
                if (m) {
                  const s = Number(m[1])
                  if (isValidSessions(s)) sessionsForUser = s
                }
              } else if (descStr.includes("individual")) {
                sessionsForUser = 2
              }
            }

            console.log("pagamento aprovado", { paymentId, login: loginEmail, sessionsForUser })
            await markUserPaidByEmail(loginEmail, sessionsForUser)

            // PUT externo com sessões derivadas do recurso
            if (loginEmail && isValidSessions(sessionsForUser)) {
              try {
                await alterUserOnBackend({ login: loginEmail, max_sessions: sessionsForUser, pagante: "s" })
              } catch (e) {
                console.error("Falha ao enviar PUT ao backend (approved/create-by-paymentId):", e)
              }
            }

            // Vincular pagamento ao usuário
            if (loginEmail) {
              const userRecord = await prisma.user.findUnique({ where: { login: loginEmail } })
              if (userRecord) {
                const assocId = `user-${userRecord.id}-payment-${saved.id}`
                await prisma.$executeRaw`INSERT INTO "UserPayment" ("id", "userId", "paymentId") VALUES (${assocId}, ${userRecord.id}, ${saved.id}) ON CONFLICT ("userId", "paymentId") DO NOTHING`
              }
            }
          }
        }
      } else {
        // Sem preferenceId: garantir persistência via paymentId
        const saved = await prisma.payment.upsert({
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

        if (status === "approved") {
          // Derivar sessões quando possível
          let sessionsForUser: number | undefined = parseSessionsFromExternalReference(externalReference)
          const mpMeta = resource?.metadata || {}
          if (!isValidSessions(sessionsForUser)) {
            const sMeta = Number(mpMeta?.sessions)
            if (isValidSessions(sMeta)) sessionsForUser = sMeta
          }
          if (!isValidSessions(sessionsForUser)) {
            const descStr = String(resource?.description || "").toLowerCase()
            if (descStr.includes("personalizado")) {
              const m = descStr.match(/(\d+)\s*sess/i)
              if (m) {
                const s = Number(m[1])
                if (isValidSessions(s)) sessionsForUser = s
              }
            } else if (descStr.includes("individual")) {
              sessionsForUser = 2
            }
          }

          console.log("pagamento aprovado", { paymentId, login: loginEmail, sessionsForUser })
          await markUserPaidByEmail(loginEmail, sessionsForUser)
          if (loginEmail && isValidSessions(sessionsForUser)) {
            try {
              await alterUserOnBackend({ login: loginEmail, max_sessions: sessionsForUser, pagante: "s" })
            } catch (e) {
              console.error("Falha ao enviar PUT ao backend (approved/no-preferenceId):", e)
            }
          }
          if (loginEmail) {
            const userRecord = await prisma.user.findUnique({ where: { login: loginEmail } })
            if (userRecord) {
              const assocId = `user-${userRecord.id}-payment-${saved.id}`
              await prisma.$executeRaw`INSERT INTO "UserPayment" ("id", "userId", "paymentId") VALUES (${assocId}, ${userRecord.id}, ${saved.id}) ON CONFLICT ("userId", "paymentId") DO NOTHING`
            }
          }
        }
      }
    }

    // Assinaturas: preapproval
    if ((topic === "subscription_preapproval" || topic === "preapproval") && resource) {
      const paymentId = String(resource.id)
      const status = normalizeStatus(resource.status || "authorized") as any
      const payerEmail = resource?.payer_email || undefined
      const externalReference = resource?.external_reference || undefined

      const saved = await prisma.payment.upsert({
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

      // Preapproval autorizado: marcar como pagante, derivando sessões
      if (status === "authorized") {
        let sessionsForUser: number | undefined = parseSessionsFromExternalReference(externalReference)
        const reasonStr = String(resource?.reason || "").toLowerCase()
        if (!isValidSessions(sessionsForUser)) {
          if (reasonStr.includes("personalizado")) {
            const m = reasonStr.match(/(\d+)\s*sess/i)
            if (m) {
              const s = Number(m[1])
              if (isValidSessions(s)) sessionsForUser = s
            }
          } else if (reasonStr.includes("individual")) {
            sessionsForUser = 2
          }
        }
        await markUserPaidByEmail(payerEmail, sessionsForUser)
        if (payerEmail && isValidSessions(sessionsForUser)) {
          try {
            await alterUserOnBackend({ login: payerEmail, max_sessions: sessionsForUser, pagante: "s" })
          } catch (e) {
            console.error("Falha ao enviar PUT ao backend (preapproval/authorized):", e)
          }
        }
        // Vincular preapproval ao usuário como um registro associado
        if (payerEmail) {
          const userRecord = await prisma.user.findUnique({ where: { login: payerEmail } })
          if (userRecord) {
            const assocId = `user-${userRecord.id}-payment-${saved.id}`
            await prisma.$executeRaw`INSERT INTO "UserPayment" ("id", "userId", "paymentId") VALUES (${assocId}, ${userRecord.id}, ${saved.id}) ON CONFLICT ("userId", "paymentId") DO NOTHING`
          }
        }
      }
    }

    // Autorização de pagamento recorrente
    if ((topic === "subscription_authorized_payment" || topic === "authorized_payment") && resource) {
      const paymentId = String(resource.id)
      const status = normalizeStatus(resource.status || "approved") as any
      const amount = Number(resource?.transaction_amount || 0)
      const currency = String(resource?.currency_id || "BRL")
      const createdAtStr = resource?.date_created || undefined
      const createdAt = createdAtStr ? new Date(createdAtStr) : undefined

      // Tentar obter detalhes do preapproval para inferir sessions e email
      let derivedSessionsForUser: number | undefined
      let derivedPayerEmail: string | undefined
      let loginEmailAuth: string | undefined
      try {
        const preapprovalId = resource?.preapproval_id || resource?.preapproval?.id
        if (preapprovalId && token) {
          const mpCfg = new MercadoPagoConfig({ accessToken: token })
          const preapproval = new PreApproval(mpCfg)
          const pr = await preapproval.get({ id: preapprovalId })
          const extRef = pr?.external_reference || undefined
          let sForUser: number | undefined = parseSessionsFromExternalReference(extRef)
          if (!isValidSessions(sForUser)) {
            const reasonStr = String(pr?.reason || "").toLowerCase()
            if (reasonStr.includes("personalizado")) {
              const m = reasonStr.match(/(\d+)\s*sess/i)
              if (m) {
                const s = Number(m[1])
                if (isValidSessions(s)) sForUser = s
              }
            } else if (reasonStr.includes("individual")) {
              sForUser = 2
            }
          }
          derivedSessionsForUser = sForUser
          derivedPayerEmail = pr?.payer_email || undefined
          const loginFromExt = extRef ? String(extRef).split("|")[0] : undefined
          loginEmailAuth = derivedPayerEmail || loginFromExt
        }
      } catch (e) {
        console.error("[MP] falha ao obter preapproval para authorized_payment", e)
      }

      const saved = await prisma.payment.upsert({
        where: { paymentId },
        update: { status, amount, currency, metadata: { type: "authorized_payment" } },
        create: { paymentId, status, amount, currency, metadata: { type: "authorized_payment" } },
      })

      // Ajuste de usuário baseado em email derivado
      if (loginEmailAuth) {
        const sessionsForUser = isValidSessions(derivedSessionsForUser) ? derivedSessionsForUser : undefined
        await markUserPaidByEmail(loginEmailAuth, sessionsForUser)
        if (isValidSessions(sessionsForUser)) {
          try {
            await alterUserOnBackend({ login: loginEmailAuth, max_sessions: sessionsForUser, pagante: "s" })
          } catch (e) {
            console.error("Falha ao enviar PUT ao backend (authorized_payment)", e)
          }
        }
        const userRecord = await prisma.user.findUnique({ where: { login: loginEmailAuth } })
        if (userRecord) {
          const assocId = `user-${userRecord.id}-payment-${saved.id}`
          await prisma.$executeRaw`INSERT INTO "UserPayment" ("id", "userId", "paymentId") VALUES (${assocId}, ${userRecord.id}, ${saved.id}) ON CONFLICT ("userId", "paymentId") DO NOTHING`
        }
      }
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