"use client"

import { useEffect, useState } from "react"
import { SignOutButton } from "@/components/signout-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { Check, Loader2 } from "lucide-react"
import { Sun, Moon } from "lucide-react"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
// Removed unused Badge import
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useSearchParams, useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

type UserProfile = {
  nome: string
  login: string
  max_sessions: number
  pagante: string // "n" ou "s"
} | null

type Section = "dashboard" | "plan" | "perfil"

export function DashboardContent({ user, payerEmail, monthlyPrice = 25, annualPrice = 300, sessions3Monthly = 70, sessions5Monthly = 60 }: { user: UserProfile, payerEmail?: string, monthlyPrice?: number, annualPrice?: number, sessions3Monthly?: number, sessions5Monthly?: number }) {
  const [section, setSection] = useState<Section>("plan")
  const { theme, setTheme } = useTheme()
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
            <div>
              {section === "dashboard" ? (
                <>
                  <h1 className="text-3xl font-semibold">Dashboard</h1>
                  <p className="text-sm text-muted-foreground mt-2">Resumo e ações rápidas conforme seu plano.</p>
                </>
              ) : section === "plan" ? (
                <>
                  <h1 className="text-3xl font-semibold">Plano e Faturamento</h1>
                  <p className="text-sm text-muted-foreground mt-2">Veja seu plano de assinatura e informações de cobrança.</p>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-semibold">Perfil</h1>
                  <p className="text-sm text-muted-foreground mt-2">Seus dados de acesso e plano atual.</p>
                </>
              )}
            </div>
            {/* Actions moved to Navbar in layout */}
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
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">Plano Individual</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
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
                            <div className="shrink-0 text-right space-y-2">
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-xs text-muted-foreground">anual</span>
                                <Switch checked={billingCycle === "mensal"} onCheckedChange={(v) => setBillingCycle(v ? "mensal" : "anual")} />
                                <span className="text-xs text-muted-foreground">mensal</span>
                              </div>
                              <div>
                                <span className="text-2xl font-semibold">R$ {billingCycle === "mensal" ? monthlyPrice : annualPrice}</span>
                                <span className="text-sm text-muted-foreground">{billingCycle === "mensal" ? "/mês" : "/ano"}</span>
                              </div>
                              <Button
                                disabled={checkingOut}
                                onClick={async () => {
                                  try {
                                    setCheckingOut(true)
                                    if (billingCycle === "mensal") {
                                      // Assinatura mensal: cria plano (R$1/mês) e preapproval
                                      const planResp = await fetch("/api/mercadopago/preapproval-plan", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ transaction_amount: monthlyPrice, currency_id: "BRL", frequency: 1, frequency_type: "months", billing_day_proportional: false }),
                                      })
                                      const planData = await planResp.json()
                                      if (!planResp.ok || !planData?.id) {
                                        console.error("Falha ao criar preapproval_plan:", planResp.status, planData)
                                        const msg = planData?.error || planData?.details?.message || planData?.details?.raw || "Não foi possível iniciar a assinatura mensal. Tente novamente."
                                        alert(String(msg))
                                        return
                                      }

                                      const preResp = await fetch("/api/mercadopago/preapproval", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({
                                          plan_id: planData.id,
                                          payer_email: payerEmail,
                                          external_reference: payerEmail,
                                          back_url: typeof window !== "undefined" ? `${window.location.origin}/mercadopago/success` : undefined,
                                        }),
                                      })
                                      const preData = await preResp.json()
                                      if (!preResp.ok || !preData?.init_point) {
                                        console.error("Falha ao criar preapproval:", preResp.status, preData)
                                        const msg = preData?.error || preData?.details?.message || preData?.details?.raw || "Não foi possível iniciar a assinatura mensal. Tente novamente."
                                        alert(String(msg))
                                        return
                                      }
                                      window.location.href = preData.init_point
                                    } else {
                                      // Cobrança anual: preferência de checkout
                                      const resp = await fetch("/api/mercadopago/preference", {
                                        method: "POST",
                                        headers: { "Content-Type": "application/json" },
                                        body: JSON.stringify({ amount: annualPrice, description: "Plano Individual - Anual", payerEmail: payerEmail }),
                                      })
                                      const data = await resp.json()
                                      if (!resp.ok || !data?.init_point) {
                                        console.error("Falha ao criar preferência:", data)
                                        alert("Não foi possível iniciar o pagamento anual. Tente novamente.")
                                        return
                                      }
                                      window.location.href = data.init_point
                                    }
                                  } catch (err) {
                                    console.error(err)
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
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-xl">Plano Personalizado</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                          <div className="md:flex md:items-center md:justify-between gap-6">
                            <div className="space-y-2">
                              <div className="text-sm text-muted-foreground">Solução sob medida para propriedades e equipes.</div>
                              <ul className="mt-2 space-y-2 text-sm">
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Mais contas de acesso</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Integração com sistemas existentes</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Gestão multiusuário avançada</li>
                                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Suporte dedicado</li>
                              </ul>
                            </div>
                            <div className="shrink-0 text-right space-y-2">
                              <div className="text-sm">Sessões</div>
                              <div className="flex items-center gap-2 justify-end">
                                <Select value={customSessions} onValueChange={(v) => setCustomSessions(v as "3" | "5")}>
                                  <SelectTrigger className="w-[160px]">
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="3">3 sessões</SelectItem>
                                    <SelectItem value="5">5 sessões</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-xs text-muted-foreground">anual</span>
                                <Switch checked={billingCycle === "mensal"} onCheckedChange={(v) => setBillingCycle(v ? "mensal" : "anual")} />
                                <span className="text-xs text-muted-foreground">mensal</span>
                              </div>
                              <div>
                                <span className="text-2xl font-semibold">R$ {billingCycle === "mensal" ? (customSessions === "3" ? sessions3Monthly : sessions5Monthly) : (customSessions === "3" ? sessions3Monthly * 12 : sessions5Monthly * 12)}</span>
                                <span className="text-sm text-muted-foreground">{billingCycle === "mensal" ? "/mês" : "/ano"}</span>
                              </div>
                              <Button variant="outline" asChild>
                                <a href="/dashboard?tab=plan">Adquirir plano</a>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                }

                if (planType === "Individual") {
                  return (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-xl">Plano Personalizado</CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="md:flex md:items-center md:justify-between gap-6">
                          <div className="space-y-2">
                            <div className="text-sm text-muted-foreground">Escale para equipes e mais recursos.</div>
                            <ul className="mt-2 space-y-2 text-sm">
                              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Mais contas de acesso</li>
                              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Integração com sistemas existentes</li>
                              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Gestão multiusuário avançada</li>
                              <li className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Suporte dedicado</li>
                            </ul>
                          </div>
                          <div className="shrink-0 text-right space-y-2">
                            <div className="text-sm">Sessões</div>
                            <div className="flex items-center gap-2 justify-end">
                              <Select value={customSessions} onValueChange={(v) => setCustomSessions(v as "3" | "5")}>
                                <SelectTrigger className="w-[160px]">
                                  <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="3">3 sessões</SelectItem>
                                  <SelectItem value="5">5 sessões</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-xs text-muted-foreground">anual</span>
                              <Switch checked={billingCycle === "mensal"} onCheckedChange={(v) => setBillingCycle(v ? "mensal" : "anual")} />
                              <span className="text-xs text-muted-foreground">mensal</span>
                            </div>
                            <div>
                              <span className="text-2xl font-semibold">R$ {billingCycle === "mensal" ? (customSessions === "3" ? sessions3Monthly : sessions5Monthly) : (customSessions === "3" ? sessions3Monthly * 12 : sessions5Monthly * 12)}</span>
                              <span className="text-sm text-muted-foreground">{billingCycle === "mensal" ? "/mês" : "/ano"}</span>
                            </div>
                            <Button variant="outline" asChild>
                              <a href="/dashboard?tab=plan">Adquirir plano</a>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                }

                // Personalizado
                return (
                  <Card>
                    <CardContent className="p-6 space-y-4">
                      <div>
                        <h2 className="text-xl font-semibold">Bem-vindo!</h2>
                        <p className="text-sm text-muted-foreground">Seu plano personalizado está ativo.</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button asChild>
                          <a href="/dashboard?tab=plan">Ver plano e faturamento</a>
                        </Button>
                        <Button variant="outline" asChild>
                          <a href="https://agroclima.net/sbadmin2/perfil.php" target="_blank" rel="noopener noreferrer">Acessar o sistema</a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })()}
            </>
          ) : section === "plan" ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">Plano De Assinatura</CardTitle>
                    <div className="text-base inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-foreground border">
                      {user ? (user.pagante === "n" ? "Gratuito" : "Pago") : "—"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-0 p-0">
                  <div className="divide-y">
                    {user && user.pagante !== "n" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 p-6">
                        <div className="text-sm text-center md:text-left">Cobrado Mensalmente, Próxima Data De Cobrança</div>
                        <div className="text-sm text-center md:text-right">13/10/2025 18:13</div>
                      </div>
                    )}
                    <div className={`grid grid-cols-1 md:grid-cols-2 p-6 items-center gap-4 md:gap-0${user?.pagante === "n" ? " border-t" : ""}`}>
                      <div className="text-center md:text-left space-y-2">
                        <div className="text-sm">Plano De Atualização</div>
                        <div className="text-xs text-muted-foreground">Atualize para acessar mais recursos</div>
                        <div className="flex items-center justify-center md:justify-start gap-2">
                          <div className="text-sm">Período</div>
                          <Select value={billingCycle} onValueChange={(v) => setBillingCycle(v as "mensal" | "anual")}> 
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
                </CardContent>
              </Card>

              <div>
                <h2 className="text-base font-semibold mb-3 text-center md:text-left">Histórico De Cobrança</h2>
                <Card>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Quantia</TableHead>
                          <TableHead>Data</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody />
                    </Table>
                    <div className="mt-4 text-center text-sm text-muted-foreground">Nenhuma cobrança registrada ainda.</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <CardTitle className="text-base text-center sm:text-left">Cancelamento De Plano</CardTitle>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={user?.pagante === "n"}>Cancelar inscrição</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmar cancelamento</AlertDialogTitle>
                          <AlertDialogDescription>
                            Ao confirmar, sua assinatura será cancelada e você manterá o acesso até o fim do período vigente.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Manter plano</AlertDialogCancel>
                          <AlertDialogAction>Confirmar cancelamento</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  <CardDescription>Se você cancelar agora, poderá continuar acessando sua assinatura até que sua assinatura atual expire.</CardDescription>
                </CardHeader>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dados do Perfil</CardTitle>
                <CardDescription>Veja suas informações de acesso e o plano atual.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder-user.jpg" alt={user.nome} />
                        <AvatarFallback>{user.nome?.[0] ?? "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.nome}</div>
                        <div className="text-sm text-muted-foreground">{user.login}</div>
                      </div>
                    </div>
                    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                          <Label htmlFor="perfil-nome">Nome</Label>
                          <Input id="perfil-nome" value={user.nome} disabled />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="perfil-login">Login</Label>
                          <Input id="perfil-login" value={user.login} disabled />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="perfil-max">Máx. sessões</Label>
                          <Input id="perfil-max" value={String(user.max_sessions)} disabled />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="perfil-plano">Plano</Label>
                          <Input id="perfil-plano" value={user.pagante === "n" ? "Gratuito" : "Pago"} disabled />
                          {user.pagante === "n" && (
                            <p className="text-sm text-muted-foreground">Seu plano atual é gratuito.</p>
                          )}
                        </div>
                      </div>
                    </form>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Não foi possível carregar os dados do usuário.</p>
                )}
              </CardContent>
            </Card>
          )}
      </div>
    </div>
  )
}