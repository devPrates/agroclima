import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import axios from "axios";
import { generateToken } from "@/lib/jwt";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { Suspense } from "react";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const email = session.user?.email;
  let user: { nome: string; login: string; max_sessions: number; pagante: string } | null = null;

  if (email && process.env.USER_LOOKUP_URL) {
    try {
      const token = generateToken({ sub: 1, name: "AgroClima API" }, "1h");
      const res = await axios.get<{ ok: boolean; user?: any }>(
        `${process.env.USER_LOOKUP_URL}${encodeURIComponent(email)}`,
        {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          timeout: 10000,
        }
      );
      if (res.status === 200 && res.data?.ok && res.data.user) {
        const u = res.data.user;
        user = { nome: u.nome, login: u.login, max_sessions: u.max_sessions, pagante: u.pagante };
      }
    } catch (e) {
      user = null;
    }
  }
  // Preços via .env e anual com 10% de desconto
  const toPrice = (val: string | undefined, fallback: number) => {
    const n = Number(val)
    return Number.isFinite(n) && n > 0 ? n : fallback
  }

  const individualMonthly = toPrice(process.env.INDIVIDUAL_MONTHLY_PRICE, 25)
  const sessions3Monthly = toPrice(process.env.CUSTOM_3_MONTHLY_PRICE, 70)
  const sessions5Monthly = toPrice(process.env.CUSTOM_5_MONTHLY_PRICE, 60)
  const individualAnnual = individualMonthly * 12 * 0.9

  // Buscar pagamentos via Prisma para o usuário autenticado
  let payments: { name: string; amount: number; date: string }[] = []
  if (email) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { login: email } })
      let paymentsFromJoin: any[] = []
      if (dbUser) {
        const ups = await prisma.userPayment.findMany({
          where: { userId: dbUser.id },
          include: { payment: true },
          orderBy: { createdAt: "desc" },
        })
        paymentsFromJoin = ups.map((up) => up.payment).filter(Boolean)
      }
      const paymentsByEmail = await prisma.payment.findMany({
        where: { payerEmail: email },
        orderBy: { createdAt: "desc" },
      })
      // Mesclar por id
      const map = new Map<string, any>()
      for (const p of [...paymentsFromJoin, ...paymentsByEmail]) {
        if (p && p.id) map.set(p.id, p)
      }
      const merged = Array.from(map.values())

      const deriveSessions = (p: any): number | undefined => {
        const meta: any = p.metadata || {}
        const sMeta = Number(meta?.sessions)
        if (sMeta === 2 || sMeta === 3 || sMeta === 5) return sMeta
        const extRef = p.externalReference
        if (typeof extRef === "string") {
          const m = extRef.match(/(?:^|[|&])sessions=(\d+)/i)
          if (m) {
            const s = Number(m[1])
            if (s === 2 || s === 3 || s === 5) return s
          }
        }
        return user?.max_sessions
      }

      payments = merged.map((p) => {
        const sessions = deriveSessions(p)
        const name = sessions === 3 || sessions === 5 ? `Personalizado (${sessions} sessões)` : "Individual"
        const amount = p.amount ? Number(p.amount.toString()) : 0
        const dateObj = p.performedAt ?? p.createdAt
        const date = dateObj ? new Date(dateObj).toISOString() : new Date().toISOString()
        return { name, amount, date }
      })
    } catch (e) {
      // Se falhar, mantém a lista vazia
    }
  }

  return (
    <Suspense fallback={<div className="flex items-center justify-center p-10"><span className="text-muted-foreground">Carregando dashboard...</span></div>}>
      <DashboardContent
        user={user}
        payerEmail={email ?? undefined}
        monthlyPrice={individualMonthly}
        annualPrice={individualAnnual}
        sessions3Monthly={sessions3Monthly}
        sessions5Monthly={sessions5Monthly}
        payments={payments}
      />
    </Suspense>
  );
}