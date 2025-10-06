"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { sendEmailOtp } from "@/actions/auth-actions"
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState("")
  const [serverOtp, setServerOtp] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [serverOtpToken, setServerOtpToken] = useState<string | null>(null)

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSendCode = async () => {
    if (!isValidEmail(email)) {
      toast.error("Email inválido. Verifique e tente novamente.")
      return
    }

    try {
      setLoading(true)
      const res = await sendEmailOtp(email)
      if (res?.success) {
        toast.success("Código enviado! Verifique seu email.")
        setShowOtp(true)
        setServerOtp(res.otp ?? null)
        setServerOtpToken(res.otpToken ?? null)
      } else {
        toast.error(res?.error || "Falha ao enviar o código.")
      }
    } catch (error: any) {
      toast.error(error?.message || "Erro inesperado ao enviar o código.")
    } finally {
      setLoading(false)
    }
  }

  const handleValidateCode = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Digite o código completo (6 dígitos)")
      return
    }
    if (!serverOtpToken) {
      toast.error("Token de validação indisponível. Reenvie o código.")
      return
    }

    const result = await signIn("credentials", {
      email,
      otp,
      otpToken: serverOtpToken,
      redirect: false,
      callbackUrl: "/dashboard",
    })

    // Quando redirect: false, NextAuth retorna um objeto com ok/error/url
    if (!result || (result as any)?.error || (result as any)?.ok === false) {
      console.log("invalido")
      toast.error("Código inválido")
      return
    }
    console.log("valido")
    const url = (result as any)?.url || "/dashboard"
    router.push(url)
  }

  const handleResend = async () => {
    if (!isValidEmail(email)) {
      toast.error("Email inválido. Verifique e tente novamente.")
      return
    }
    try {
      setResending(true)
      const res = await sendEmailOtp(email)
      if (res?.success) {
        toast.success("Novo código enviado!")
        setServerOtp(res.otp ?? null)
        setServerOtpToken(res.otpToken ?? null)
        setOtp("")
      } else {
        toast.error(res?.error || "Falha ao reenviar o código.")
      }
    } catch (error: any) {
      toast.error(error?.message || "Erro ao reenviar o código.")
    } finally {
      setResending(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Entrar</h1>
          {!showOtp ? (
            <p className="text-sm text-muted-foreground">Digite seu email para receber o código OTP.</p>
          ) : (
            <p className="text-sm text-muted-foreground">Insira o código enviado para {email}.</p>
          )}
        </div>

        {!showOtp ? (
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
              onClick={handleSendCode}
              disabled={loading || !isValidEmail(email)}
            >
              {loading ? "Enviando..." : "Receber código por email"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <div className="text-center text-sm text-muted-foreground">Código de 6 dígitos.</div>
            <div className="flex gap-3">
              <Button className="w-full" onClick={handleValidateCode} disabled={otp.length !== 6}>
                Validar código
              </Button>
              <Button className="w-full" variant="outline" onClick={handleResend} disabled={resending}>
                {resending ? "Reenviando..." : "Reenviar"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}