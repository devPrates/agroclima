import Image from "next/image"
import { Sprout, Tractor } from "lucide-react"

export default function AboutSection() {
    return (
        <section className="w-full py-16" id="about">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {/* Left column with image and stats */}
                    <div className="relative mb-4">
                        <div className="relative overflow-hidden rounded-lg">
                            <Image
                                src="/image-about.png"
                                alt="Farmer tending to organic plants"
                                width={500}
                                height={400}
                                className="h-auto w-full object-cover"
                            />

                            {/* Stats box - positioned inside the image container */}
                            <div className="absolute bottom-0 right-0 w-32 rounded-lg bg-white p-3 text-center sm:w-36 sm:p-4">
                                <div className="bg-blue-300 p-2 rounded-lg">
                                    <div className="text-3xl font-bold text-stone-800 sm:text-4xl">
                                        <span className="text-blue-600">*</span>435<span className="text-xl">+</span>
                                    </div>
                                    <div className="mt-1 text-xs text-stone-700 sm:text-sm">Monitoramento Eficiente no Campo e na Cidade</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column with content */}
                    <div className="flex flex-col justify-center">
                        <div className="mb-2 text-sm font-medium text-stone-500">Sobre a AgroClima</div>

                        <h2 className="mb-6 text-3xl font-bold text-stone-700 md:text-4xl">
                            Estações Meteorológicas para o Campo e a Cidade
                        </h2>

                        <p className="mb-8 text-stone-600">
                            A AgroClima oferece soluções de monitoramento climático de alta precisão, tanto para o campo quanto para a cidade, permitindo uma gestão inteligente dos recursos naturais e auxiliando na tomada de decisões em tempo real.
                        </p>

                        {/* Features */}
                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                            {/* Feature 1 - Campo */}
                            <div>
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-blue-200 bg-blue-50">
                                    <Sprout className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-stone-700">Tecnologia no Campo</h3>
                                <p className="text-sm text-stone-500">
                                    Nossas estações meteorológicas ajudam produtores rurais a monitorar condições climáticas e tomar decisões informadas para otimizar a produtividade no campo.
                                </p>
                            </div>

                            {/* Feature 2 - Cidade */}
                            <div>
                                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-blue-200 bg-blue-50">
                                    <Tractor className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="mb-2 text-lg font-semibold text-stone-700">Soluções para a Cidade</h3>
                                <p className="text-sm text-stone-500">
                                    Nossas estações também oferecem monitoramento para ambientes urbanos, auxiliando na previsão de eventos climáticos e na adaptação das cidades às mudanças climáticas.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
