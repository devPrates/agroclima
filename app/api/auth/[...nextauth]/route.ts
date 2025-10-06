import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Email OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
        otpToken: { label: "OTP Token", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          const secret = process.env.JWT_SECRET;
          if (!secret) {
            throw new Error("JWT_SECRET not configured");
          }

          const email = credentials?.email as string | undefined;
          const otp = credentials?.otp as string | undefined;
          const otpToken = credentials?.otpToken as string | undefined;

          if (!email || !otp || !otpToken) {
            return null;
          }

          const decoded = jwt.verify(otpToken, secret) as any;
          if (decoded?.email !== email) {
            return null;
          }
          if (decoded?.otp !== otp) {
            return null;
          }

          return { id: email, email } as any;
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
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };