"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
// import { sendEmailOtp } from "@/actions/auth-actions" // Temporariamente desativado (OTP)
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSeparator,
//   InputOTPSlot,
// } from "@/components/ui/input-otp" // Temporariamente desativado (OTP)

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  // OTP desativado temporariamente
  // const [showOtp, setShowOtp] = useState(false)
  // const [otp, setOtp] = useState("")
  // const [serverOtp, setServerOtp] = useState<string | null>(null)
  // const [resending, setResending] = useState(false)
  // const [serverOtpToken, setServerOtpToken] = useState<string | null>(null)
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
      // Com redirect: true, NextAuth controla a navegação
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

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Entrar</h1>
          <p className="text-sm text-muted-foreground">Digite seu email para entrar.</p>
        </div>

        <div className="space-y-4 flex flex-col items-center">
          <Input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-center"
          />
          <Button
            className="w-full"
            onClick={handleEmailLogin}
            disabled={loading || !isValidEmail(email)}
          >
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </div>
      </div>
    </div>
  )
}