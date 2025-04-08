"use client";

import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

interface AuthProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

 function AuthProvider({ children, session }: AuthProviderProps) {
return <SessionProvider session={session}>
    {children}
</SessionProvider>
}
export default AuthProvider