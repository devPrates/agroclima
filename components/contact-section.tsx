import Image from "next/image"
import { Send } from "lucide-react"

export default function ContactSection() {
  return (
    <section className="w-full h-screen flex items-center justify-center py-4" id="contact">
      <div className="rounded-xl shadow-lg overflow-hidden flex flex-col md:flex-row w-full max-w-6xl">
        {/* Image section - fixed size */}
        <div className="relative md:w-1/3 h-[550px]"> {/* Definindo altura fixa para imagem */}
          <Image
            src="/estacao-solar.jpeg"
            alt="Estação meteorológica AgroClima"
            layout="fill"
            className="object-cover"
          />
        </div>

        {/* Form section - fixed size */}
        <div className="p-6 md:p-10 md:w-2/3 bg-[#f9f9f4] h-[550px] flex flex-col justify-between"> {/* Definindo altura fixa para o formulário */}
          <div className="mb-6 md:mb-8">
            <p className="text-[#1e3a8a] text-sm font-medium mb-2">👋 Fale Conosco</p>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#2c3e50]">Entre em Contato Conosco!</h2>
          </div>

          <form className="space-y-4 flex-grow">
            <input
              type="text"
              placeholder="Seu Nome"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
            />

            <input
              type="email"
              placeholder="Endereço de E-mail"
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
            />

            <textarea
              placeholder="Sua mensagem..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-[#1e3a8a]"
            ></textarea>

            <div className="pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#1e3a8a] text-white px-6 py-3 rounded-md hover:bg-[#2c4f8c] transition-colors"
              >
                Enviar Mensagem
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
