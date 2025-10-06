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
      from: process.env.RESEND_FROM_EMAIL!,
      to: [process.env.NOTIFICATION_EMAIL_1!, process.env.NOTIFICATION_EMAIL_2!],
      subject: `Novo usuário cadastrado - ${userData.nome}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            Novo Usuário Cadastrado - Agroclima.NET
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e40af; margin-top: 0;">Informações do Usuário:</h3>
            <p><strong>Nome:</strong> ${userData.nome}</p>
            <p><strong>Email:</strong> ${userData.email}</p>
            <p><strong>Plano:</strong> ${userData.plano}</p>
          </div>
          
          <p style="color: #64748b; font-size: 14px; margin-top: 30px;">
            Este é um email automático de notificação do sistema Agroclima.NET
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Erro ao enviar notificação:', error);
      return;
    }

    console.log('Notificação de novo usuário enviada com sucesso:', data);
  } catch (error) {
    console.error('Erro ao enviar notificação de novo usuário:', error);
  }
}

async function sendWelcomeEmail(userData: { nome: string; email: string; plano: string }) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to: [userData.email],
      subject: `Bem-vindo ao Agroclima.NET, ${userData.nome}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">
              Bem-vindo ao Agroclima.NET!
            </h1>
            <p style="color: #e2e8f0; margin: 10px 0 0 0; font-size: 16px;">
              Sua conta foi criada com sucesso
            </p>
          </div>
          
          <div style="padding: 40px 20px;">
            <p style="font-size: 18px; color: #1e293b; margin-bottom: 20px;">
              Olá <strong>${userData.nome}</strong>,
            </p>
            
            <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
              É com grande satisfação que damos as boas-vindas ao <strong>Agroclima.NET</strong>! 
              Sua conta foi criada com sucesso e você já pode começar a aproveitar todos os recursos da nossa plataforma.
            </p>
            
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #1e40af; margin-top: 0; margin-bottom: 15px;">Detalhes da sua conta:</h3>
              <p style="margin: 8px 0; color: #475569;"><strong>Email:</strong> ${userData.email}</p>
              <p style="margin: 8px 0; color: #475569;"><strong>Plano:</strong> ${userData.plano}</p>
            </div>
            
            <p style="color: #475569; line-height: 1.6; margin-bottom: 30px;">
              Para começar a usar a plataforma, clique no botão abaixo e faça seu primeiro login:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://agroclima.net/" 
                 style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
                        color: #ffffff; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 8px; 
                        font-weight: bold; 
                        font-size: 16px; 
                        display: inline-block; 
                        box-shadow: 0 4px 6px rgba(37, 99, 235, 0.2);">
                Entrar
              </a>
            </div>
            
            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 30px;">
              <p style="color: #64748b; font-size: 14px; line-height: 1.5;">
                Se você tiver alguma dúvida ou precisar de ajuda, não hesite em entrar em contato conosco. 
                Estamos aqui para ajudá-lo a aproveitar ao máximo o Agroclima.NET.
              </p>
              
              <p style="color: #64748b; font-size: 14px; margin-top: 20px;">
                Atenciosamente,<br>
                <strong>Equipe Agroclima.NET</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Erro ao enviar email de boas-vindas:', error);
      return;
    }

    console.log('Email de boas-vindas enviado com sucesso:', data);
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error);
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

    // Enviar email de boas-vindas para o usuário
    await sendWelcomeEmail({
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
      // Enviar email de boas-vindas para o usuário
      await sendWelcomeEmail({
        nome: data.nome,
        email: data.email,
        plano: data.plano
      })

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
