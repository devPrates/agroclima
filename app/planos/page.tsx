"use client"

import { useState } from "react"
import { PlanosStep1 } from "@/components/planos/planos-step1"
import { PlanosStep2 } from "@/components/planos/planos-step2"
import { PlanoData } from "@/actions/planos-actions"

export default function PlanosPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [planoData, setPlanoData] = useState<PlanoData | null>(null)

  const handleStep1Complete = (data: PlanoData) => {
    setPlanoData(data)
    setCurrentStep(2)
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">Escolha seu Plano</h1>
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                1
              </div>
              <span>Cadastro</span>
            </div>
            <div className="w-12 h-px bg-border"></div>
            <div
              className={`flex items-center space-x-2 ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
              >
                2
              </div>
              <span>Confirmação</span>
            </div>
          </div>
        </div>

        {currentStep === 1 && <PlanosStep1 onComplete={handleStep1Complete} />}

        {currentStep === 2 && planoData && <PlanosStep2 planoData={planoData} />}
      </div>
    </div>
  )
}
