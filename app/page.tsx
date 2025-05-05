import AboutSection from "@/components/about-section";
import BrandCarousel from "@/components/brand-carousel";
import ChatBot from "@/components/chat-bot";
import ContactSection from "@/components/contact-section";
import FeatureSection from "@/components/features-section";
import Footer from "@/components/footer-section";
import HeroSection from "@/components/hero-section";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-section";


export default function Home() {
  return (
    <main>
      <Navbar />
      <div className="mt-14"> {/* 64px de padding top */}
        <HeroSection />
      </div>
      <BrandCarousel />
      <AboutSection />
      <FeatureSection />
      <PricingCard />
      <ContactSection />
      <ChatBot />
      <Footer />
    </main>
  );
}
