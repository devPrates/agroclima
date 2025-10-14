import { NextResponse } from "next/server"
import { MercadoPagoConfig, PreApprovalPlan } from "mercadopago"

// Cria um plano de assinatura (preapproval_plan) no Mercado Pago
// Valor: R$1,00 por mês, currency BRL, sem pró-rata
export async function POST(req: Request) {
  try {
    const token = process.env.MP_ACCESS_TOKEN || process.env.MERCADOPAGO_ACCESS_TOKEN
    if (!token) {
      return NextResponse.json({ error: "Access token ausente" }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
  const envCurrency = process.env.SUBSCRIPTION_CURRENCY || "BRL"
    const {
      reason = "Plano Individual AgroClima - R$1/mês",
      transaction_amount = 1,
      currency_id = envCurrency,
      frequency = 1,
      frequency_type = "months",
      billing_day,
      billing_day_proportional = false,
      free_trial_days,
    }: {
      reason?: string
      transaction_amount?: number
      currency_id?: string
      frequency?: number
      frequency_type?: "days" | "months"
      billing_day?: number
      billing_day_proportional?: boolean
      free_trial_days?: number
    } = body || {}

    if (typeof transaction_amount !== "number" || transaction_amount <= 0) {
      return NextResponse.json({ error: "transaction_amount inválido" }, { status: 400 })
    }

    const mp = new MercadoPagoConfig({ accessToken: token })
    const preApprovalPlan = new PreApprovalPlan(mp)

    const data = await preApprovalPlan.create({
      body: {
        reason,
        auto_recurring: {
          frequency,
          frequency_type,
          transaction_amount,
          currency_id,
          billing_day,
          billing_day_proportional,
        },
        ...(typeof free_trial_days === "number" && free_trial_days > 0
          ? { free_trial: { frequency: free_trial_days, frequency_type: "days" } }
          : {}),
      },
    })

    return NextResponse.json({ id: data.id, status: data.status, auto_recurring: data.auto_recurring })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro interno" }, { status: 500 })
  }
}