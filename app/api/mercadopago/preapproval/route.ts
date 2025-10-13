import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const {
      plan_id,
      payer_email,
      reason = "Assinatura mensal AgroClima",
      external_reference,
    }: { plan_id?: string; payer_email?: string; reason?: string; external_reference?: string } = body || {}

    const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!token) {
      return NextResponse.json({ error: "Access token ausente" }, { status: 500 })
    }

    if (!plan_id) {
      return NextResponse.json({ error: "plan_id é obrigatório (preapproval_plan_id)" }, { status: 400 })
    }

    const backUrl = process.env.MP_SUBS_BACK_URL || process.env.NEXT_PUBLIC_APP_URL || undefined

    const payload: any = {
      preapproval_plan_id: plan_id,
      payer_email,
      reason,
      external_reference,
    }

    // Quando fornecido, back_url redireciona após a autorização da assinatura
    if (backUrl) {
      payload.back_url = backUrl
    }

    const resp = await fetch("https://api.mercadopago.com/preapproval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    const data = await resp.json()
    if (!resp.ok) {
      return NextResponse.json({ error: data?.message || "Falha ao criar preapproval", details: data }, { status: resp.status })
    }

    return NextResponse.json({ id: data.id, status: data.status, init_point: data.init_point })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro interno" }, { status: 500 })
  }
}