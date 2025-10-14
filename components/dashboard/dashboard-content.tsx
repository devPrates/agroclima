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

export function DashboardContent({ user, payerEmail, monthlyPrice = 25, annualPrice = 300, sessions3Monthly = 70, sessions5Monthly = 60 }: { user: UserProfile, payerEmail?: string, monthlyPrice?: number, annualPrice?: number, sessions3Monthly?: number, sessions5Monthly?: number }) {
  const [section, setSection] = useState<Section>("plan")
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
                    : user.max_sessions > 1
                    ? "Personalizado"
                    : "Individual"
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

                // Personalizado
                return <PersonalizedActiveCard />
              })()}
            </>
          ) : section === "plan" ? (
            <>
              <PlanUpgradeCard
                planLabel={user ? (user.pagante === "n" ? "Gratuito" : "Pago") : "—"}
                isPaid={Boolean(user && user.pagante !== "n")}
                monthlyPrice={monthlyPrice}
                annualPrice={annualPrice}
                billingCycle={billingCycle}
                onBillingCycleChange={setBillingCycle}
              />

              <BillingHistory />

              <CancelPlanCard disabled={!user || user.pagante === "n"} />
            </>
          ) : (
            <ProfileSection user={user} />
          )}
      </div>
    </div>
  )
}