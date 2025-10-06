"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/navbar"

export function NavbarVisibility() {
  const pathname = usePathname()
  // Oculta a Navbar em /dashboard e subrotas; exibe nas demais rotas
  if (pathname && pathname.startsWith("/dashboard")) {
    return null
  }
  return <Navbar />
}