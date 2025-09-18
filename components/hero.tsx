"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { fadeIn, fadeInUp, staggerContainer, staggerItem } from "@/lib/animations"
import { WeatherTable } from "@/components/weather-table"

export function Hero() {
  const scrollToContact = () => {
    const element = document.querySelector("#contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20">
      {/* Background with image and opacity only */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-hero-mobile sm:bg-hero-tablet md:bg-hero-desktop bg-cover bg-center opacity-70" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 relative z-10">
        <div className="flex flex-col gap-12 lg:gap-16 items-center">
          <motion.div
            className="space-y-8 sm:space-y-10 text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div className="space-y-4 sm:space-y-6" variants={staggerItem}>
              <motion.div
                className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 mx-auto"
                variants={fadeIn}
              >
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Agroclima • Tecnologia Meteorológica Avançada
                </span>
              </motion.div>

              <motion.div className="space-y-3 sm:space-y-4" variants={staggerItem}>
                <motion.h1
                  className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
                  variants={fadeInUp}
                >
                  <motion.span className="block text-slate-900 dark:text-slate-100 mb-1 sm:mb-2" variants={fadeIn}>
                    Estações
                  </motion.span>
                  <motion.span
                    className="block bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 dark:from-blue-400 dark:via-cyan-400 dark:to-blue-600 bg-clip-text text-transparent"
                    variants={fadeIn}
                  >
                    Meteorológicas
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="text-lg sm:text-xl text-slate-700 dark:text-slate-300 text-center mx-auto leading-relaxed max-w-3xl"
                  variants={fadeInUp}
                >
                  Monitore o clima em tempo real com precisão profissional. Dados meteorológicos confiáveis para
                  agricultura, pesquisa e tomada de decisões estratégicas.
                </motion.p>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              variants={staggerItem}
            >
              <motion.div variants={fadeIn}>
                <Button
                  size="lg"
                  onClick={() => scrollToContact()}
                >
                  Explorar Produtos
                </Button>
              </motion.div>
              <motion.div variants={fadeIn}>
                <Button
                  variant="outline"
                  size="lg"
                >
                  Solicitar Demo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div className="relative flex justify-center" initial="hidden" animate="visible" variants={fadeIn}>
            <motion.div className="relative w-full" variants={fadeInUp}>
              {/* Componente WeatherTable integrado */}
              <WeatherTable 
                autoFetch={true}
                showRefreshButton={true}
                className="w-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
