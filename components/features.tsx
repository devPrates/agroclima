"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { Wifi, Smartphone, BarChart3, Shield } from "lucide-react"

export function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const leftFeatures = [
    {
      icon: Wifi,
      title: "Conectividade IoT",
      description: "Transmissão de dados em tempo real via internet, permitindo monitoramento remoto 24 horas por dia.",
    },
    {
      icon: Smartphone,
      title: "App Mobile",
      description: "Aplicativo intuitivo para iOS e Android com notificações push e alertas personalizados.",
    },
  ]

  const rightFeatures = [
    {
      icon: BarChart3,
      title: "Análise Avançada",
      description: "Relatórios detalhados e gráficos interativos para análise histórica e previsões meteorológicas.",
    },
    {
      icon: Shield,
      title: "Dados Seguros",
      description: "Armazenamento em nuvem com criptografia de ponta e backup automático dos seus dados.",
    },
  ]

  return (
    <section id="features" ref={ref} className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Recursos Avançados</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-justify">
            Nossa estação meteorológica oferece tecnologia de ponta para monitoramento preciso e análise inteligente dos
            dados climáticos.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12 items-center">
          {/* Left Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {leftFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4 + index * 0.2 }}
                className="flex items-start space-x-4 lg:text-right lg:flex-row-reverse lg:space-x-reverse"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div className="lg:text-right">
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-justify lg:text-right">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Center Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative h-96 w-full">
              <Image
                src="/placeholder.svg?height=400&width=300"
                alt="Estação Meteorológica Central"
                fill
                className="object-contain"
              />
            </div>
          </motion.div>

          {/* Right Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="space-y-8"
          >
            {rightFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.8 + index * 0.2 }}
                className="flex items-start space-x-4"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-justify">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
