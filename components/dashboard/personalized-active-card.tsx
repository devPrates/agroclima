"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function PersonalizedActiveCard() {
  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Bem-vindo!</h2>
          <p className="text-sm text-muted-foreground">Seu plano personalizado está ativo.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <a href="/dashboard?tab=plan">Ver plano e faturamento</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="https://agroclima.net/sbadmin2/perfil.php" target="_blank" rel="noopener noreferrer">Acessar o sistema</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}