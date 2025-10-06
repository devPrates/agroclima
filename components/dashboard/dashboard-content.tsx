"use client"

import { useEffect, useState } from "react"
import { SignOutButton } from "@/components/signout-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { Sun, Moon } from "lucide-react"
// Removed unused Badge import
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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

type Section = "plan" | "perfil"

export function DashboardContent({ user }: { user: UserProfile }) {
  const [section, setSection] = useState<Section>("plan")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="md:sticky md:top-6 h-fit border rounded-lg p-4 bg-card">
          <div className="space-y-6">
            <div>
              <div className="text-base font-bold uppercase tracking-wider text-foreground">Conta</div>
              <ul className="mt-2 space-y-1">
                <li>
                  <button
                    className={`text-sm rounded-md px-2 py-1 transition-colors ${section === "perfil" ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
                    onClick={() => setSection("perfil")}
                  >
                    Perfil
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <div className="text-base font-bold uppercase tracking-wider text-foreground">Subscrição</div>
              <ul className="mt-2 space-y-1">
                <li>
                  <button
                    className={`text-sm rounded-md px-2 py-1 transition-colors ${section === "plan" ? "bg-muted text-foreground font-medium" : "text-muted-foreground hover:bg-muted"}`}
                    onClick={() => setSection("plan")}
                  >
                    Plano e Faturamento
                  </button>
                </li>
                <li>
                  <a
                    href="https://agroclima.net/sbadmin2/perfil.php"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground rounded-md px-2 py-1 hover:bg-muted transition-colors"
                  >
                    Acessar Estações
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              {section === "plan" ? (
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
            <div className="flex items-center gap-2">
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              )}
              <SignOutButton />
            </div>
          </div>

          {section === "plan" ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">Plano De Assinatura</CardTitle>
                    <div className="text-base">
                      {user ? (user.pagante === "n" ? "Gratuito" : "Pago") : "—"}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-0 p-0">
                  <div className="divide-y">
                    {user && user.pagante !== "n" && (
                      <div className="grid grid-cols-1 md:grid-cols-2 p-6">
                        <div className="text-sm">Cobrado Mensalmente, Próxima Data De Cobrança</div>
                        <div className="text-right text-sm">13/10/2025 18:13</div>
                      </div>
                    )}
                    <div className={`grid grid-cols-1 md:grid-cols-2 p-6 items-center${user?.pagante === "n" ? " border-t" : ""}`}>
                      <div>
                        <div className="text-sm">Plano De Atualização</div>
                        <div className="text-xs text-muted-foreground">Atualize para acessar mais recursos</div>
                      </div>
                      <div className="text-right">
                        <Button variant="outline">Mudar para o plano anual</Button>
                      </div>
                    </div>
                    <div className="p-6">
                      <a href="#" className="text-sm text-primary underline-offset-4 hover:underline">Veja informações detalhadas sobre todos os planos e recursos</a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h2 className="text-base font-semibold mb-3">Histórico De Cobrança</h2>
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
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Cancelamento De Plano</CardTitle>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Cancelar inscrição</Button>
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
        </main>
      </div>
    </div>
  )
}