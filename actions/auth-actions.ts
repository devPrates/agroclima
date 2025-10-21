"use server"

import axios from "axios"
import { Resend } from "resend"
import { generateToken } from "@/lib/jwt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Verifica se o e-mail existe na API externa e, se existir,
 * gera um código OTP e envia por e-mail.
 * Não realiza autenticação; apenas verificação e envio do código.
 */
export async function sendEmailOtp(email: string) {
  try {
    // Validação básica do e-mail
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { success: false, error: "Email inválido" }
    }

    const baseUrl = process.env.USER_LOOKUP_URL
    if (!baseUrl) {
      return { success: false, error: "USER_LOOKUP_URL não configurado nas variáveis de ambiente" }
    }

    // Gerar token JWT (equivalente ao scripts/token-generator.js) com a chave do .env
    const token = generateToken({ sub: 1, name: "AgroClima API" }, "1h")

    const lookupUrl = `${baseUrl}${encodeURIComponent(email)}`

    // Consultar API de verificação de usuário
    const response = await axios.get(lookupUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      timeout: 10000,
    })

    // Se não for 200 OK, tratar como não encontrado
    if (response.status !== 200 || !response.data?.ok || !response.data?.user) {
      return { success: false, error: "Usuário não encontrado. Crie uma conta para continuar." }
    }

    // Gerar um código OTP de 6 dígitos
    const otp = generateOtp()

    // Enviar e-mail com o código OTP
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "no-reply@agroclima.net",
      to: email,
      subject: "Seu código de login (OTP)",
      html: createOtpEmailHtml(otp),
    })

    if (error) {
      console.error("Erro ao enviar OTP por email:", error)
      return { success: false, error: "Falha ao enviar o código de login. Tente novamente." }
    }

    console.log("OTP enviado com sucesso:", data)

    // Assinar um token de validação do OTP com expiração curta
    const jwtSecret = process.env.JWT_SECRET
    if (!jwtSecret) {
      return { success: false, error: "JWT_SECRET não configurado nas variáveis de ambiente" }
    }

    // Criar hash do OTP para não expor o código ao cliente
    const otpHash = crypto.createHmac("sha256", jwtSecret).update(otp).digest("hex")

    const otpToken = jwt.sign(
      { email, otpHash },
      jwtSecret,
      { algorithm: "HS256", expiresIn: "5m" }
    )

    // Em produção, NÃO retorne o código ao cliente; somente o token
    return { success: true, message: "Código de login enviado por e-mail.", otpToken }
  } catch (error: any) {
    console.error("Erro na server action de OTP:", error?.message || error)
    const status = error?.response?.status
    const data = error?.response?.data
    if (status) {
      console.error("Status:", status)
      console.error("Data:", data)
      if (status === 404) {
        // Email não existe na API -> orientar criação de conta
        return { success: false, error: "Usuário não encontrado. Crie uma conta para continuar." }
      }
    }
    // Outros erros genéricos
    return { success: false, error: "Falha ao enviar o código de login. Tente novamente." }
  }
}

function generateOtp(): string {
  return String(Math.floor(100000 + Math.random() * 900000))
}

function createOtpEmailHtml(code: string): string {
  return `
    <div style="font-family: Arial, sans-serif; background: #f8fafc; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; box-shadow: 0 10px 20px rgba(2, 6, 23, 0.08);">
        <div style="padding: 24px; text-align: center;">
          <h1 style="font-size: 20px; margin: 0; color: #0f172a;">Código de Login</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Use o código abaixo para entrar no Agroclima.NET:</p>
          <div style="margin: 20px auto; display: inline-block; padding: 12px 24px; background: #0ea5e9; color: #ffffff; font-size: 24px; font-weight: bold; border-radius: 8px; letter-spacing: 4px;">
            ${code}
          </div>
          <p style="color: #64748b; font-size: 13px; margin-top: 12px;">O código expira em 5 minutos.</p>
          <div style="margin-top: 24px;">
            <a href="https://agroclima.net/" style="display: inline-block; padding: 12px 20px; background: #0ea5e9; color: #ffffff; text-decoration: none; border-radius: 8px;">Entrar</a>
          </div>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 16px;">Se você não solicitou este código, ignore este email.</p>
        </div>
      </div>
    </div>
  `
}