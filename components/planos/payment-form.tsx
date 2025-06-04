"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface PaymentFormProps {
  initialData: {
    cardNumber: string
    cardName: string
    expiryDate: string
    cvv: string
  }
  onSubmit: (data: {
    cardNumber: string
    cardName: string
    expiryDate: string
    cvv: string
  }) => void
  onBack: () => void
  planInfo?: {
    name: string
    price: number
    period: string
    benefits: string[]
  }
}

export function PaymentForm({
  initialData,
  onSubmit,
  onBack,
  planInfo = {
    name: "Plano Anual Premium",
    price: 299.9,
    period: "Anual",
    benefits: [
      "Acesso ilimitado a todos os recursos",
      "Suporte prioritário 24/7",
      "Atualizações exclusivas",
      "Sem taxas adicionais",
    ],
  },
}: PaymentFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Formatação específica para campos de cartão
    let formattedValue = value

    if (name === "cardNumber") {
      // Remove caracteres não numéricos
      formattedValue = value.replace(/\D/g, "")
      // Adiciona espaços a cada 4 dígitos
      formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, "$1 ").trim()
      // Limita a 19 caracteres (16 dígitos + 3 espaços)
      formattedValue = formattedValue.substring(0, 19)
    } else if (name === "expiryDate") {
      // Remove caracteres não numéricos
      formattedValue = value.replace(/\D/g, "")
      // Adiciona barra após os primeiros 2 dígitos
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.substring(0, 2)}/${formattedValue.substring(2, 4)}`
      }
      // Limita a 5 caracteres (MM/YY)
      formattedValue = formattedValue.substring(0, 5)
    } else if (name === "cvv") {
      // Remove caracteres não numéricos e limita a 4 dígitos
      formattedValue = value.replace(/\D/g, "").substring(0, 4)
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validação do número do cartão (remove espaços para contar dígitos)
    const cardNumberDigits = formData.cardNumber.replace(/\s/g, "")
    if (!cardNumberDigits) {
      newErrors.cardNumber = "Número do cartão é obrigatório"
    } else if (cardNumberDigits.length < 13 || cardNumberDigits.length > 16) {
      newErrors.cardNumber = "Número do cartão inválido"
    }

    if (!formData.cardName.trim()) {
      newErrors.cardName = "Nome no cartão é obrigatório"
    }

    // Validação da data de expiração
    if (!formData.expiryDate) {
      newErrors.expiryDate = "Data de expiração é obrigatória"
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Formato inválido. Use MM/AA"
    } else {
      const [month, year] = formData.expiryDate.split("/")
      const currentDate = new Date()
      const currentYear = currentDate.getFullYear() % 100 // Últimos 2 dígitos do ano
      const currentMonth = currentDate.getMonth() + 1 // Janeiro é 0

      const expiryMonth = Number.parseInt(month, 10)
      const expiryYear = Number.parseInt(year, 10)

      if (expiryMonth < 1 || expiryMonth > 12) {
        newErrors.expiryDate = "Mês inválido"
      } else if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        newErrors.expiryDate = "Cartão expirado"
      }
    }

    // Validação do CVV
    if (!formData.cvv) {
      newErrors.cvv = "CVV é obrigatório"
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = "CVV inválido"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Informações de Pagamento</h2>

      {/* Resumo do Plano */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
        <h3 className="font-medium text-lg mb-2">Resumo da Assinatura</h3>

        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">{planInfo.name}</span>
          <span className="font-bold text-xl">R$ {planInfo.price.toFixed(2)}</span>
        </div>

        <div className="text-sm text-gray-500 mb-2">Período: {planInfo.period}</div>

        <div className="mt-3">
          <p className="text-sm font-medium mb-2">O que está incluído:</p>
          <ul className="space-y-1">
            {planInfo.benefits.map((benefit, index) => (
              <li key={index} className="text-sm flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Número do Cartão</Label>
        <Input
          id="cardNumber"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="0000 0000 0000 0000"
          maxLength={19}
        />
        {errors.cardNumber && <p className="text-sm text-red-500">{errors.cardNumber}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardName">Nome no Cartão</Label>
        <Input
          id="cardName"
          name="cardName"
          value={formData.cardName}
          onChange={handleChange}
          placeholder="Nome como está no cartão"
        />
        {errors.cardName && <p className="text-sm text-red-500">{errors.cardName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Data de Expiração</Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/AA"
            maxLength={5}
          />
          {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input id="cvv" name="cvv" value={formData.cvv} onChange={handleChange} placeholder="123" maxLength={4} />
          {errors.cvv && <p className="text-sm text-red-500">{errors.cvv}</p>}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Voltar
        </Button>
        <Button type="submit" className="flex-1">
          Finalizar Pagamento
        </Button>
      </div>
    </form>
  )
}
