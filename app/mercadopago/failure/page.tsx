"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, Undo2 } from "lucide-react"

function FailureContent() {
  const params = useSearchParams()
  const status = params.get("status")
  const statusDetail = params.get("status_detail")
  const message = params.get("message")

  const reason = message || statusDetail || status || "Falha não especificada"

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
      <Card className="w-full max-w-xl">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            <XCircle className="h-14 w-14 text-red-500" aria-hidden />
          </div>
          <CardTitle className="text-2xl">Pagamento falhou</CardTitle>
          <CardDescription>
            Não foi possível concluir o pagamento. Verifique o motivo abaixo.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-md border p-4 text-sm text-center">
            <p className="font-medium mb-1">Motivo da falha</p>
            <p className="text-muted-foreground break-words">{reason}</p>
          </div>
          <div className="flex justify-center">
            <Button asChild>
              <a href="/dashboard?tab=dashboard">
                <Undo2 className="mr-2 h-4 w-4" /> Voltar para a dashboard
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function MpFailurePage() {
  return (
    <div className="container mx-auto px-4 py-24">
      <Suspense fallback={<div className="flex items-center justify-center min-h-[calc(100vh-12rem)]"><span className="text-muted-foreground">Carregando...</span></div>}>
        <FailureContent />
      </Suspense>
    </div>
  )
}