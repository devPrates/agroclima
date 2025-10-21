import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "axios";
import { generateToken } from "@/lib/jwt";
import jwt from "jsonwebtoken"; // Validar OTP token
import crypto from "crypto"; // Comparar hash do OTP

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
        otpToken: { label: "OTP Token", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          const email = credentials?.email as string | undefined;
          const otp = credentials?.otp as string | undefined;
          const otpToken = credentials?.otpToken as string | undefined;
          if (!email || !otp || !otpToken) {
            return null;
          }

          const jwtSecret = process.env.JWT_SECRET;
          if (!jwtSecret) {
            console.error("JWT_SECRET não configurado");
            return null;
          }

          // Verificar token do OTP e comparar hash
          let payload: any;
          try {
            payload = jwt.verify(otpToken, jwtSecret);
          } catch (e) {
            console.error("Falha ao verificar otpToken:", e);
            return null;
          }

          const expectedHash = payload?.otpHash as string | undefined;
          const providedHash = crypto.createHmac("sha256", jwtSecret).update(otp).digest("hex");
          if (!expectedHash || expectedHash !== providedHash || payload?.email !== email) {
            return null;
          }

          const baseUrl = process.env.USER_LOOKUP_URL;
          if (!baseUrl) {
            console.error("USER_LOOKUP_URL não configurado");
            return null;
          }

          // Verifica o email na API externa
          const token = generateToken({ sub: 1, name: "AgroClima API" }, "15m");
          const url = `${baseUrl}${encodeURIComponent(email)}`;
          const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
            timeout: 10000,
          });

          if (res.status !== 200 || !res.data?.ok || !res.data?.user) {
            return null;
          }

          return { id: res.data.user.id, email } as any;
        } catch (error) {
          console.error("NextAuth authorize error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  events: {
    async signIn({ user }) {
      // Temporariamente desabilitado para evitar dependência do Prisma durante login
      // Quando o Prisma Client estiver gerado, podemos reabilitar a persistência local.
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };