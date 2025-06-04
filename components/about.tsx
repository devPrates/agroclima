"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import Image from "next/image"
import { Award, Users, MapPin, Calendar } from "lucide-react"

export function About() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section id="about" ref={ref} className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center max-w-6xl mx-auto">
          {/* Left Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-[34rem] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/estacao-solar.jpeg"
                alt="Estação Meteorológica Agroclima"
                fill
                className="object-contains"
              />
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold text-foreground"
            >
              Sobre a Agroclima.NET
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-muted-foreground text-justify"
            >
              Somos uma empresa especializada em soluções meteorológicas para o agronegócio, localizada em Naviraí/MS.
              Com mais de 05 anos de experiência no mercado, oferecemos estações meteorológicas de alta precisão que
              auxiliam produtores rurais na tomada de decisões estratégicas para suas culturas.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="text-lg text-muted-foreground text-justify"
            >
              Nossa missão é democratizar o acesso à informação meteorológica de qualidade, contribuindo para uma
              agricultura mais sustentável e produtiva. Utilizamos tecnologia de ponta para fornecer dados precisos e em
              tempo real.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 1 }}
              className="grid grid-cols-2 gap-6"
            >
              <div className="flex items-center space-x-3">
                <Award className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold">Certificação ISO</div>
                  <div className="text-sm text-muted-foreground">Qualidade garantida</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold">50+ Clientes</div>
                  <div className="text-sm text-muted-foreground">Satisfeitos</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold">Naviraí/MS</div>
                  <div className="text-sm text-muted-foreground">Sede própria</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-6 w-6 text-primary" />
                <div>
                  <div className="font-semibold">24/7 Suporte</div>
                  <div className="text-sm text-muted-foreground">Sempre disponível</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
