"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Cloud, Thermometer, Droplets } from "lucide-react"

export function Hero() {
  const scrollToContact = () => {
    const element = document.querySelector("#contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16 md:pt-24 md:pb-20"
    >
      {/* Background with different sizes */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-green-100 dark:from-gray-900 dark:via-blue-900 dark:to-gray-800" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=800&width=1200')] bg-cover bg-center opacity-10 sm:bg-[url('/placeholder.svg?height=600&width=800')] md:bg-[url('/placeholder.svg?height=1000&width=1600')]" />
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-foreground leading-tight text-justify"
            >
              Monitoramento Meteorológico <span className="text-primary">Inteligente</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-muted-foreground text-justify"
            >
              Estações meteorológicas de alta precisão para agricultura moderna. Monitore temperatura, umidade,
              precipitação e muito mais em tempo real para otimizar sua produção agrícola.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button size="lg" onClick={scrollToContact} className="group">
                Solicitar Orçamento
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" size="lg">
                Ver Demonstração
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4 sm:gap-6">
              <motion.div whileHover={{ scale: 1.05 }} className="bg-card p-4 sm:p-6 rounded-lg shadow-lg border">
                <Thermometer className="h-8 w-8 text-red-500 mb-4" />
                <h3 className="font-semibold mb-2">Temperatura</h3>
                <p className="text-sm text-muted-foreground text-justify">
                  Monitoramento preciso da temperatura ambiente
                </p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-card p-4 sm:p-6 rounded-lg shadow-lg border">
                <Droplets className="h-8 w-8 text-blue-500 mb-4" />
                <h3 className="font-semibold mb-2">Umidade</h3>
                <p className="text-sm text-muted-foreground text-justify">Controle da umidade relativa do ar</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-card p-4 sm:p-6 rounded-lg shadow-lg border">
                <Cloud className="h-8 w-8 text-gray-500 mb-4" />
                <h3 className="font-semibold mb-2">Precipitação</h3>
                <p className="text-sm text-muted-foreground text-justify">Medição de chuva e precipitação</p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} className="bg-card p-4 sm:p-6 rounded-lg shadow-lg border">
                <ArrowRight className="h-8 w-8 text-green-500 mb-4" />
                <h3 className="font-semibold mb-2">Vento</h3>
                <p className="text-sm text-muted-foreground text-justify">Direção e velocidade do vento</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
