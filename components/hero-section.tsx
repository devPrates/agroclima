"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { fadeIn, textVariant, staggerContainer, buttonVariant } from "@/lib/motion"

export default function HeroSection() {
  const [isInView, setIsInView] = useState(true)

  // Reset animation when scrolling back to top
  useEffect(() => {
    const handleScroll = () => {
      // If user scrolls back to top, reset animation
      if (window.scrollY === 0) {
        setIsInView(false)
        // Small timeout to trigger animation again
        setTimeout(() => setIsInView(true), 10)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative w-full h-screen flex flex-col lg:flex-row" id="home">
      {/* Background with overlay for smaller screens */}
      <div className="absolute inset-0 bg-hero-sm sm:bg-hero-md lg:bg-hero-lg bg-cover bg-center bg-no-repeat">
        {/* Dark overlay for screens smaller than lg */}
        <div className="absolute inset-0 bg-black/40 lg:bg-transparent"></div>
      </div>

      {/* Content container - first half */}
      <motion.div
        variants={staggerContainer()}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative z-10 w-full lg:w-1/2 flex flex-col justify-center items-start p-8 md:p-12 lg:p-16"
      >
        <motion.h1 variants={textVariant(0.1)} className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Título Principal
        </motion.h1>

        <motion.h2
          variants={textVariant(0.3)}
          className="text-xl md:text-2xl lg:text-3xl font-semibold text-white/90 mb-4"
        >
          Subtítulo Atrativo
        </motion.h2>

        <motion.p variants={fadeIn("up", 0.5)} className="text-base md:text-lg text-white/80 max-w-md mb-8">
          Uma breve descrição que explica o propósito desta seção e convida o usuário a explorar mais sobre o que
          estamos oferecendo. Este texto deve ser conciso e impactante.
        </motion.p>

        <motion.div
          variants={staggerContainer(0.2)}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col sm:flex-row gap-4"
        >
          <motion.div variants={buttonVariant(0.7)}>
            <Button size="lg" className="bg-white text-black hover:bg-white/90">
              Comece Agora
            </Button>
          </motion.div>

          <motion.div variants={buttonVariant(0.9)}>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
              Saiba Mais
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Second half - empty and hidden on screens smaller than lg */}
      <div className="hidden lg:block lg:w-1/2"></div>
    </section>
  )
}
