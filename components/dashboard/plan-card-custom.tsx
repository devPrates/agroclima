"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Check, Loader2 } from "lucide-react"

type BillingCycle = "mensal" | "anual"
type Sessions = "3" | "5"

export function PlanCardCustom({
  customSessions,
  onCustomSessionsChange,
  billingCycle,
  onBillingCycleChange,
  sessions3Monthly,
  sessions5Monthly,
  payerEmail,
  checkingOut,
  setCheckingOut,
}: {
  customSessions: Sessions
  onCustomSessionsChange: (val: Sessions) => void
  billingCycle: BillingCycle
  onBillingCycleChange: (value: BillingCycle) => void
  sessions3Monthly: number
  sessions5Monthly: number
  payerEmail?: string
  checkingOut: boolean
  setCheckingOut: (val: boolean) => void
}) {
  const priceMonthly = customSessions === "3" ? sessions3Monthly : sessions5Monthly
  const priceAnnual = priceMonthly * 12 * 0.9

  return (
    <div className="rounded-xl border bg-background shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl font-semibold">Plano Personalizado</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">anual</span>
            <Switch checked={billingCycle === "mensal"} onCheckedChange={(v) => onBillingCycleChange(v ? "mensal" : "anual")} />
            <span className="text-xs text-muted-foreground">mensal</span>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-[1.25fr_1fr_1fr] gap-6 md:items-center">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Solução sob medida para propriedades e equipes.</div>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Mais contas de acesso</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Integração com sistemas existentes</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Gestão multiusuário avançada</li>
              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Suporte dedicado</li>
            </ul>
          </div>
          <div className="md:col-span-1 flex flex-col items-center text-center space-y-2">
            <div className="text-sm">Sessões</div>
            <div className="w-full max-w-[200px]">
              <Select value={customSessions} onValueChange={(v) => onCustomSessionsChange(v as Sessions)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 sessões</SelectItem>
                  <SelectItem value="5">5 sessões</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="md:col-span-1 flex flex-col items-center text-center md:items-end md:text-right space-y-2">
            <div className="mt-6 md:mt-0">
              <span className="text-2xl font-semibold">R$ {billingCycle === "mensal" ? priceMonthly : priceAnnual}</span>
              <span className="text-sm text-muted-foreground">{billingCycle === "mensal" ? "/mês" : "/ano"}</span>
            </div>
            <Button asChild>
              <a
                href="#"
                onClick={async (e) => {
                  e.preventDefault()
                  try {
                    setCheckingOut(true)
                    if (billingCycle === "mensal") {
                      const preResp = await fetch("/api/mercadopago/preapproval", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          payer_email: payerEmail,
                          amount: priceMonthly,
                          frequency: 1,
                          frequency_type: "months",
                          reason: `Plano Personalizado - Mensal - ${customSessions} sessões`,
                          // Incluir sessions explicitamente no external_reference para facilitar processamento no webhook
                          external_reference: `${payerEmail || ''}|plan=personalizado|sessions=${Number(customSessions)}`,
                          sessions: Number(customSessions),
                          back_url: typeof window !== "undefined" ? `${window.location.origin}/mercadopago/success` : undefined,
                        }),
                      })
                      const preData = await preResp.json()
                      if (!preResp.ok || !preData?.init_point) {
                        const msg = preData?.error || preData?.details?.message || preData?.details?.raw || "Não foi possível iniciar a assinatura mensal personalizada. Tente novamente."
                        alert(String(msg))
                        return
                      }
                      window.location.href = preData.init_point
                    } else {
                      const resp = await fetch("/api/mercadopago/preference", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          amount: priceAnnual,
                          description: `Plano Personalizado - Anual - ${customSessions} sessões`,
                          payerEmail: payerEmail,
                          sessions: Number(customSessions),
                          externalReference: `${payerEmail || ''}|plan=personalizado|sessions=${Number(customSessions)}`,
                        }),
                      })
                      const data = await resp.json()
                      if (!resp.ok || !data?.init_point) {
                        alert("Não foi possível iniciar o pagamento anual personalizado. Tente novamente.")
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
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}