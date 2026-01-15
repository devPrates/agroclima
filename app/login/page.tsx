"use client"

import { useState } from "react"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { sendEmailOtp } from "@/actions/auth-actions" // Reativado (OTP)
import { toast } from "sonner"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2, Radio } from "lucide-react"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp" // Reativado (OTP)
import { Badge } from "@/components/ui/badge"
import { IoIosArrowBack } from "react-icons/io";

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState("")
  const [resending, setResending] = useState(false)
  const [serverOtpToken, setServerOtpToken] = useState<string | null>(null)
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
      // Tratamento do resultado quando redirect=false
      if (result?.error) {
        toast.error("Falha na autenticação. Verifique o código e tente novamente.")
        return
      }
      if (result?.ok) {
        toast.success("Login realizado com sucesso.")
        router.push("/dashboard")
        return
      }
      // Em alguns casos, a lib pode retornar undefined; não considerar erro aqui
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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6">
        <div className="flex justify-center">
          <Image
            src="/agroclima.png"
            alt="Agroclima.NET"
            width={130}
            height={40}
            priority
          />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-xl sm:text-2xl font-bold">Acessar painel de gerenciamento</h1>
          <p className="text-sm text-muted-foreground px-2 sm:px-0">
            Use o email da sua conta para entrar no painel de gerenciamento.
          </p>
        </div>

        <div className="space-y-4 flex flex-col items-center">
          {!showOtp ? (
            <>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-center"
              />
              <Button
                className="w-full"
                onClick={handleSendOtp}
                disabled={loading || !isValidEmail(email)}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Enviando...</span>
                ) : (
                  "Enviar código"
                )}
              </Button>
            </>
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
                <Button
                  onClick={handleValidateCode}
                  disabled={validating || otp.length !== 6}
                >
                  {validating ? (
                    <span className="inline-flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin" /> Validando...</span>
                  ) : (
                    "Validar código"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResend}
                  disabled={resending}
                >
                  {resending ? "Reenviando..." : "Reenviar código"}
                </Button>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row w-full gap-3 mt-4">
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-1/2 h-auto py-3 sm:py-2"
            >
              <a href="/" className="flex items-center gap-2 justify-center">
                <IoIosArrowBack className="h-4 w-4 shrink-0" />
                <span>Voltar ao início</span>
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="w-full sm:w-1/2 h-auto py-3 sm:py-2"
            >
              <a
                href="https://agroclima.net/hml/sbadmin2/login.html"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 justify-center"
              >
                <Radio className="h-4 w-4 shrink-0" />
                <span>Acessar estações</span>
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
