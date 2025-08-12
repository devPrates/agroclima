import { Plan } from "./types";
import { Check, Users, BarChart3, Shield, Globe, Cloud, Cpu, UserPlus, Settings, Headphones } from "lucide-react"


export const plans: Plan[] = [
    {
        title: "Gratuito",
        description: "O ponto de partida perfeito para testar e conhecer o sistema.",
        price: "R$ 0",
        pricePeriod: "/mês",
        details: "Grátis para sempre",
        features: [
            { icon: Globe, text: "Acesso ao painel básico" },
            { icon: Cloud, text: "Monitoramento limitado" },
            { icon: Shield, text: "Segurança básica" },
            { icon: BarChart3, text: "Relatórios simples" },
            { icon: Cpu, text: "Suporte via e-mail" },
        ],
        buttonText: "Começar Agora",
        buttonVariant: "outline",
        popular: false,
    },
    {
        title: "Individual",
        description: "Tudo o que você precisa para uso pessoal e monitoramento completo.",
        price: "R$ 1.500",
        pricePeriod: "/ano",
        details: "ou 12x de R$ 1.041,67",
        features: [
            { icon: Check, text: "Tudo do Gratuito, mais:" },
            { icon: Users, text: "Estação meteorológica completa" },
            { icon: Cloud, text: "Sensores de temperatura e umidade" },
            { icon: BarChart3, text: "Dashboard web completo" },
            { icon: Shield, text: "Suporte técnico 24/7" },
            { icon: Cpu, text: "Instalação e treinamento inclusos" },
        ],
        buttonText: "Começar Agora",
        buttonVariant: "default",
        popular: true,
    },
    {
        title: "Personalizado",
        description: "Solução sob medida para grandes propriedades e equipes.",
        price: "Sob consulta",
        pricePeriod: "",
        details: "Entre em contato para orçamento exclusivo",
        features: [
            { icon: Check, text: "Tudo do Individual, mais:" },
            { icon: UserPlus, text: "Mais contas de acesso" },
            { icon: Settings, text: "Gestão multiusuário avançada" },
            { icon: Globe, text: "Integração com sistemas existentes" },
            { icon: Headphones, text: "Suporte dedicado" },
        ],
        buttonText: "Solicitar Orçamento",
        buttonVariant: "outline",
        popular: false,
    },
]