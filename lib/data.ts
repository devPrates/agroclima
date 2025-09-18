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
            { icon: Cpu, text: "Suporte via e-mail" },
        ],
        buttonText: "Começar Agora",
        buttonVariant: "outline",
        popular: false,
    },
    {
        title: "Individual",
        description: "Tudo o que você precisa para uso pessoal e monitoramento completo.",
        price: "R$ 25",
        pricePeriod: "/mês",
        details: "ou R$ 300/ano",
        features: [
            { icon: Check, text: "Tudo do Gratuito, mais:" },
            { icon: Users, text: "Estação meteorológica completa" },
            { icon: Cloud, text: "Sensores de temperatura e umidade" },
            { icon: BarChart3, text: "Dashboard web completo" },
            { icon: Shield, text: "Suporte técnico 24/7" },
            { icon: Cpu, text: "Relatórios Anteriores" },
        ],
        buttonText: "Começar Agora",
        buttonVariant: "default",
        popular: true,
    },
    {
        title: "Personalizado",
        description: "Solução sob medida para grandes propriedades e equipes.",
        price: "Sob Consulta",
        pricePeriod: "",
        details: "Entre em contato para orçamento exclusivo",
        features: [
            { icon: Check, text: "Tudo do Individual, mais:" },
            { icon: UserPlus, text: "Mais contas de acesso" },
            { icon: Settings, text: "Gestão multiusuário avançada" },
            { icon: Globe, text: "Integração com sistemas existentes" },
            { icon: Headphones, text: "Suporte dedicado" },
        ],
        buttonText: "Personalizar Plano",
        buttonVariant: "outline",
        popular: false,
    },
]