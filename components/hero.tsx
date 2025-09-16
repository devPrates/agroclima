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
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            className="space-y-6 sm:space-y-8 text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div className="space-y-4 sm:space-y-6" variants={staggerItem}>
              <motion.div
                className="inline-flex items-center px-3 sm:px-4 py-2 rounded-full bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-blue-200/50 dark:border-blue-800/50 shadow-lg mx-auto lg:mx-0"
                variants={fadeIn}
              >
                <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full mr-2 sm:mr-3 animate-pulse"></div>
                <span className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300">
                  Tecnologia Meteorológica Avançada
                </span>
                <div className="ml-2 sm:ml-3 text-blue-500 dark:text-blue-400">🌦️</div>
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
                  className="text-lg sm:text-xl text-black text-justify dark:text-white max-w-lg mx-auto lg:mx-0 leading-relaxed"
                  variants={fadeInUp}
                >
                  Monitore o clima em tempo real com precisão profissional. Dados meteorológicos confiáveis para
                  agricultura, pesquisa e tomada de decisões estratégicas.
                </motion.p>
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              variants={staggerItem}
            >
              <motion.div variants={fadeIn} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-600 dark:hover:to-cyan-600 text-white shadow-xl shadow-blue-500/25 border-0 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium"
                  onClick={() => scrollToContact()}
                >
                  Explorar Produtos
                  <ChevronRight className="ml-2 h-4 sm:h-5 w-4 sm:w-5" />
                </Button>
              </motion.div>
              <motion.div variants={fadeIn} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-2 border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-gray-800/80 hover:border-blue-300 dark:hover:border-blue-700 shadow-lg px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-medium"
                >
                  Solicitar Demo
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div className="relative mt-8 lg:mt-0 flex justify-end" initial="hidden" animate="visible" variants={fadeIn}>
            <motion.div className="relative w-full" variants={fadeInUp}>
              {/* Componente WeatherTable integrado */}
              <WeatherTable 
                autoFetch={true}
                showRefreshButton={true}
                className="max-w-md lg:max-w-none mx-auto"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
