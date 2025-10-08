"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlanoData } from "@/actions/planos-actions"
import { toast } from "sonner"
import { sendEmailOtp } from "@/actions/auth-actions"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

interface PlanosStep2Props {
  planoData: PlanoData
}

export function PlanosStep2({ planoData }: PlanosStep2Props) {
  const router = useRouter()

  const [email, setEmail] = useState(planoData.email || "")
  const [loading, setLoading] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState("")
  const [serverOtpToken, setServerOtpToken] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [validating, setValidating] = useState(false)

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
    try {
      setValidating(true)
      const result = await signIn("credentials", {
        email,
        otp,
        otpToken: serverOtpToken,
        redirect: false,
        callbackUrl: "/dashboard",
      })

      if (!result || (result as any)?.error || (result as any)?.ok === false) {
        toast.error("Código inválido")
        return
      }
      const url = (result as any)?.url || "/dashboard"
      router.push(url)
    } finally {
      setValidating(false)
    }
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
        setOtp("")
        setServerOtpToken(res.otpToken ?? null)
      } else {
        toast.error(res?.error || "Falha ao reenviar o código.")
      }
    } catch (error: any) {
      toast.error(error?.message || "Erro ao reenviar o código.")
    } finally {
      setResending(false)
    }
  }

  // Passo 2: Verificação por email + OTP
  
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Verificação de Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center text-center">
        {!showOtp ? (
          <div className="space-y-4 w-full">
            <p className="text-sm text-muted-foreground">Digite seu email para receber o código OTP.</p>
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="text-center w-full max-w-sm mx-auto"
            />
            <Button className="w-full max-w-sm mx-auto" onClick={handleSendCode} disabled={loading || !isValidEmail(email)}>
              {loading ? "Enviando..." : "Receber código por email"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4 w-full">
            <p className="text-sm text-muted-foreground">Insira o código enviado para {email}.</p>
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
            <div className="flex w-full max-w-sm mx-auto justify-between">
              <Button className="w-[48%]" variant="outline" onClick={handleResend} disabled={resending}>
                {resending ? "Reenviando..." : "Reenviar"}
              </Button>
              <Button className="w-[48%]" onClick={handleValidateCode} disabled={validating || otp.length !== 6}>
                {validating ? "Validando..." : "Validar código"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
