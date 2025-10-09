import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const {
      amount,
      description = "Plano Anual",
      payerEmail,
      externalReference,
    }: { amount?: number; description?: string; payerEmail?: string; externalReference?: string } = body || {}

    const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!token) {
      return NextResponse.json({ error: "Access token ausente" }, { status: 500 })
    }

    const successUrl = process.env.MP_SUCCESS_URL || `${process.env.NEXT_PUBLIC_APP_URL || ""}mercadopago/success`
    const failureUrl = process.env.MP_FAILURE_URL || `${process.env.NEXT_PUBLIC_APP_URL || ""}mercadopago/failure`
    const pendingUrl = process.env.MP_PENDING_URL || failureUrl
    const notificationUrl = process.env.MP_WEBHOOK_URL || `${process.env.NEXT_PUBLIC_APP_URL || ""}webhook/mercadopago`

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "amount inválido" }, { status: 400 })
    }

    const preferencePayload = {
      items: [
        {
          title: description,
          quantity: 1,
          currency_id: "BRL",
          unit_price: amount,
        },
      ],
      payer: payerEmail ? { email: payerEmail } : undefined,
      back_urls: {
        success: successUrl,
        failure: failureUrl,
        pending: pendingUrl,
      },
      auto_return: "approved",
      external_reference: externalReference,
      notification_url: notificationUrl,
    }

    const resp = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(preferencePayload),
    })

    const data = await resp.json()
    if (!resp.ok) {
      return NextResponse.json({ error: data?.message || "Falha ao criar preference", details: data }, { status: resp.status })
    }

    return NextResponse.json({ id: data.id, init_point: data.init_point, sandbox_init_point: data.sandbox_init_point })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro interno" }, { status: 500 })
  }
}