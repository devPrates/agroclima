"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
// Removed unused Badge import
import { useSearchParams, useRouter } from "next/navigation"
import { SectionHeader } from "./section-header"
import { PlanCardIndividual } from "./plan-card-individual"
import { PlanCardCustom } from "./plan-card-custom"
import { PersonalizedActiveCard } from "./personalized-active-card"
import { PlanUpgradeCard } from "./plan-upgrade-card"
import { BillingHistory } from "./billing-history"
import { CancelPlanCard } from "./cancel-plan-card"
import { ProfileSection } from "./profile-section"

type UserProfile = {
  nome: string
  login: string
  max_sessions: number
  pagante: string // "n" ou "s"
} | null

type Section = "dashboard" | "plan" | "perfil"

type PaymentRow = { name: string; amount: number; date: string }

export function DashboardContent({ user, payerEmail, monthlyPrice = 25, annualPrice = 300, sessions3Monthly = 70, sessions5Monthly = 60, payments = [] }: { user: UserProfile, payerEmail?: string, monthlyPrice?: number, annualPrice?: number, sessions3Monthly?: number, sessions5Monthly?: number, payments?: PaymentRow[] }) {
  const [section, setSection] = useState<Section>("dashboard")
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  useEffect(() => setMounted(true), [])
  const [customSessions, setCustomSessions] = useState<"3" | "5">("3")
  const [billingCycle, setBillingCycle] = useState<"mensal" | "anual">("mensal")
  const [checkingOut, setCheckingOut] = useState(false)

  useEffect(() => {
    const tab = searchParams.get("tab") as Section | null
    if (tab === "dashboard" || tab === "perfil" || tab === "plan") {
      setSection(tab)
    }
  }, [searchParams])

  // Derivar rótulo de plano atual pelo usuário
  const currentPlanLabel = !user
    ? "—"
    : user.pagante === "n"
      ? "Gratuito"
      : user.max_sessions === 2
        ? "Individual"
        : "Personalizado"

  return (
    <div className="min-h-screen p-2 md:p-6">
      {/* Main content */}
      <div className="space-y-6">
          <div className="flex items-center justify-between">
            <SectionHeader section={section} />
          </div>

          {section === "dashboard" ? (
            <>
              {(() => {
                const planType = user
                  ? user.pagante === "n"
                    ? "Gratuito"
                    : user.max_sessions === 2
                    ? "Individual"
                    : "Personalizado"
                  : null

                if (!planType) {
                  return (
                    <Card>
                      <CardContent className="p-6">
                        <div className="text-sm text-muted-foreground">Não foi possível determinar seu plano.</div>
                      </CardContent>
                    </Card>
                  )
                }

                if (planType === "Gratuito") {
                  return (
                    <div className="space-y-4">
                      <PlanCardIndividual
                        monthlyPrice={monthlyPrice}
                        annualPrice={annualPrice}
                        billingCycle={billingCycle}
                        onBillingCycleChange={setBillingCycle}
                        payerEmail={payerEmail}
                        checkingOut={checkingOut}
                        setCheckingOut={setCheckingOut}
                      />
                      <PlanCardCustom
                        customSessions={customSessions}
                        onCustomSessionsChange={setCustomSessions}
                        billingCycle={billingCycle}
                        onBillingCycleChange={setBillingCycle}
                        sessions3Monthly={sessions3Monthly}
                        sessions5Monthly={sessions5Monthly}
                        payerEmail={payerEmail}
                        checkingOut={checkingOut}
                        setCheckingOut={setCheckingOut}
                      />
                    </div>
                  )
                }

                if (planType === "Individual") {
                  return (
                    <PlanCardCustom
                      customSessions={customSessions}
                      onCustomSessionsChange={setCustomSessions}
                      billingCycle={billingCycle}
                      onBillingCycleChange={setBillingCycle}
                      sessions3Monthly={sessions3Monthly}
                      sessions5Monthly={sessions5Monthly}
                      payerEmail={payerEmail}
                      checkingOut={checkingOut}
                      setCheckingOut={setCheckingOut}
                    />
                  )
                }

                // Personalizado: mostrar cartão de upsell se houver plano superior (ex.: 3 -> 5 sessões)
                return (
                  <>
                    <PersonalizedActiveCard />
                    {user && user.max_sessions < 5 && (
                      <div className="space-y-4">
                        <PlanCardCustom
                          customSessions={"5"}
                          onCustomSessionsChange={setCustomSessions}
                          billingCycle={billingCycle}
                          onBillingCycleChange={setBillingCycle}
                          sessions3Monthly={sessions3Monthly}
                          sessions5Monthly={sessions5Monthly}
                          payerEmail={payerEmail}
                          checkingOut={checkingOut}
                          setCheckingOut={setCheckingOut}
                        />
                      </div>
                    )}
                  </>
                )
              })()}
            </>
          ) : section === "plan" ? (
            <>
              <PlanUpgradeCard
                planLabel={currentPlanLabel}
                isPaid={Boolean(user && user.pagante !== "n")}
                monthlyPrice={monthlyPrice}
                annualPrice={annualPrice}
                billingCycle={billingCycle}
                onBillingCycleChange={setBillingCycle}
                payerEmail={payerEmail}
                currentSessions={user?.max_sessions ?? 2}
                sessions3Monthly={sessions3Monthly}
                sessions5Monthly={sessions5Monthly}
              />

              <BillingHistory payments={payments} />

              <CancelPlanCard disabled={!user || user.pagante === "n"} />
            </>
          ) : (
            <ProfileSection user={user} />
          )}
      </div>
    </div>
  )
}