'use server'

import { Resend } from 'resend'
import { z } from 'zod'

const resend = new Resend(process.env.RESEND_API_KEY)

const contactSchema = z.object({
  name: z.string().min(2, {
    message: "Nome deve ter pelo menos 2 caracteres.",
  }),
  phone: z.string().min(10, {
    message: "Telefone deve ter pelo menos 10 dígitos.",
  }),
  email: z.string().email({
    message: "Por favor, insira um e-mail válido.",
  }),
  message: z.string().min(10, {
    message: "Mensagem deve ter pelo menos 10 caracteres.",
  }),
})

export type ContactFormData = z.infer<typeof contactSchema>

export async function sendContactEmail(formData: ContactFormData) {
  try {
    // Validar os dados
    const validatedData = contactSchema.parse(formData)
    const { name, email, phone, message } = validatedData

    // Enviar email usando Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!, // Email do domínio verificado no Resend
      to: [process.env.NOTIFICATION_EMAIL_1, process.env.NOTIFICATION_EMAIL_2].filter(Boolean) as string[],
      subject: `Nova mensagem de contato - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1e293b;">Informações do Contato:</h3>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>E-mail:</strong> ${email}</p>
            <p><strong>Telefone:</strong> ${phone}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #1e293b;">Mensagem:</h3>
            <p style="line-height: 1.6; color: #475569;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; text-align: center; color: #64748b; font-size: 14px;">
            <p>Esta mensagem foi enviada através do formulário de contato do site Agroclima.NET</p>
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('Erro ao enviar email:', error)
      return {
        success: false,
        error: 'Erro ao enviar mensagem. Tente novamente.'
      }
    }

    return {
      success: true,
      message: 'Mensagem enviada com sucesso!',
      data
    }
  } catch (error) {
    console.error('Erro na server action de contato:', error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Dados inválidos. Verifique os campos e tente novamente.'
      }
    }
    
    return {
      success: false,
      error: 'Erro interno do servidor'
    }
  }
}