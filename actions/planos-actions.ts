"use server"

import axios from "axios"
import { generateToken } from "@/lib/jwt"
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export type PlanoData = {
  nome: string
  email: string
  senha: string
  confirmarSenha: string
  plano: "Gratuito" | "Individual" | "Personalizado"
  sessoes?: number
  precoTotal: number
}

// Função para enviar notificação de novo usuário
async function sendNewUserNotification(userData: { nome: string; email: string; plano: string }) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Agroclima.NET <onboarding@resend.dev>',
      to: [process.env.NOTIFICATION_EMAIL_1!, process.env.NOTIFICATION_EMAIL_2!],
      subject: `🎉 Novo usuário cadastrado - ${userData.nome}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
            Informações do Usuário:
          </h2>
          
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <p><strong>Nome:</strong> ${userData.nome}</p>
            <p><strong>E-mail:</strong> ${userData.email}</p>
            <p><strong>Plano:</strong> ${userData.plano}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px;">
            <p>Notificação automática do sistema Agroclima.NET</p>
            <p>Data: ${new Date().toLocaleString('pt-BR')}</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Erro ao enviar notificação de novo usuário:', error)
      return { success: false, error }
    }

    console.log('Notificação de novo usuário enviada com sucesso:', data)
    return { success: true, data }
  } catch (error) {
    console.error('Erro na função de notificação:', error)
    return { success: false, error }
  }
}

export async function criarConta(data: PlanoData) {
  try {
    // Para plano gratuito, fazer chamada para API externa
    if (data.plano === "Gratuito") {
      const result = await criarContaGratuita(data)
      
      // Se a conta foi criada com sucesso, enviar notificação
      if (result.success) {
        await sendNewUserNotification({
          nome: data.nome,
          email: data.email,
          plano: data.plano
        })
      }
      
      return result
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

    // Enviar notificação para planos pagos também
    await sendNewUserNotification({
      nome: data.nome,
      email: data.email,
      plano: data.plano
    })

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
