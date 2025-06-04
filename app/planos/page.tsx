import { MultiStepForm } from "@/components/planos/multi-step-form";

export default function Planos() {
  return (
    <main className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Formulário de Cadastro</h1>
      <MultiStepForm />
    </main>
  )
}