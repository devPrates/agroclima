import Image from "next/image"
import { Cloud, Thermometer, MapPin, RefreshCcw } from "lucide-react"

export default function FeatureSection() {
  return (
    <section className="w-full py-16 px-4 md:px-8 lg:px-16" id="services">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-sm text-gray-500 mb-2">Monitoramento Climático Inteligente</p>
          <h2 className="text-3xl md:text-4xl font-medium text-[#3c4a3e]">
            Soluções Perfeitas para o Campo e a Cidade
            <br />
            Com Estações Meteorológicas Avançadas
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Features */}
          <div className="md:col-span-3 space-y-8">
            <FeatureCircle
              icon={<Cloud className="h-6 w-6 text-[#3c4a3e]" />}
              title="Monitoramento Climático"
              description="Nossas estações fornecem dados precisos sobre condições climáticas, ajudando a prever mudanças e otimizar a produção agrícola."
            />

            <FeatureCircle
              icon={<Thermometer className="h-6 w-6 text-[#3c4a3e]" />}
              title="Temperatura e Umidade"
              description="Monitoramento constante da temperatura e umidade para garantir o melhor ambiente para o crescimento de culturas e decisões rápidas."
            />
          </div>

          {/* Center Image */}
          <div className="md:col-span-6 flex justify-center items-center">
            <Image
              src="/weather-station.png"
              alt="Estação Meteorológica"
              width={400}
              height={400}
              className="object-contain"
            />
          </div>

          {/* Right Features */}
          <div className="md:col-span-3 space-y-8">
            <FeatureCircle
              icon={<MapPin className="h-6 w-6 text-[#3c4a3e]" />}
              title="Cobertura Global"
              description="Estações instaladas em diversas regiões, permitindo monitoramento eficiente tanto para o campo quanto para áreas urbanas."
            />

            <FeatureCircle
              icon={<RefreshCcw className="h-6 w-6 text-[#3c4a3e]" />}
              title="Atualizações em Tempo Real"
              description="Acesso a dados em tempo real, permitindo respostas rápidas e ajustando estratégias conforme as condições climáticas."
            />
          </div>
        </div>
      </div>
    </section>
  )
}

interface FeatureCircleProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCircle({ icon, title, description }: FeatureCircleProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="flex-shrink-0 bg-blue-300 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-medium text-lg text-[#3c4a3e] mb-2">{title}</h3>
      <p className="text-sm text-gray-600 max-w-xs">{description}</p>
    </div>
  )
}
