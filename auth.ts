import NextAuth from "next-auth"

import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs';


export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any) {
        console.log('credentials0', credentials)
        const user = await prisma.user.findUnique({
          where: {
            email: credentials?.email
          }
        }) as any;
        console.log('credentials', credentials, user)

        const isValid = await bcrypt.compare(credentials?.password, user?.password)

        if (!isValid) {
          throw new Error("Invalid password.")
        }

        return user

      },
    }),
  ],
  callbacks: {
    // async jwt({ token, user }) {
    //   if (user) {
    //     // set user role here          
    //     token.id = user?.id;
    //     token.phoneNumber = user?.phoneNumber;
    //     token.email = user?.email;
    //     token.firstName = user?.firstName;
    //     token.lastName = user?.lastName;
    //     token.role = user?.role;
    //     token.avatar = user?.avatar;

    //   }
    //   return token;
    // },
    // async session({ session, token }) {
    //   if (token) {
    //     session.user.id = token?.id;
    //     session.user.email = token.email;
    //     session.user.phoneNumber = token?.phoneNumber;
    //     session.user.firstName = token?.firstName;
    //     session.user.lastName = token?.lastName;
    //     session.user.avatar = token?.avatar;
    //     session.user.role = token.role; 
    //   }
    //   return session;
    // },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id ;
        token.phoneNumber = user.phoneNumber;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.avatar = user.avatar;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.phoneNumber = token.phoneNumber;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
        session.user.role = token.role;
        session.user.avatar = token.avatar;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,

})