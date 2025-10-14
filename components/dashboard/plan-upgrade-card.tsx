"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

type BillingCycle = "mensal" | "anual"

export function PlanUpgradeCard({
  planLabel,
  isPaid,
  monthlyPrice,
  annualPrice,
  billingCycle,
  onBillingCycleChange,
}: {
  planLabel: string
  isPaid: boolean
  monthlyPrice: number
  annualPrice: number
  billingCycle: BillingCycle
  onBillingCycleChange: (v: BillingCycle) => void
}) {
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
              <div className="flex items-center justify-center md:justify-start gap-2">
                <div className="text-sm">Período</div>
                <Select value={billingCycle} onValueChange={(v) => onBillingCycleChange(v as BillingCycle)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mensal">Mensal</SelectItem>
                    <SelectItem value="anual">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0 space-y-2">
              <div>
                <span className="text-2xl font-semibold">R$ {billingCycle === "mensal" ? monthlyPrice : annualPrice}</span>
                <span className="text-sm text-muted-foreground">{billingCycle === "mensal" ? "/mês" : "/ano"}</span>
              </div>
              <Button variant="outline">mudar plano</Button>
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