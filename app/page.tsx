import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Features } from "@/components/features"
import { Pricing } from "@/components/pricing"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import BrandCarousel from "@/components/brand-carousel"
import ChatBot from "@/components/chat-bot"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <BrandCarousel />
      <About />
      <Features />
      <Pricing />
      <Contact />
      <ChatBot />
      <Footer />
    </main>
  )
}
