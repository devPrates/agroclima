"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "@/components/ui/alert-dialog"
import { useState } from "react"

type BillingCycle = "mensal" | "anual"

type Sessions = "2" | "3" | "5"

export function PlanUpgradeCard({
  planLabel,
  isPaid,
  monthlyPrice,
  annualPrice,
  billingCycle,
  onBillingCycleChange,
  payerEmail,
  currentSessions = 2,
  sessions3Monthly = 70,
  sessions5Monthly = 60,
}: {
  planLabel: string
  isPaid: boolean
  monthlyPrice: number
  annualPrice: number
  billingCycle: BillingCycle
  onBillingCycleChange: (v: BillingCycle) => void
  payerEmail?: string
  currentSessions?: number
  sessions3Monthly?: number
  sessions5Monthly?: number
}) {
  const sessionOptions: Sessions[] = (["2", "3", "5"].filter((s) => Number(s) !== currentSessions) as Sessions[])
  const [targetSessions, setTargetSessions] = useState<Sessions>(sessionOptions[0] ?? "2")
  const [changing, setChanging] = useState(false)

  const priceMonthly = targetSessions === "2" ? monthlyPrice : targetSessions === "3" ? sessions3Monthly : sessions5Monthly
  const priceAnnual = targetSessions === "2" ? annualPrice : (priceMonthly * 12 * 0.9)

  async function handleChangePlan() {
    try {
      setChanging(true)
      const resp = await fetch("/api/mercadopago/change-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payerEmail,
          targetSessions: Number(targetSessions),
          cycle: billingCycle,
        }),
      })
      const data = await resp.json()
      if (!resp.ok) {
        const msg = data?.error || "Não foi possível alterar sua assinatura."
        alert(String(msg))
        return
      }
      alert("Plano atualizado. O novo valor será aplicado na próxima cobrança.")
      // Opcional: recarregar a aba para refletir rótulos/valores
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href)
        url.searchParams.set("tab", "plan")
        window.location.href = url.toString()
      }
    } catch (e) {
      alert("Erro inesperado ao alterar sua assinatura.")
    } finally {
      setChanging(false)
    }
  }

  return (
    <div className="rounded-xl border bg-background shadow-sm">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Plano De Assinatura</h3>
          <div className="text-base inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-foreground border">
            {planLabel}
          </div>
        </div>
      </div>
      <div className="space-y-0">
        <div className="divide-y">
          {isPaid && (
            <div className="grid grid-cols-1 md:grid-cols-2 p-6">
              <div className="text-sm text-center md:text-left">Cobrado Mensalmente, Próxima Data De Cobrança</div>
              <div className="text-sm text-center md:text-right">13/10/2025 18:13</div>
            </div>
          )}
          <div className={`grid grid-cols-1 md:grid-cols-2 p-6 items-center gap-4 md:gap-0${!isPaid ? " border-t" : ""}`}>
            <div className="text-center md:text-left space-y-2">
              <div className="text-sm">Plano De Atualização</div>
              <div className="text-xs text-muted-foreground">Atualize para acessar mais recursos</div>
              {/* Removido seletor de período */}
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <div className="text-sm">Sessões</div>
                <Select value={targetSessions} onValueChange={(v) => setTargetSessions(v as Sessions)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {sessionOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt === "2" ? "Individual (2 sessões)" : opt === "3" ? "Personalizado (3 sessões)" : "Personalizado (5 sessões)"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0 space-y-2">
              <div>
                <span className="text-2xl font-semibold">R$ {billingCycle === "mensal" ? priceMonthly : priceAnnual}</span>
                <span className="text-sm text-muted-foreground">{billingCycle === "mensal" ? "/mês" : "/ano"}</span>
              </div>
              {/* <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={changing}>mudar plano</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar alteração de plano</AlertDialogTitle>
                    <AlertDialogDescription>
                      O novo valor será aplicado a partir da próxima cobrança. Confirma alterar para {targetSessions} sessões ({billingCycle})?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleChangePlan}>Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog> */}
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Mudar plano</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Redirecionando para seleção de plano</AlertDialogTitle>
                    <AlertDialogDescription>
                      Você será redirecionado para a tela de seleção de plano e pagamento para concluir a alteração.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                        if (typeof window !== "undefined") {
                          window.location.href = "/dashboard?tab=dashboard"
                        }
                    }}>Confirmar</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
          <div className="p-6 text-center md:text-left">
            <a href="#" className="text-sm text-primary underline-offset-4 hover:underline">Veja informações detalhadas sobre todos os planos e recursos</a>
          </div>
        </div>
      </div>
    </div>
  )
}