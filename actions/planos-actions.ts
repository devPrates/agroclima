"use server"

import axios from "axios"
import { generateToken } from "@/lib/jwt"

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
  try {
    // Para plano gratuito, fazer chamada para API externa
    if (data.plano === "Gratuito") {
      return await criarContaGratuita(data)
    }

    // Para outros planos, manter comportamento atual (simulação)
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

    return { success: true }
  } catch (error) {
    console.error("Erro ao criar conta:", error)
    throw error
  }
}

async function criarContaGratuita(data: PlanoData) {
  try {
    // Gerar token JWT
    const token = generateToken({
      sub: 1,
      name: "AgroClima API",
    })

    // Preparar dados para a API
    const apiData = {
      nome: data.nome,
      login: data.email,
      passwd: data.senha,
      max_sessions: 1,
      pagante: "n"
    }

    console.log("=== ENVIANDO PARA API EXTERNA ===")
    console.log("URL:", "https://agroclima.net/new_user.php")
    console.log("Dados:", { ...apiData, passwd: "[OCULTA]" })

    // Fazer requisição para API externa
    const response = await axios.post(
      "https://agroclima.net/new_user.php",
      apiData,
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        timeout: 10000 // 10 segundos de timeout
      }
    )

    console.log("=== RESPOSTA DA API ===")
    console.log("Status:", response.status)
    console.log("Data:", response.data)
    console.log("======================")

    // Verificar se a resposta foi bem-sucedida
    if (response.status === 200 || response.status === 201) {
      return { 
        success: true, 
        message: "Conta criada com sucesso!",
        data: response.data 
      }
    } else {
      throw new Error(`Erro na API: ${response.status} - ${response.statusText}`)
    }

  } catch (error: any) {
    console.error("=== ERRO NA API EXTERNA ===")
    console.error("Erro:", error.message)
    
    if (error.response) {
      console.error("Status:", error.response.status)
      console.error("Data:", error.response.data)
    }
    console.error("============================")

    // Lançar erro com mensagem mais amigável
    if (error.response?.status === 400) {
      throw new Error("Dados inválidos. Verifique as informações e tente novamente.")
    } else if (error.response?.status === 409) {
      throw new Error("Este email já está cadastrado. Tente fazer login ou use outro email.")
    } else if (error.code === 'ECONNABORTED') {
      throw new Error("Tempo limite excedido. Verifique sua conexão e tente novamente.")
    } else {
      throw new Error("Erro ao criar conta. Tente novamente em alguns instantes.")
    }
  }
}
