"use server"

export type PlanoData = {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
  plano: "Gratuito" | "Individual" | "Personalizado"
  sessoes?: number
  precoTotal: number
}

export async function criarConta(data: PlanoData) {
  // Simular processamento com delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Log dos dados recebidos
  console.log("=== DADOS DO FORMULÁRIO ===")
  console.log("Nome:", data.nome)
  console.log("Email:", data.email)
  console.log("Plano:", data.plano)
  console.log("Preço Total:", `R$ ${data.precoTotal.toLocaleString("pt-BR")}`)

  if (data.plano === "Personalizado" && data.sessoes) {
    console.log("Sessões:", data.sessoes)
  }

  console.log("Senha:", "[OCULTA POR SEGURANÇA]")
  console.log("========================")

  // Simular possível erro (descomente para testar)
  // if (Math.random() > 0.8) {
  //   throw new Error('Erro simulado no servidor')
  // }

  return { success: true }
}
