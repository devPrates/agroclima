import Image from "next/image"
import { Send } from "lucide-react"

export default function ContactSection() {
  return (
    <section className="w-full h-screen flex items-center justify-center py-4" id="contact">
      <div className=" rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-6xl h-[80vh]">
        {/* Image section - hidden on mobile, 1/3 width on desktop */}
        <div className="relative hidden md:block md:w-1/3 h-full">
          <Image
            src="/estacao-solar.jpeg"
            alt="Agricultor com morangos frescos"
            fill
            className="object-cover"
          />
        </div>

        {/* Form section - full width on mobile, 2/3 width on desktop */}
        <div className="p-6 md:p-10 md:w-2/3 bg-[#f9f9f4] h-full overflow-y-auto flex flex-col">
          <div className="mb-6 md:mb-8">
            <p className="text-[#6a9466] text-sm font-medium mb-2">👋 Get To Contact Us</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#4a5a4a] mb-1">Have a any Questions?</h2>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#4a5a4a]">Get in Touch!</h2>
          </div>

          <form className="space-y-4 flex-grow">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6a9466]"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6a9466]"
            />


            <textarea
              placeholder="Your message..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#6a9466]"
            ></textarea>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#6a9466] text-white px-6 py-3 rounded-md hover:bg-[#5a8356] transition-colors"
              >
                Send Message
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
