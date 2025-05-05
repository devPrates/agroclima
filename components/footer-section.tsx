import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative text-white">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-layer-footer bg-cover bg-center">
          <div className="absolute inset-0 bg-black/40" />
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 container mx-auto px-4 pt-12 md:pt-16 pb-6 md:pb-8 text-center">
        {/* Navegação */}
        <div className="flex flex-wrap justify-center space-x-4 md:space-x-8 mb-6 md:mb-8 text-sm md:text-base">
          <Link href="/about" className="hover:text-[#2563eb] transition-colors">Sobre Nós</Link>
          <Link href="/stations" className="hover:text-[#2563eb] transition-colors">Estações</Link>
          <Link href="/support" className="hover:text-[#2563eb] transition-colors">Suporte</Link>
          <Link href="/contact" className="hover:text-[#2563eb] transition-colors">Fale Conosco</Link>
        </div>

        {/* Logo */}
        <div className="mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider">AgroClima</h2>
        </div>

        {/* Redes sociais com ícones SVG personalizados */}
        <div className="flex justify-center space-x-4 mb-6 md:mb-8">
          <Link href="#">
            <div className="bg-[#2563eb] p-3 rounded-full hover:bg-[#3e58cc] transition-colors">
              <Image src="/icones/facebook.svg" alt="Facebook" width={20} height={20} />
            </div>
          </Link>
          <Link href="#">
            <div className="bg-[#2563eb] p-3 rounded-full hover:bg-[#3e58cc] transition-colors">
              <Image src="/icones/phone.svg" alt="Instagram" width={20} height={20} />
            </div>
          </Link>
          <Link href="#">
            <div className="bg-[#2563eb] p-3 rounded-full hover:bg-[#3e58cc] transition-colors">
              <Image src="/icones/linkedin.svg" alt="LinkedIn" width={20} height={20} />
            </div>
          </Link>
          <Link href="#">
            <div className="bg-[#2563eb] p-3 rounded-full hover:bg-[#3e58cc] transition-colors">
              <Image src="/icones/gmail.svg" alt="Twitter" width={20} height={20} />
            </div>
          </Link>
        </div>

        {/* Direitos autorais */}
        <div className="text-gray-200 text-xs md:text-sm">
          <p>{new Date().getFullYear()} AgroClima. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
