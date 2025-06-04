"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PersonalInfoFormProps {
  initialData: {
    name: string
    email: string
    password: string
    phone: string
    activity: string
    address: string
  }
  onSubmit: (data: {
    name: string
    email: string
    password: string
    phone: string
    activity: string
    address: string
  }) => void
}

export function PersonalInfoForm({ initialData, onSubmit }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório"
    if (!formData.email.trim()) newErrors.email = "Email é obrigatório"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido"

    if (!formData.password.trim()) newErrors.password = "Senha é obrigatória"
    else if (formData.password.length < 6) newErrors.password = "Senha deve ter pelo menos 6 caracteres"

    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório"
    if (!formData.activity.trim()) newErrors.activity = "Atividade é obrigatória"
    if (!formData.address.trim()) newErrors.address = "Endereço é obrigatório"

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
      <h2 className="text-xl font-semibold mb-4">Informações Pessoais</h2>

      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Digite seu nome completo"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="seu@email.com"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Digite sua senha"
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(00) 00000-0000" />
        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="activity">Atividade</Label>
        <Input
          id="activity"
          name="activity"
          value={formData.activity}
          onChange={handleChange}
          placeholder="Sua atividade profissional"
        />
        {errors.activity && <p className="text-sm text-red-500">{errors.activity}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Endereço</Label>
        <Textarea
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          placeholder="Digite seu endereço completo"
          rows={3}
        />
        {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
      </div>

      <Button type="submit" className="w-full">
        Próximo
      </Button>
    </form>
  )
}
