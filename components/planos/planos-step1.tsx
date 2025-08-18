"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { criarConta } from "@/actions/planos-actions"
import { PlanoData } from "@/actions/planos-actions"



const formSchema = z
  .object({
    nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string(),
    plano: z.enum(["Gratuito", "Individual", "Personalizado"]),
    sessoes: z.number().min(1).optional(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "Senhas não coincidem",
    path: ["confirmarSenha"],
  })

type FormData = z.infer<typeof formSchema>

interface PlanosStep1Props {
  onComplete: (data: PlanoData) => void
}

export function PlanosStep1({ onComplete }: PlanosStep1Props) {
  const [isLoading, setIsLoading] = useState(false)
  const [precoTotal, setPrecoTotal] = useState(0)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      plano: "Gratuito",
      sessoes: 2, // iniciando com 2 sessões para o cálculo correto
    },
  })

  const planoSelecionado = form.watch("plano")
  const sessoes = form.watch("sessoes")

  useEffect(() => {
    let preco = 0
    if (planoSelecionado === "Individual") {
      preco = 1000
    } else if (planoSelecionado === "Personalizado") {
      const precoBase = 1050 // preço do plano individual + R$ 50
      const sessoesExtras = Math.max(0, (sessoes || 2) - 2) // sessões além das 2 incluídas
      preco = precoBase + sessoesExtras * 50
    }
    setPrecoTotal(preco)
  }, [planoSelecionado, sessoes])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      await criarConta({
        ...data,
        precoTotal,
      })

      onComplete({
        ...data,
        precoTotal,
      })
    } catch (error) {
      console.error("Erro ao criar conta:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getButtonText = () => {
    switch (planoSelecionado) {
      case "Gratuito":
        return "Criar conta"
      case "Individual":
      case "Personalizado":
        return "Ir para o pagamento"
      default:
        return "Continuar"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-2xl">Dados de Cadastro</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <div className="min-h-[40px]">
                      <Input placeholder="Seu nome completo" {...field} />
                    </div>
                    <div className="min-h-[16px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <div className="min-h-[40px]">
                      <Input type="email" placeholder="seu@email.com" {...field} />
                    </div>
                    <div className="min-h-[16px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <div className="min-h-[40px]">
                      <Input type="password" placeholder="Sua senha" {...field} />
                    </div>
                    <div className="min-h-[16px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmarSenha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Senha</FormLabel>
                    <div className="min-h-[40px]">
                      <Input type="password" placeholder="Confirme sua senha" {...field} />
                    </div>
                    <div className="min-h-[16px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="plano"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plano</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <div className="min-h-[40px]">
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um plano" />
                        </SelectTrigger>
                      </div>
                      <SelectContent>
                        <SelectItem value="Gratuito">Gratuito</SelectItem>
                        <SelectItem value="Individual">Individual</SelectItem>
                        <SelectItem value="Personalizado">Personalizado</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="min-h-[16px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />

              {planoSelecionado === "Personalizado" && (
                <FormField
                  control={form.control}
                  name="sessoes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Sessões</FormLabel>
                      <div className="min-h-[40px]">
                        <Input
                          type="number"
                          min="2"
                          placeholder="2"
                          name={field.name}
                          value={field.value?.toString() || "2"}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 2)}
                          onBlur={field.onBlur}
                          ref={field.ref}
                        />
                      </div>
                      <div className="min-h-[16px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>

            {precoTotal > 0 && (
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Valor Total:</span>
                  <span className="text-2xl font-bold text-primary">R$ {precoTotal.toLocaleString("pt-BR")}</span>
                </div>
                {planoSelecionado === "Personalizado" && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Plano base (2 sessões): R$ 1.050,00
                    {sessoes && sessoes > 2 && <span> + {sessoes - 2} sessão(ões) extra × R$ 50,00</span>}
                  </p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {getButtonText()}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
