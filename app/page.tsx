"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { Contact } from "@/components/contact"

import BrandCarousel from "@/components/brand-carousel"
import ChatBot from "@/components/chat-bot"

export default function Home() {
  const searchParams = useSearchParams()
  
  useEffect(() => {
    // Verificar se há um hash na URL para fazer scroll automático
    const hash = window.location.hash
    if (hash) {
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          const yOffset = -64 // Altura da navbar
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: "smooth" })
        }
      }, 100) // Pequeno delay para garantir que os componentes foram renderizados
    }
  }, [searchParams])
  
  return (
    <main className="min-h-screen">
      <Hero />
      <BrandCarousel />
      <About />
      <Features />
      <Pricing />
      <Contact />
      <ChatBot />
    </main>
  )
}
