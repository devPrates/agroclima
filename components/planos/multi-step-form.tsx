"use client"

import { useState } from "react"
import { PersonalInfoForm } from "./personal-info-form"
import { PaymentForm } from "./payment-form"
import { SuccessStep } from "./success-step"
import { StepIndicator } from "./step-indicator"

type FormData = {
  personalInfo: {
    name: string
    email: string
    password: string
    phone: string
    activity: string
    address: string
  }
  paymentInfo: {
    cardNumber: string
    cardName: string
    expiryDate: string
    cvv: string
  }
}

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      name: "",
      email: "",
      password: "",
      phone: "",
      activity: "",
      address: "",
    },
    paymentInfo: {
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      cvv: "",
    },
  })

  const handlePersonalInfoSubmit = (data: FormData["personalInfo"]) => {
    setFormData((prev) => ({
      ...prev,
      personalInfo: data,
    }))
    setCurrentStep(2)
  }

  const handlePaymentInfoSubmit = (data: FormData["paymentInfo"]) => {
    setFormData((prev) => ({
      ...prev,
      paymentInfo: data,
    }))
    setCurrentStep(3)
  }

  const handleBackToLogin = () => {
    // Aqui você pode redirecionar para a página de login
    console.log("Redirecionando para login...")
  }

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <StepIndicator currentStep={currentStep} totalSteps={3} />

      <div className="mt-8">
        {currentStep === 1 && (
          <PersonalInfoForm initialData={formData.personalInfo} onSubmit={handlePersonalInfoSubmit} />
        )}

        {currentStep === 2 && (
          <PaymentForm
            initialData={formData.paymentInfo}
            onSubmit={handlePaymentInfoSubmit}
            onBack={goBack}
            planInfo={{
              name: "Plano Anual Premium",
              price: 299.9,
              period: "Anual",
              benefits: [
                "Acesso ilimitado a todos os recursos",
                "Suporte prioritário 24/7",
                "Atualizações exclusivas",
                "Sem taxas adicionais",
              ],
            }}
          />
        )}

        {currentStep === 3 && <SuccessStep onBackToLogin={handleBackToLogin} />}
      </div>
    </div>
  )
}
