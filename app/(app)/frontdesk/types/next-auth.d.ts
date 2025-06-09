// types/next-auth.d.ts
import NextAuth from "next-auth";
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  // Extend User type (returned by `useSession` and callbacks)
  interface User extends DefaultUser {
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    avatar?: string;
  }

  // Extend Session type (session.user)
  interface Session {
    user: User & DefaultSession["user"]; // intersection with default user properties
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    phoneNumber?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    avatar?: string;
  }
}
