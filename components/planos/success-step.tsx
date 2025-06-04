"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface SuccessStepProps {
  onBackToLogin: () => void
}

export function SuccessStep({ onBackToLogin }: SuccessStepProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-6 text-green-500">
        <CheckCircle size={80} />
      </div>

      <h2 className="text-2xl font-bold mb-2">Pagamento Realizado com Sucesso!</h2>

      <p className="text-gray-600 mb-8 max-w-md">
        Seu cadastro foi concluído e o pagamento foi processado com sucesso. Agora você pode acessar sua conta.
      </p>

      <Button onClick={onBackToLogin} className="px-8">
        Ir para Login
      </Button>
    </div>
  )
}
