"use server"

import axios from "axios"
import { prisma } from "@/lib/prisma"
import { generateToken } from "@/lib/jwt"

type LookupResponse = {
  ok: boolean
  user?: {
    id: number
    nome: string
    login: string
    max_sessions: number
    pagante: string // "s" | "n"
  }
}

export async function upsertUserFromApi(email: string) {
  try {
    if (!email) return { success: false, error: "Email ausente" }

    const baseUrl = process.env.USER_LOOKUP_URL
    if (!baseUrl) return { success: false, error: "USER_LOOKUP_URL não configurado" }

    const token = generateToken({ sub: 1, name: "AgroClima API" }, "1h")
    const url = `${baseUrl}${encodeURIComponent(email)}`

    const res = await axios.get<LookupResponse>(url, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      timeout: 10000,
    })

    if (res.status !== 200 || !res.data?.ok || !res.data.user) {
      return { success: false, error: "Usuário não encontrado na API" }
    }

    const u = res.data.user

    await prisma.user.upsert({
      where: { id: u.id },
      update: {
        nome: u.nome,
        login: u.login,
        max_sessions: u.max_sessions,
        pagante: u.pagante,
      },
      create: {
        id: u.id,
        nome: u.nome,
        login: u.login,
        max_sessions: u.max_sessions,
        pagante: u.pagante,
      },
    })

    return { success: true }
  } catch (error: any) {
    console.error("Erro no upsert de usuário:", error?.message || error)
    if (error?.response) {
      console.error("Status:", error.response.status)
      console.error("Data:", error.response.data)
    }
    return { success: false, error: "Falha ao persistir usuário" }
  }
}