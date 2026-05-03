import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs"; // 비밀번호 해시 비교용 (추가 설치 필요)

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
    maxAge: 60 * 60, // 1시간
  },
  secret: process.env.NEXTAUTH_SECRET,
};
