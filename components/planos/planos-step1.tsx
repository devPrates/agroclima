"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { criarConta } from "@/actions/planos-actions"
import { PlanoData } from "@/actions/planos-actions"
import { toast } from "sonner"



const formSchema = z
  .object({
    nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("Email inválido"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string(),
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

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      const result = await criarConta({
        ...data,
        plano: "Gratuito",
        precoTotal: 0,
      } as PlanoData)

      // Avança para o passo 2 (verificação por email/OTP)
      toast.success("Conta criada com sucesso!", {
        description: "Agora verifique seu email para entrar.",
        duration: 4000,
      })
      onComplete({
        ...data,
        plano: "Gratuito",
        precoTotal: 0,
      } as PlanoData)
    } catch (error: any) {
      console.error("Erro ao criar conta:", error)
      
      // Mostrar toast de erro
      toast.error("Erro ao criar conta", {
        description: error.message || "Ocorreu um erro inesperado. Tente novamente.",
        duration: 5000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Removida tela de sucesso; fluxo segue para passo 2

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="px-6 py-6 space-y-1">
        <CardTitle className="text-center text-2xl">Criar Conta</CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Preencha seus dados para criar sua conta e continuar.
        </p>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <div className="min-h-[40px]">
                      <Input placeholder="Seu nome completo" className="w-full" {...field} />
                    </div>
                    <div className="min-h-[20px]">
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
                      <Input type="email" placeholder="seu@email.com" className="w-full" {...field} />
                    </div>
                    <div className="min-h-[16px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="senha"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <div className="min-h-[40px]">
                      <Input type="password" placeholder="Sua senha" className="w-full" {...field} />
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
                      <Input type="password" placeholder="Confirme sua senha" className="w-full" {...field} />
                    </div>
                    <div className="min-h-[16px]">
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar conta
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
