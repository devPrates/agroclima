import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="relative text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-layer-footer bg-cover bg-center">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-12 md:pt-16 pb-6 md:pb-8">
        {/* Contact Info - Hidden on mobile, visible on md and up */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-8 text-center mb-16">
          {/* Address */}
          <div className="flex flex-col items-center">
            <div className="bg-brand-green p-4 rounded-full mb-4">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-medium mb-2">Our Address</h3>
            <p className="text-gray-200">
              4517 Washington Ave. Manchester,
              <br />
              Kentucky 39495
            </p>
          </div>

          {/* Phone */}
          <div className="flex flex-col items-center">
            <div className="bg-brand-green p-4 rounded-full mb-4">
              <Phone className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-medium mb-2">Call us Today</h3>
            <p className="text-gray-200">(239) 555-0108, (704) 555-0127</p>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center">
            <div className="bg-brand-green p-4 rounded-full mb-4">
              <Mail className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-medium mb-2">Send Email</h3>
            <p className="text-gray-200">Support@skillfarmer.com</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-4 md:space-x-8 mb-6 md:mb-8 text-sm md:text-base">
          <Link href="/about" className="hover:text-brand-green transition-colors">
            About
          </Link>
          <Link href="/lessons" className="hover:text-brand-green transition-colors">
            Lessons
          </Link>
          <Link href="/experts" className="hover:text-brand-green transition-colors">
            Experts
          </Link>
          <Link href="/faq" className="hover:text-brand-green transition-colors">
            FAQ
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider">UPSKILL FARMER</h2>
        </div>

        {/* Social Media */}
        <div className="flex justify-center space-x-3 md:space-x-4 mb-6 md:mb-8">
          <Link
            href="#"
            className="bg-white p-2 md:p-3 rounded-full text-brand-green hover:bg-brand-green hover:text-white transition-colors"
          >
            <Facebook className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
          <Link
            href="#"
            className="bg-white p-2 md:p-3 rounded-full text-brand-green hover:bg-brand-green hover:text-white transition-colors"
          >
            <Instagram className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
          <Link
            href="#"
            className="bg-white p-2 md:p-3 rounded-full text-brand-green hover:bg-brand-green hover:text-white transition-colors"
          >
            <Linkedin className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
          <Link
            href="#"
            className="bg-white p-2 md:p-3 rounded-full text-brand-green hover:bg-brand-green hover:text-white transition-colors"
          >
            <Twitter className="h-4 w-4 md:h-5 md:w-5" />
          </Link>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-200 text-xs md:text-sm">
          <p>{new Date().getFullYear()} UPSKILL FARMER. All Rights Reserved</p>
        </div>
      </div>
    </footer>
  )
}
