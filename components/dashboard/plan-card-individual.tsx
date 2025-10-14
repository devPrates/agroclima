"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Check, Loader2 } from "lucide-react"

type BillingCycle = "mensal" | "anual"

export function PlanCardIndividual({
  monthlyPrice,
  annualPrice,
  billingCycle,
  onBillingCycleChange,
  payerEmail,
  checkingOut,
  setCheckingOut,
}: {
  monthlyPrice: number
  annualPrice: number
  billingCycle: BillingCycle
  onBillingCycleChange?: (value: BillingCycle) => void
  payerEmail?: string
  checkingOut: boolean
  setCheckingOut: (val: boolean) => void
}) {
  return (
    <div className="rounded-xl border bg-background shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold">Plano Individual</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">anual</span>
            <Switch checked={billingCycle === "mensal"} onCheckedChange={(v) => onBillingCycleChange?.(v ? "mensal" : "anual")} />
            <span className="text-xs text-muted-foreground">mensal</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="md:flex md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Tudo para uso pessoal e monitoramento completo.</div>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Estação meteorológica completa</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Dashboard web completo</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Suporte técnico 24/7</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Relatórios anteriores</li>
            </ul>
          </div>
          <div className="shrink-0 flex flex-col items-center text-center space-y-2">
            <div className="mt-6 md:mt-0">
              <span className="text-2xl font-semibold">R$ {billingCycle === "mensal" ? monthlyPrice : annualPrice}</span>
              <span className="text-sm text-muted-foreground">{billingCycle === "mensal" ? "/mês" : "/ano"}</span>
            </div>
            <Button
              disabled={checkingOut}
              onClick={async () => {
                try {
                  setCheckingOut(true)
                  if (billingCycle === "mensal") {
                    const preResp = await fetch("/api/mercadopago/preapproval", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        payer_email: payerEmail,
                        amount: monthlyPrice,
                        frequency: 1,
                        frequency_type: "months",
                        reason: "Plano Individual - Mensal",
                        // Fixar sessions=2 no external_reference para identificação inequívoca
                        external_reference: `${payerEmail || ''}|plan=individual|sessions=2`,
                        sessions: 2,
                        back_url: typeof window !== "undefined" ? `${window.location.origin}/mercadopago/success` : undefined,
                      }),
                    })
                    const preData = await preResp.json()
                    if (!preResp.ok || !preData?.init_point) {
                      const msg = preData?.error || preData?.details?.message || preData?.details?.raw || "Não foi possível iniciar a assinatura mensal. Tente novamente."
                      alert(String(msg))
                      return
                    }
                    window.location.href = preData.init_point
                  } else {
                    const resp = await fetch("/api/mercadopago/preference", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        amount: annualPrice,
                        description: "Plano Individual - Anual",
                        payerEmail: payerEmail,
                        externalReference: `${payerEmail || ''}|plan=individual|sessions=2`,
                      }),
                    })
                    const data = await resp.json()
                    if (!resp.ok || !data?.init_point) {
                      alert("Não foi possível iniciar o pagamento anual. Tente novamente.")
                      return
                    }
                    window.location.href = data.init_point
                  }
                } catch (err) {
                  alert("Erro inesperado ao iniciar o checkout.")
                } finally {
                  setCheckingOut(false)
                }
              }}
            >
              {checkingOut ? (
                <span className="inline-flex items-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processando...
                </span>
              ) : (
                "Adquirir plano"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}