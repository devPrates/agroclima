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
import { Loader2, CheckCircle, ExternalLink } from "lucide-react"
import { criarConta } from "@/actions/planos-actions"
import { PlanoData } from "@/actions/planos-actions"
import { toast } from "sonner"



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
  const [showSuccess, setShowSuccess] = useState(false)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      plano: "Gratuito",
      sessoes: 3, // iniciando com 3 sessões como padrão
    },
  })

  const planoSelecionado = form.watch("plano")
  const sessoes = form.watch("sessoes")

  useEffect(() => {
    let preco = 0
    if (planoSelecionado === "Individual") {
      preco = 25
    } else if (planoSelecionado === "Personalizado") {
      // Preços fixos baseados no número de sessões
      if (sessoes === 3) {
        preco = 60
      } else if (sessoes === 5) {
        preco = 70
      } else {
        preco = 60 // padrão para 3 sessões
      }
    }
    setPrecoTotal(preco)
  }, [planoSelecionado, sessoes])

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    try {
      const result = await criarConta({
        ...data,
        precoTotal,
      })

      // Para plano gratuito, mostrar tela de sucesso
      if (data.plano === "Gratuito") {
        toast.success("Conta criada com sucesso!", {
          description: "Sua conta gratuita foi criada. Agora você pode fazer login.",
          duration: 5000,
        })
        setShowSuccess(true)
      } else {
        // Para outros planos, continuar com o fluxo normal
        onComplete({
          ...data,
          precoTotal,
        })
      }
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

  // Tela de sucesso para plano gratuito
  if (showSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader className="px-6 py-6">
          <CardTitle className="text-center text-2xl flex items-center justify-center gap-2">
            <CheckCircle className="h-8 w-8 text-green-500" />
            Conta Criada com Sucesso!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4 px-6 pb-6">
          <div className="space-y-2">
            <p className="text-lg text-muted-foreground">
              Sua conta gratuita foi criada com sucesso!
            </p>
            <p className="text-sm text-muted-foreground">
              Agora você pode fazer login e começar a usar o AgroClima.
            </p>
          </div>
          
          <div className="pt-4">
            <Button 
              onClick={() => window.open('https://agroclima.net', '_blank')}
              className="w-full"
              size="lg"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Ir para Login
            </Button>
          </div>
          
          <div className="pt-2">
            <Button 
              variant="outline" 
              onClick={() => setShowSuccess(false)}
              className="w-full"
            >
              Criar Outra Conta
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="px-6 py-6">
        <CardTitle className="text-center text-2xl">Dados de Cadastro</CardTitle>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="plano"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plano</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um plano" />
                      </SelectTrigger>
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
                      <Select 
                        onValueChange={(value) => field.onChange(Number(value))} 
                        value={field.value?.toString() || "3"}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione o número de sessões" />
                        </SelectTrigger>
                        <SelectContent position="item-aligned">
                          <SelectItem value="3">3 sessões - R$ 60</SelectItem>
                          <SelectItem value="5">5 sessões - R$ 70</SelectItem>
                        </SelectContent>
                      </Select>
                      <div className="min-h-[20px]">
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>

            {precoTotal > 0 && (
              <div className="bg-muted p-6 rounded-lg mt-6">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Valor Total:</span>
                  <span className="text-2xl font-bold text-primary">R$ {precoTotal.toLocaleString("pt-BR")}</span>
                </div>
                {planoSelecionado === "Personalizado" && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {sessoes === 3 && "Plano com 3 sessões: R$ 60,00"}
                    {sessoes === 5 && "Plano com 5 sessões: R$ 70,00"}
                    {!sessoes && "Plano com 3 sessões: R$ 60,00"}
                  </p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {getButtonText()}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
