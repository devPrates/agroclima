"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, CreditCard, User } from "lucide-react"
import { PlanoData } from "@/actions/planos-actions"

interface PlanosStep2Props {
  planoData: PlanoData
}

export function PlanosStep2({ planoData }: PlanosStep2Props) {
  const handleLogin = () => {
    // Redirecionar para página de login
    console.log("Redirecionando para login...")
  }

  const handlePagamento = () => {
    // Processar pagamento
    console.log("Processando pagamento...", planoData)
  }

  if (planoData.plano === "Gratuito") {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Conta criada com sucesso!</h2>
              <p className="text-muted-foreground">
                Sua conta gratuita foi criada. Você já pode começar a usar nossos serviços.
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="font-medium">{planoData.nome}</p>
                  <p className="text-sm text-muted-foreground">{planoData.email}</p>
                  <p className="text-sm text-muted-foreground">Plano: {planoData.plano}</p>
                </div>
              </div>
            </div>

            <Button onClick={handleLogin} className="w-full">
              Fazer login no sistema
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Revisão do Plano</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Dados do Cliente</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nome:</span>
              <span>{planoData.nome}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span>{planoData.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plano:</span>
              <span>{planoData.plano}</span>
            </div>
            {planoData.plano === "Personalizado" && planoData.sessoes && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sessões:</span>
                <span>{planoData.sessoes}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <div className="flex justify-between items-center">
            <span className="font-semibold">Valor Total:</span>
            <span className="text-2xl font-bold text-primary">R$ {planoData.precoTotal.toLocaleString("pt-BR")}</span>
          </div>
          {planoData.plano === "Personalizado" && planoData.sessoes && (
            <p className="text-sm text-muted-foreground mt-2">{planoData.sessoes} sessão(ões) × R$ 50,00 cada</p>
          )}
        </div>

        <div className="space-y-3">
          <h4 className="font-medium">Resumo do Plano {planoData.plano}</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            {planoData.plano === "Individual" && (
              <>
                <li>• Acesso completo à plataforma</li>
                <li>• Suporte prioritário</li>
                <li>• Recursos avançados</li>
              </>
            )}
            {planoData.plano === "Personalizado" && (
              <>
                <li>• Plano customizado para suas necessidades</li>
                <li>• {planoData.sessoes} sessão(ões) incluída(s)</li>
                <li>• Suporte dedicado</li>
                <li>• Recursos premium</li>
              </>
            )}
          </ul>
        </div>

        <Button onClick={handlePagamento} className="w-full">
          <CreditCard className="mr-2 h-4 w-4" />
          Realizar pagamento
        </Button>
      </CardContent>
    </Card>
  )
}
