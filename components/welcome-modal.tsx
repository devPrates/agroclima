"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, UserPlus, LogIn, Radio } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { PiUserPlusBold } from "react-icons/pi";

export function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Verifica se o modal já foi fechado nesta sessão
    const hasSeenModal = sessionStorage.getItem("hasSeenWelcomeModal")
    
    if (!hasSeenModal) {
      // Pequeno delay para não ser invasivo imediatamente
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem("hasSeenWelcomeModal", "true")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
          {/* Backdrop com blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border bg-card text-card-foreground shadow-2xl"
          >
            {/* Header com gradiente sutil */}
            <div className="relative bg-muted/50 p-6 pb-4">
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-full p-1 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fechar</span>
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="relative h-12 w-12 flex-shrink-0">
                  <Image 
                    src="/agroclima.png" 
                    alt="Logo Agroclima" 
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-xl font-semibold tracking-tight">Bem-vindo ao Agroclima!</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Sua plataforma de monitoramento meteorológico evoluiu.
              </p>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="rounded-lg bg-primary/5 p-4 border border-primary/10">
                  <h3 className="font-medium flex items-center gap-2 mb-2 text-primary">
                    <UserPlus className="h-4 w-4" />
                    Seu acesso continua gratuito!
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-justify">
                    Fique tranquilo! Você <strong>ainda pode acessar as estações gratuitamente</strong> como sempre fez. 
                    Para garantir mais segurança e acesso ao novo painel, agora é necessário apenas criar uma conta rápida.
                  </p>
                </div>

                <div className="text-sm text-muted-foreground space-y-2 text-justify">
                  <p>
                    Para recursos avançados e acesso ilimitado a todas as estações da rede, conheça nossos planos Individual ou Personalizado.
                  </p>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button asChild className="w-full sm:w-auto flex-1">
                  <Link href="/planos" onClick={handleClose}>
                    <PiUserPlusBold className=" h-4 w-4" />
                    Criar Conta
                  </Link>
                </Button>
                
                <Button variant="outline" onClick={handleClose} className="w-full sm:w-auto flex-1">
                  <Radio className="mr-2 h-4 w-4" />
                  Conheça o Site
                </Button>
              </div>
            </div>
            
            {/* Barra inferior decorativa */}
            <div className="h-1 w-full bg-gradient-to-r from-primary/40 via-primary to-primary/40" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
