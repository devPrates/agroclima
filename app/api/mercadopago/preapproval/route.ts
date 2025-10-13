import { NextResponse } from "next/server"
import { MercadoPagoConfig, PreApproval } from "mercadopago"

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const {
      payer_email,
      amount,
      currency_id,
      frequency = 1,
      frequency_type = "months",
      reason = "Assinatura AgroClima",
      external_reference,
      back_url: backUrlFromBody,
    }: {
      payer_email?: string
      amount?: number
      currency_id?: string
      frequency?: number
      frequency_type?: "days" | "months"
      reason?: string
      external_reference?: string
      back_url?: string
    } = body || {}

    const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!token) {
      return NextResponse.json({ error: "Access token ausente" }, { status: 500 })
    }

    if (!payer_email) {
      return NextResponse.json({ error: "payer_email é obrigatório" }, { status: 400 })
    }
    if (!amount) {
      return NextResponse.json({ error: "amount é obrigatório" }, { status: 400 })
    }

    // back_url é obrigatório para o fluxo sem card_token; usa body, env ou deriva do host
    let backUrl = backUrlFromBody || process.env.MERCADOPAGO_BACK_URL || process.env.MP_SUCCESS_URL || undefined
    const appUrl = process.env.NEXT_PUBLIC_APP_URL
    if (!backUrl && appUrl) {
      backUrl = appUrl.endsWith("/") ? `${appUrl}mercadopago/success` : `${appUrl}/mercadopago/success`
    }
    if (!backUrl) {
      const proto = req.headers.get("x-forwarded-proto") || "https"
      const host = req.headers.get("x-forwarded-host") || req.headers.get("host")
      if (host) {
        backUrl = `${proto}://${host}/mercadopago/success`
      }
    }

    // Falha cedo se não houver back_url resolvido para evitar erro genérico da API
    if (!backUrl) {
      return NextResponse.json(
        {
          error: "back_url ausente",
          hint: "Defina MERCADOPAGO_BACK_URL, MP_SUCCESS_URL ou NEXT_PUBLIC_APP_URL",
        },
        { status: 400 }
      )
    }

    const mp = new MercadoPagoConfig({ accessToken: token })
    const preApproval = new PreApproval(mp)

    const data = await preApproval.create({
      body: {
        back_url: backUrl,
        reason,
        auto_recurring: {
          frequency,
          frequency_type,
          transaction_amount: amount,
          currency_id: currency_id || process.env.MERCADOPAGO_SUBSCRIPTION_CURRENCY || "BRL",
        },
        payer_email,
        status: "pending",
        external_reference,
      },
    })

    if (!data?.init_point) {
      return NextResponse.json({ error: "Falha ao criar preapproval", details: data }, { status: 400 })
    }

    return NextResponse.json({ id: data.id, status: data.status, init_point: data.init_point })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro interno" }, { status: 500 })
  }
}