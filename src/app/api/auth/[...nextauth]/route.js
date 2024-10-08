import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},
      async authorize(credentials, req) {
        if (!credentials) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            role: true,
          }
        });

        if (
          user &&
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          if (!user.confirmed) {
            // Throw an error if the account is not confirmed
            throw Error(
              "Please activate your account from the email sent to you."
            );
          }
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            // role: user.role,
          };
        } else {
          throw Error("Invalid email or password");
        }
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //   profile(profile) {
    //     return {
    //       id: profile.sub,
    //       name: `${profile.given_name} ${profile.family_name}`,
    //       email: profile.email,
    //       image: profile.picture,
    //     }
    //   },
    // }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }

      return token;
    },
    session: async ({ session, token }) => {
      // console.log("token", token);
      const role = await prisma.user.findUnique({
        where: {
          id: token.id
        },
        include: {
          role: true
        }
      })

      // console.log("role", role);
      
      if (session.user) {
        session.user.id = token.id;
        session.user.role = role.role?.nameRole;
        session.user.image = token.picture; // เพิ่มการรับรูปภาพเข้ามา
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/profile`;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
