"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { fadeIn, fadeInUp, staggerContainer, staggerItem } from "@/lib/animations"
import { Wind, Gauge, CloudRain, Droplets, Thermometer, Sun, Wifi, Activity, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

export default function AboutPage() {
  const features = [
    { icon: Wind, title: "Direção do Vento", description: "Medição precisa da direção do vento para análise de deslocamento e tomada de decisão no campo." },
    { icon: Wind, title: "Velocidade do Vento", description: "Acompanhe a intensidade do vento em tempo real para operações seguras e planejamento." },
    { icon: Gauge, title: "Pressão Atmosférica", description: "Leituras constantes de pressão para correlação com mudanças climáticas locais." },
    { icon: CloudRain, title: "Pluviômetro", description: "Registro de precipitação para histórico e monitoramento da chuva na sua propriedade." },
    { icon: Droplets, title: "Umidade Relativa", description: "Medições de umidade do ar para suporte à irrigação e manejo agrícola." },
    { icon: Thermometer, title: "Temperatura Ambiente", description: "Temperatura em tempo real para acompanhamento de variações térmicas e conforto das culturas." },
    { icon: Sun, title: "Energia Solar", description: "Sistema alimentado por energia solar para autonomia e baixo custo operacional." },
    { icon: Wifi, title: "Conexão Wi‑Fi", description: "Transmissão dos dados via Wi‑Fi para o painel web e aplicativo." },
    { icon: Activity, title: "Monitoramento em Tempo Real", description: "Visualização contínua das leituras no dashboard com histórico e relatórios." },
  ]

  const galleryImages = [
    "/estacao1.jpeg",
    "/estacao2.jpeg",
    "/estacao3.jpeg",
    "/estacao4.jpeg",
    "/estacao5.jpeg",
  ]

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {/* Cabeçalho de blog */}
        <div className="max-w-3xl mx-auto">
          <motion.header initial="hidden" animate="visible" variants={staggerContainer} className="space-y-4">
            <motion.h1 variants={fadeInUp} className="text-3xl md:text-4xl font-bold">
              Estações Meteorológicas AgroClima.NET: funcionalidades e benefícios
            </motion.h1>
            <motion.p variants={fadeIn} className="text-muted-foreground">
              Um guia completo das medições e tecnologias presentes nas nossas estações, com exemplos visuais.
            </motion.p>
            {/* Meta removida conforme solicitado */}
          </motion.header>

          {/* Hero image do post */}
          <motion.div initial="hidden" animate="visible" variants={fadeInUp} className="mt-8 rounded-lg overflow-hidden shadow-lg">
            <AspectRatio ratio={5 / 4}>
              <Image src="/nova-estacao.jpeg" alt="Estação Meteorológica Agroclima" fill className="object-cover object-top" />
            </AspectRatio>
          </motion.div>

          {/* Conteúdo introdutório */}
          <motion.article initial="hidden" animate="visible" variants={staggerContainer} className="prose prose-neutral dark:prose-invert max-w-none mt-8">
            <motion.p variants={staggerItem} className="text-muted-foreground">
              Nossas estações foram projetadas para oferecer medições confiáveis de clima no campo. A seguir, detalhamos cada
              funcionalidade com uma explicação prática e imagens ilustrativas que você poderá substituir pelos seus arquivos.
            </motion.p>
          </motion.article>

          {/* Galeria interativa de fotos da estação (movida para cima) */}
          <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={staggerContainer} className="mt-8">
            <motion.h2 variants={fadeInUp} className="text-2xl font-semibold mb-4">Galeria da Estação</motion.h2>
            <motion.p variants={fadeIn} className="text-muted-foreground mb-6">Imagens reais das instalações e componentes em campo.</motion.p>

            <Carousel opts={{ align: "start", loop: true }} className="w-full">
              <CarouselContent>
                {galleryImages.map((src, idx) => (
                  <CarouselItem key={src} className="md:basis-2/3 lg:basis-1/2">
                    {/* Proporção mais vertical para aumentar a altura visível */}
                    <AspectRatio ratio={3 / 4}>
                      <figure className="group h-full w-full overflow-hidden rounded-xl border bg-muted/20">
                        <Image
                          src={src}
                          alt={`Estação meteorológica ${idx + 1}`}
                          fill
                          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                          priority={idx === 0}
                        />
                      </figure>
                    </AspectRatio>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious aria-label="Foto anterior" className="left-2 sm:-left-12 top-1/2 -translate-y-1/2 z-10" />
              <CarouselNext aria-label="Próxima foto" className="right-2 sm:-right-12 top-1/2 -translate-y-1/2 z-10" />
            </Carousel>
          </motion.section>

          {/* Cards informativos por funcionalidade (sem imagens, com ícones) */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <motion.div key={f.title} variants={staggerItem}>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <f.icon className="h-5 w-5 text-primary" />
                      </span>
                      <CardTitle className="text-lg">{f.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          

          {/* Conclusão */}
          <motion.article initial="hidden" animate="visible" variants={staggerContainer} className="mt-12">
            <motion.p variants={fadeIn} className="text-muted-foreground">
              Com alimentação via energia solar e conectividade Wi‑Fi, os dados ficam disponíveis no dashboard em tempo real. Em breve,
              adicionaremos mais exemplos visuais e estudos de caso. Fique à vontade para enviar as imagens que deseja exibir aqui.
            </motion.p>
          </motion.article>
        </div>
      </div>
    </section>
  )
}