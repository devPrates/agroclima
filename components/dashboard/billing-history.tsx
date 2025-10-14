"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function BillingHistory() {
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
            <TableBody />
          </Table>
          <div className="mt-4 text-center text-sm text-muted-foreground">Nenhuma cobrança registrada ainda.</div>
        </CardContent>
      </Card>
    </div>
  )
}