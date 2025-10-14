"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ExternalLink, LogIn } from "lucide-react"

function SuccessContent() {
  const params = useSearchParams()
  const paymentId = params.get("payment_id")
  const status = params.get("status")
  // Não exibir referência na tela de sucesso
  // const externalRef = params.get("external_reference")

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <CheckCircle2 className="h-14 w-14 text-emerald-500" aria-hidden />
          </div>
          <CardTitle className="text-2xl">Pagamento confirmado!</CardTitle>
          <CardDescription>
            Obrigado! Seu pagamento foi processado com sucesso.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(paymentId || status) && (
            <div className="rounded-md border p-4 text-sm text-center">
              <p className="font-medium mb-2">Detalhes do pagamento</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-muted-foreground justify-items-center">
                {paymentId && (
                  <p>
                    <span className="text-foreground">ID:</span> {paymentId}
                  </p>
                )}
                {status && (
                  <p>
                    <span className="text-foreground">Status:</span> {status}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Button asChild className="w-full sm:w-auto">
              <a href="https://agroclima.net/sbadmin2/perfil.php" target="_blank" rel="noopener noreferrer">
                <LogIn className="mr-2 h-4 w-4" /> Acessar o sistema
              </a>
            </Button>
            <Button variant="outline" asChild className="w-full sm:w-auto">
              <a href="/dashboard?tab=dashboard">
                <ExternalLink className="mr-2 h-4 w-4" /> Acessar conta
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function MpSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-12rem)]"><span className="text-muted-foreground">Carregando...</span></div>}>
        <SuccessContent />
      </Suspense>
    </div>
  )
}