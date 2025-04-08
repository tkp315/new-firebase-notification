import connectToDB from "@/lib/db";
import { Role, User } from "@/models/user.model";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { NextResponse } from "next/server";
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          response_type: "code",
          access_type: "offline",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      await connectToDB();
  
      const existingUser = await User.findOne({ email: profile?.email });
      
      if (!existingUser) {
         await User.create({
          email: profile?.email,
          name: profile?.name,
          role: Role.USER,
        });
      }
     
      return true;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken!;
      session.role = token.role!;
      session._id = token._id!;
      return session;
    },
    async jwt({ token, user, account }) {
      
       await connectToDB();

       const user1 = await User.findOne({email:token.email})
       if (!user1){
        NextResponse.json({
          message:"USER NOT FOUND",
          statusCode:404
        })
       }

       console.log("My user:::",user1)
        if (user) {
          token.accessToken = account?.access_token;
          token.role = user.role;
          token._id = String(user1?._id);
        }
        console.log("Token at options:",token)
        return token;
      }
  },
  pages: {
    signIn: '/sign-in',
    signOut: '/sign-out'
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
};
