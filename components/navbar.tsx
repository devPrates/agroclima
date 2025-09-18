"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import clsx from "clsx"

const menuItems = [
  { name: "Início", href: "#hero" },
  { name: "Sobre", href: "#about" },
  { name: "Recursos", href: "#features" },
  { name: "Preços", href: "#pricing" },
  { name: "Contato", href: "#contact" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Só configurar o observer na rota principal
    if (pathname !== '/') {
      setActiveSection(null)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(`#${entry.target.id}`)
          }
        })
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.6,
      }
    )

    menuItems.forEach((item) => {
      const section = document.querySelector(item.href)
      if (section) observer.observe(section)
    })

    return () => observer.disconnect()
  }, [pathname])

  const scrollToSection = (href: string) => {
    setIsOpen(false)
    
    // Se não estiver na rota principal, navegar para ela primeiro
    if (pathname !== '/') {
      router.push('/')
      // Aguardar a navegação e então fazer o scroll
      setTimeout(() => {
        const element = document.querySelector(href)
        if (element) {
          const yOffset = -64 // Altura da navbar
          const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
          window.scrollTo({ top: y, behavior: "smooth" })
        }
      }, 300) // tempo para a navegação completar
      return
    }
    
    // Se estiver na rota principal, fazer scroll para a seção
    const element = document.querySelector(href)
    if (element) {
      setTimeout(() => {
        const yOffset = -64 // Altura da navbar
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
        window.scrollTo({ top: y, behavior: "smooth" })
      }, 200) // tempo suficiente para o AnimatePresence esconder o menu
    }
  }

  if (!mounted) return null

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2">
            <Image src="/agroclima.png" alt="Agroclima.NET" width={120} height={40} className="h-8 w-auto" />
            <div className="font-bold text-xl">Agroclima.NET</div>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <motion.button
                key={item.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToSection(item.href)}
                className={clsx(
                  "transition-colors",
                  activeSection === item.href
                    ? "text-primary font-semibold"
                    : "text-foreground hover:text-primary"
                )}
              >
                {item.name}
              </motion.button>
            ))}

            <div className="flex items-center space-x-2 ml-8">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              
              <Button variant="default" size="sm">
                Entrar
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4 px-4">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.name}
                    whileHover={{ x: 10 }}
                    onClick={() => scrollToSection(item.href)}
                    className={clsx(
                      "block w-full text-left transition-colors",
                      activeSection === item.href
                        ? "text-primary font-semibold"
                        : "text-foreground hover:text-primary"
                    )}
                  >
                    {item.name}
                  </motion.button>
                ))}
                
                <div className="pt-4 border-t">
                  <Button variant="default" size="sm" className="w-full">
                    Entrar
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}
