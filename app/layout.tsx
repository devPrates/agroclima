import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "sonner"
import { NavbarVisibility } from "@/components/navbar-visibility"
import { FooterVisibility } from "@/components/footer-visibility"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Agroclima.NET",
  description:
    "Soluções meteorológicas de alta precisão para agricultura moderna. Monitore temperatura, umidade, precipitação e vento em tempo real.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <NavbarVisibility />
          {children}
          <Toaster />
          <FooterVisibility />
        </ThemeProvider>
      </body>
    </html>
  )
}
