import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingCard() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-6">
      <div className="text-center mb-10 pt-8">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Escolha o melhor para você</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Tenha acesso vitalício a todos os nossos recursos e mantenha-se sempre atualizado com o nosso plano premium.
        </p>
      </div>

      <div className="flex justify-center w-full max-w-5xl pb-12">
        {/* Card de Preço */}
        <Card className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Plano Premium</CardTitle>
            <p className="text-5xl font-extrabold text-indigo-600 mt-4">R$ 1200</p>
            <p className="text-sm text-gray-500 mt-2">Pagamento único, sem mensalidades</p>
          </CardHeader>
          <CardContent className="space-y-4 mt-6">
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-green-500" />
              <span className="text-gray-700 text-base">Acesso vitalício a todos os cursos</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-green-500" />
              <span className="text-gray-700 text-base">Suporte técnico prioritário 24/7</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-green-500" />
              <span className="text-gray-700 text-base">Atualizações e novos conteúdos inclusos</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-green-500" />
              <span className="text-gray-700 text-base">Certificado reconhecido</span>
            </div>

            <Button className="w-full mt-8 text-lg py-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md transition">
              Adquirir agora
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
