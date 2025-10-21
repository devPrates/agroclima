"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

interface PlanosStep2Props {
  planoData: PlanoData
}

export function PlanosStep2({ planoData }: PlanosStep2Props) {
  const router = useRouter()

  const [email] = useState(planoData.email || "")
  const [loading, setLoading] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState("")
  const [serverOtpToken, setServerOtpToken] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [validating, setValidating] = useState(false)

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      toast.error("Email inválido. Verifique e tente novamente.")
      return
    }
    try {
      setLoading(true)
      const res = await sendEmailOtp(email)
      if (res.success) {
        setShowOtp(true)
        setServerOtpToken(res.otpToken || null)
        toast.success("Código de login enviado para seu e-mail.")
      } else {
        const errMsg = res.error || "Falha ao enviar código."
        if (errMsg.toLowerCase().includes("crie uma conta") || errMsg.toLowerCase().includes("não encontrado")) {
          toast.info("Usuário não encontrado. Crie uma conta para continuar.")
        } else {
          toast.error(errMsg)
        }
      }
    } catch (e: any) {
      toast.error(e?.message || "Erro ao enviar código.")
    } finally {
      setLoading(false)
    }
  }

  const handleValidateCode = async () => {
    if (!serverOtpToken) {
      toast.error("Token do OTP ausente. Reenvie o código.")
      return
    }
    if (!otp || otp.length !== 6) {
      toast.error("Digite o código de 6 dígitos.")
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
      if (result?.error) {
        toast.error("Falha na autenticação. Verifique o código e tente novamente.")
        return
      }
      if (result?.ok) {
        toast.success("Login realizado com sucesso.")
        router.push("/dashboard")
        return
      }
    } catch (error: any) {
      toast.error(error?.message || "Erro ao validar código.")
    } finally {
      setValidating(false)
    }
  }

  const handleResend = async () => {
    if (!isValidEmail(email)) {
      toast.error("Email inválido.")
      return
    }
    try {
      setResending(true)
      const res = await sendEmailOtp(email)
      if (res.success) {
        setServerOtpToken(res.otpToken || null)
        toast.success("Novo código enviado para seu e-mail.")
      } else {
        const errMsg = res.error || "Falha ao reenviar código."
        if (errMsg.toLowerCase().includes("crie uma conta") || errMsg.toLowerCase().includes("não encontrado")) {
          toast.info("Usuário não encontrado. Crie uma conta para continuar.")
        } else {
          toast.error(errMsg)
        }
      }
    } catch (e: any) {
      toast.error(e?.message || "Erro ao reenviar código.")
    } finally {
      setResending(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle>Verificação de Email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 flex flex-col items-center text-center">
        {!showOtp ? (
          <div className="space-y-4 w-full">
            <p className="text-sm text-muted-foreground">Sua conta foi criada.</p>
            <div className="flex justify-center">
              <Badge variant="secondary" className="px-3 py-1 text-sm">{email}</Badge>
            </div>
            <Button className="w-full max-w-sm mx-auto" onClick={handleSendOtp} disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</span>
              ) : (
                "Acessar Conta e Planos"
              )}
            </Button>
          </div>
        ) : (
          <div className="w-full space-y-4">
            <div className="flex justify-center">
              <Badge variant="secondary" className="px-3 py-1 text-sm">{email}</Badge>
            </div>
            <div className="flex flex-col items-center gap-2">
              <InputOTP maxLength={6} value={otp} onChange={(v) => setOtp(v)}>
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
            <div className="flex gap-2 justify-center">
              <Button onClick={handleValidateCode} disabled={validating || otp.length !== 6}>
                {validating ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Validando...</span>
                ) : (
                  "Validar código"
                )}
              </Button>
              <Button variant="outline" onClick={handleResend} disabled={resending}>
                {resending ? "Reenviando..." : "Reenviar código"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
