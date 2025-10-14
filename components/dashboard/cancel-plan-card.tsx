"use client"

import { Card, CardHeader, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

export function CancelPlanCard({ disabled }: { disabled: boolean }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="text-base text-center sm:text-left">Cancelamento De Plano</div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={disabled}>Cancelar inscrição</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar cancelamento</AlertDialogTitle>
                <AlertDialogDescription>
                  Ao confirmar, sua assinatura será cancelada e você manterá o acesso até o fim do período vigente.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Manter plano</AlertDialogCancel>
                <AlertDialogAction>Confirmar cancelamento</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <CardDescription>Se você cancelar agora, poderá continuar acessando sua assinatura até que sua assinatura atual expire.</CardDescription>
      </CardHeader>
    </Card>
  )
}