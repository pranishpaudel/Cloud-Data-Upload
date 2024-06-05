import axios from "axios";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "@/lib/db/db.config";
import bcrypt from "bcrypt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        identifier: { label: "identifier" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { identifier, password } = credentials;
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: identifier as string,
            },
          });

          if (!user) throw new Error("User not found");

          const isUserVerified = user.isVerified;
          if (!isUserVerified) throw new Error("User not verified");

          const isValidPassword = await bcrypt.compare(
            password as string,
            user.password as string
          );
          if (!isValidPassword) throw new Error("Invalid password");

          return user ;
        } catch (error: any) {
          throw new Error(error.message);
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.userid as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAdmin = token.isAdmin as boolean;
        session.user.projects = token.projects as string[];
        session.user.name = token.name as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userid = user.id;
        token.isVerified = user.isVerified;
        token.isAdmin = user.isAdmin;
        token.projects = user.projects;
        token.name = user.name;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  secret: process.env.AUTH_SECRET,
});
