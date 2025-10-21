"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table"

type PaymentRow = { name: string; amount: number; date: string }

export function BillingHistory({ payments = [] }: { payments?: PaymentRow[] }) {
  const hasRows = payments.length > 0
  const formatCurrency = (n: number) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n)
  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(d)
  }
  return (
    <div>
      <h2 className="text-base font-semibold mb-3 text-center md:text-left">Histórico De Cobrança</h2>
      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Quantia</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hasRows && payments.map((p, idx) => (
                <TableRow key={idx}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>{formatCurrency(p.amount)}</TableCell>
                  <TableCell>{formatDate(p.date)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {!hasRows && (
            <div className="mt-4 text-center text-sm text-muted-foreground">Nenhuma cobrança registrada ainda.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}