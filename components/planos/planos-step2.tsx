"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlanoData } from "@/actions/planos-actions"
import { toast } from "sonner"
// import { sendEmailOtp } from "@/actions/auth-actions" // Temporariamente desativado (OTP)
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "@/components/ui/input-otp" // Temporariamente desativado (OTP)

interface PlanosStep2Props {
  planoData: PlanoData
}

export function PlanosStep2({ planoData }: PlanosStep2Props) {
  const router = useRouter()

  const [email, setEmail] = useState(planoData.email || "")
  const [loading, setLoading] = useState(false)
  // OTP desativado temporariamente
  // const [showOtp, setShowOtp] = useState(false)
  // const [otp, setOtp] = useState("")
  // const [serverOtpToken, setServerOtpToken] = useState<string | null>(null)
  // const [resending, setResending] = useState(false)
  // const [validating, setValidating] = useState(false)

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleEmailLogin = async () => {
    if (!isValidEmail(email)) {
      toast.error("Email inválido. Verifique e tente novamente.")
      return
    }
    try {
      setLoading(true)
      const result = await signIn("credentials", {
        email,
        redirect: true,
        callbackUrl: "/dashboard",
      })
      if (!result) {
        toast.error("Falha ao autenticar. Verifique seu email.")
      }
    } catch (error: any) {
      toast.error(error?.message || "Erro ao autenticar.")
    } finally {
      setLoading(false)
    }
  }

  // const handleValidateCode = async () => { /* OTP desativado */ }

  // const handleResend = async () => { /* OTP desativado */ }

  // Passo 2: Verificação por email (OTP desativado)
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Verificação de Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center text-center">
        <div className="space-y-4 w-full">
          <p className="text-sm text-muted-foreground">Digite seu email para entrar.</p>
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-center w-full max-w-sm mx-auto"
          />
          <Button className="w-full max-w-sm mx-auto" onClick={handleEmailLogin} disabled={loading || !isValidEmail(email)}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
