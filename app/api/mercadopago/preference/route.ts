import { NextResponse } from "next/server"
import { MercadoPagoConfig, Preference } from "mercadopago"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const {
      amount,
      description = "Plano Anual",
      payerEmail,
      externalReference,
      sessions,
    }: { amount?: number; description?: string; payerEmail?: string; externalReference?: string; sessions?: number } = body || {}

    const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!token) {
      return NextResponse.json({ error: "Access token ausente" }, { status: 500 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || ""
    const successUrl = process.env.MP_SUCCESS_URL || (appUrl ? (appUrl.endsWith("/") ? `${appUrl}mercadopago/success` : `${appUrl}/mercadopago/success`) : "")
    const failureUrl = process.env.MP_FAILURE_URL || (appUrl ? (appUrl.endsWith("/") ? `${appUrl}mercadopago/failure` : `${appUrl}/mercadopago/failure`) : "")
    const pendingUrl = process.env.MP_PENDING_URL || failureUrl
    const notificationUrl = process.env.MP_WEBHOOK_URL || `${process.env.NEXT_PUBLIC_APP_URL || ""}webhook/mercadopago`

    if (typeof amount !== "number" || amount <= 0) {
      return NextResponse.json({ error: "amount inválido" }, { status: 400 })
    }

    const mp = new MercadoPagoConfig({ accessToken: token })
    const preference = new Preference(mp)
    const data = await preference.create({
      body: {
        items: [
          {
            id: externalReference || "annual-plan",
            title: description,
            quantity: 1,
            currency_id: process.env.SUBSCRIPTION_CURRENCY || "BRL",
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
        // Carregar sessões diretamente no pagamento via metadata para evitar depender do banco
        metadata: {
          sessions,
          description,
          plan_type: "annual",
        },
      },
    })

    // Removido: persistência via Prisma para evitar erro de módulo ausente.

    return NextResponse.json({ id: data.id, init_point: data.init_point, sandbox_init_point: data.sandbox_init_point })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro interno" }, { status: 500 })
  }
}