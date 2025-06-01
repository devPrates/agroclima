"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const footerLinks = [
  { name: "Início", href: "#hero" },
  { name: "Sobre", href: "#about" },
  { name: "Recursos", href: "#features" },
  { name: "Contato", href: "#contact" },
]

export function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="relative py-16 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800 to-gray-700 dark:from-gray-950 dark:via-gray-900 dark:to-gray-800" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] bg-cover bg-center opacity-10" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Image
              src="/logo-agroclima.png"
              alt="Agroclima.NET"
              width={150}
              height={50}
              className="h-12 w-auto brightness-0 invert"
            />
          </motion.div>

          {/* Navigation Menu */}
          <motion.nav
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-8"
          >
            {footerLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {link.name}
              </button>
            ))}
          </motion.nav>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="w-full max-w-md h-px bg-gray-600"
          />

          {/* Copyright and Credits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="space-y-2 text-gray-400"
          >
            <p>&copy; {new Date().getFullYear()} Agroclima.NET. Todos os direitos reservados.</p>
            <p className="text-sm">Desenvolvido por v0</p>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
