import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Hyosung Admin",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const admin = await prisma.admin.findUnique({
          where: { username: credentials.username },
        });

        // bcryptjs를 사용하여 암호화된 비밀번호 비교
        if (admin && (await compare(credentials.password, admin.password))) {
          return {
            id: admin.id,
            name: admin.name,
            username: admin.username,
            role: admin.role, // 권한 정보 추가
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 20 * 60, // 20분
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // maxAge를 설정하지 않으면 세션 쿠키가 되어 브라우저 종료 시 삭제됩니다.
      },
    },
  },
  // Vercel(서버리스) 환경에서는 런타임 랜덤 ID 대신 고정된 secret을 사용하여 세션 안정성을 유지합니다.
  secret: process.env.NEXTAUTH_SECRET || "hyosung-electric-secure-key-2024",
};
