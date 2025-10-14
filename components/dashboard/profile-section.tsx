"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type UserProfile = {
  nome: string
  login: string
  max_sessions: number
  pagante: string
} | null

export function ProfileSection({ user }: { user: UserProfile }) {
  return (
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
  )
}