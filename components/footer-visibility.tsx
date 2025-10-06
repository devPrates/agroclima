"use client"

import { usePathname } from "next/navigation"
import { Footer } from "@/components/footer"

export function FooterVisibility() {
  const pathname = usePathname()

  const hideOnDashboard = pathname?.startsWith("/dashboard")

  if (hideOnDashboard) return null

  return <Footer />
}