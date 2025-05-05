"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { fadeIn, textVariant, staggerContainer, buttonVariant } from "@/lib/motion"

export default function HeroSection() {
  const [isInView, setIsInView] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsInView(false)
        setTimeout(() => setIsInView(true), 10)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative w-full h-screen" id="home">
      {/* Background com overlay sempre ativo */}
      <div className="absolute inset-0 bg-hero-sm sm:bg-hero-md lg:bg-hero-lg bg-cover bg-center bg-no-repeat">
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Container principal centralizado */}
      <div className="relative z-10 max-w-7xl mx-auto h-full flex flex-col lg:flex-row">
        {/* Lado esquerdo - conteúdo sempre centralizado */}
        <motion.div
          variants={staggerContainer()}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="w-full lg:w-1/2 flex items-center justify-center h-full px-6 md:px-8 lg:px-12"
        >
          <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.h1 variants={textVariant(0.1)} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Soluções Climáticas para o Agronegócio
            </motion.h1>

            <motion.h2
              variants={textVariant(0.3)}
              className="text-xl md:text-2xl lg:text-3xl font-semibold text-white/90 mb-4"
            >
              Estações Meteorológicas de Alta Precisão
            </motion.h2>

            <motion.p variants={fadeIn("up", 0.5)} className="text-base md:text-lg text-white/80 max-w-md mb-8">
              A AgroClima oferece tecnologia de ponta para monitoramento climático em tempo real, ajudando produtores a
              tomarem decisões mais inteligentes e eficientes.
            </motion.p>

            <motion.div
              variants={staggerContainer(0.2)}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div variants={buttonVariant(0.7)}>
                <Button >
                  Solicite uma Demonstração
                </Button>
              </motion.div>

              <motion.div variants={buttonVariant(0.9)}>
                <Button variant={"outline"}>
                  Conheça Nossas Soluções
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Lado direito reservado para lg+ */}
        <div className="hidden lg:block w-1/2"></div>
      </div>
    </section>
  )
}
