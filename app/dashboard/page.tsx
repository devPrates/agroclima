import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import axios from "axios";
import { generateToken } from "@/lib/jwt";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { Suspense } from "react";

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
  // Preços de teste: todos em R$ 1,00
  const individualMonthly = 1
  const individualAnnual = 1
  const sessions3Monthly = 1
  const sessions5Monthly = 1

  return (
    <Suspense fallback={<div className="flex items-center justify-center p-10"><span className="text-muted-foreground">Carregando dashboard...</span></div>}>
      <DashboardContent
        user={user}
        payerEmail={email ?? undefined}
        monthlyPrice={individualMonthly}
        annualPrice={individualAnnual}
        sessions3Monthly={sessions3Monthly}
        sessions5Monthly={sessions5Monthly}
      />
    </Suspense>
  );
}