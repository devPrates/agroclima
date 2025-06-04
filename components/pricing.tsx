"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Star } from "lucide-react"

export function Pricing() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const features = [
    "Estação meteorológica completa",
    "Sensores de temperatura e umidade",
    "Pluviômetro digital",
    "App mobile iOS e Android",
    "Dashboard web completo",
    "Relatórios personalizados",
    "Suporte técnico 24/7",
    "Instalação e treinamento inclusos",
  ]

  const scrollToContact = () => {
    const element = document.querySelector("#contact")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section id="pricing" ref={ref} className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Plano Anual</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-justify">
            Investimento completo em tecnologia meteorológica para sua propriedade rural. Tudo incluído em um único
            plano anual.
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-lg"
          >
            <Card className="relative border-2 border-primary shadow-2xl">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Mais Popular
                </div>
              </div>

              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl font-bold">Estação Completa</CardTitle>
                <CardDescription className="text-lg">Solução completa para monitoramento meteorológico</CardDescription>
                <div className="mt-4">
                  <div className="text-4xl font-bold text-primary">R$ 12.500</div>
                  <div className="text-muted-foreground">/ano</div>
                  <div className="text-sm text-muted-foreground mt-2">ou 12x de R$ 1.041,67</div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <Check className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-sm text-justify">{feature}</span>
                  </motion.div>
                ))}
              </CardContent>

              <CardFooter className="pt-6">
                <Button size="lg" className="w-full" onClick={scrollToContact}>
                  Solicitar Proposta
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-8"
        >
          <p className="text-muted-foreground text-justify max-w-2xl mx-auto">
            * Preço inclui equipamento, instalação, configuração, treinamento e suporte técnico. Condições especiais
            para múltiplas estações. Entre em contato para orçamento personalizado.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
