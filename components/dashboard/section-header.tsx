"use client"

import { ReactNode } from "react"

type Section = "dashboard" | "plan" | "perfil"

export function SectionHeader({ section }: { section: Section }) {
  return (
    <div>
      {section === "dashboard" ? (
        <>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-2">Resumo e ações rápidas conforme seu plano.</p>
        </>
      ) : section === "plan" ? (
        <>
          <h1 className="text-3xl font-semibold">Plano e Faturamento</h1>
          <p className="text-sm text-muted-foreground mt-2">Veja seu plano de assinatura e informações de cobrança.</p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-semibold">Perfil</h1>
          <p className="text-sm text-muted-foreground mt-2">Seus dados de acesso e plano atual.</p>
        </>
      )}
    </div>
  )
}