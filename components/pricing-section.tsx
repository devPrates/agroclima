import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function PricingCard() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center py-12 px-6" id="pricing">
      <div className="text-center mb-10 pt-8">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-4">Acesse a Plataforma AgroClima</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Com a assinatura do nosso plano Premium, você terá acesso a todas as estações meteorológicas em tempo real e poderá monitorar o clima de diversas regiões, tanto no campo quanto na cidade.
        </p>
      </div>

      <div className="flex justify-center w-full max-w-5xl pb-12">
        {/* Card de Preço */}
        <Card className="w-full max-w-md p-8 rounded-2xl shadow-2xl bg-white border border-gray-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">Plano Premium</CardTitle>
            <p className="text-5xl font-extrabold text-blue-600 mt-4">R$ 1200</p>
            <p className="text-sm text-gray-500 mt-2">Pagamento único, sem mensalidades</p>
          </CardHeader>
          <CardContent className="space-y-4 mt-6">
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-blue-500" />
              <span className="text-gray-700 text-base">Acesso vitalício a todas as estações meteorológicas</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-blue-500" />
              <span className="text-gray-700 text-base">Monitoramento em tempo real do clima</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-blue-500" />
              <span className="text-gray-700 text-base">Suporte técnico prioritário 24/7</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-6 h-6 text-blue-500" />
              <span className="text-gray-700 text-base">Acesso a novas atualizações e funcionalidades da plataforma</span>
            </div>

            <Button className="w-full mt-8 text-lg py-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition">
              Assine agora
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
