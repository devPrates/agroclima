"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Thermometer, CloudRain, Wind, BarChart3, ChevronRight, Wifi } from "lucide-react"
import { fadeIn, fadeInUp, staggerContainer, staggerItem } from "@/lib/animations"

export function Hero() {
  const scrollToContact = () => {
    const element = document.querySelector("#contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const weatherData = [
    {
      icon: Thermometer,
      label: "Temperatura",
      value: "24.5°C",
      color: "from-red-400 to-orange-400",
      bg: "from-red-50/80 to-orange-50/80 dark:from-red-950/30 dark:to-orange-950/30",
    },
    {
      icon: CloudRain,
      label: "Umidade",
      value: "68%",
      color: "from-blue-400 to-cyan-400",
      bg: "from-blue-50/80 to-cyan-50/80 dark:from-blue-950/30 dark:to-cyan-950/30",
    },
    {
      icon: Wind,
      label: "Vento",
      value: "12 km/h",
      color: "from-green-400 to-emerald-400",
      bg: "from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30",
    },
    {
      icon: BarChart3,
      label: "Pressão",
      value: "1013 hPa",
      color: "from-purple-400 to-violet-400",
      bg: "from-purple-50/80 to-violet-50/80 dark:from-purple-950/30 dark:to-violet-950/30",
    },
  ]

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
                  <motion.span
                    className="block text-slate-700 dark:text-slate-300 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl"
                    variants={fadeIn}
                  >
                    Inteligentes
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed"
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
              {/* Glass Effect Background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10 dark:from-white/10 dark:via-white/5 dark:to-transparent backdrop-blur-xl rounded-2xl sm:rounded-3xl border border-white/30 dark:border-white/10 shadow-2xl"
                variants={fadeIn}
              />

              {/* Secondary Glass Layer */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-cyan-500/10 dark:from-blue-400/5 dark:to-cyan-400/5 rounded-2xl sm:rounded-3xl"
                variants={fadeIn}
              />

              {/* Main Card Content */}
              <motion.div
                className="relative backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 mx-auto max-w-md lg:max-w-none"
                variants={fadeIn}
              >
                {/* Header */}
                <motion.div className="flex items-center justify-between mb-4 sm:mb-6" variants={staggerItem}>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100">
                      Estação Meteorológica
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Naviraí/MS - Online</p>
                  </div>
                  <motion.div className="relative" variants={fadeIn}>
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-emerald-500 to-green-500 dark:from-emerald-400 dark:to-green-400 rounded-full flex items-center justify-center shadow-lg backdrop-blur-sm">
                      <Wifi className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 sm:w-4 h-3 sm:h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 animate-pulse shadow-lg"></div>
                  </motion.div>
                </motion.div>

                {/* Weather Data Grid */}
                <motion.div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6" variants={staggerContainer}>
                  {weatherData.map((item, index) => (
                    <motion.div
                      key={index}
                      className={`relative p-3 sm:p-4 rounded-lg sm:rounded-xl backdrop-blur-sm border border-white/40 dark:border-white/10 shadow-lg overflow-hidden`}
                      variants={staggerItem}
                    >
                      {/* Glass Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.bg} backdrop-blur-sm`} />

                      {/* Content */}
                      <div className="relative z-10">
                        <div
                          className={`w-6 sm:w-8 h-6 sm:h-8 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center mb-2 sm:mb-3 shadow-lg backdrop-blur-sm`}
                        >
                          <item.icon className="h-3 sm:h-4 w-3 sm:w-4 text-white" />
                        </div>
                        <div className="text-xs text-slate-600 dark:text-slate-300 font-medium mb-1">{item.label}</div>
                        <div className="text-sm sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                          {item.value}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Status */}
                <motion.div
                  className="relative text-center p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-200/60 dark:border-green-800/40 backdrop-blur-sm shadow-lg overflow-hidden"
                  variants={staggerItem}
                >
                  {/* Glass Background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/30 dark:to-emerald-950/30 backdrop-blur-sm" />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse shadow-lg"></div>
                      <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">
                        Sistema Online
                      </span>
                    </div>
                    <div className="text-xs text-green-600 dark:text-green-400">Última atualização: agora mesmo</div>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
