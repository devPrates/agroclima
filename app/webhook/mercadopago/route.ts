import { NextResponse } from "next/server"

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

  // Aqui você pode persistir em DB/log, atualizar status do usuário/plano, etc.
  // Por enquanto, retornamos um OK com metadados.
  return NextResponse.json({ ok: true, meta, resource })
}

export async function GET(req: Request) {
  // Alguns testes de webhook usam GET para verificar disponibilidade
  return NextResponse.json({ ok: true })
}