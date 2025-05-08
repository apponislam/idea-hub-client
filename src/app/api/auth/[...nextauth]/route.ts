import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch("http://localhost:5000/api/v1/auth/login", {
                        method: "POST",
                        body: JSON.stringify(credentials),
                        headers: { "Content-Type": "application/json" },
                    });

                    const data = await res.json();

                    if (!res.ok) throw new Error(data.message || "Authentication failed");

                    return {
                        id: data.data.user.id,
                        name: data.data.user.name,
                        email: data.data.user.email,
                        image: data.data.user.image,
                        role: data.data.user.role,
                    };
                } catch (error) {
                    console.error("Authentication error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }: { token: any; user?: any }) {
            if (user) {
                return {
                    ...token,
                    accessToken: user.accessToken,
                    refreshToken: user.refreshToken,
                    role: user.role,
                };
            }
            return token;
        },
        async session({ session, token }: { session: any; token: any }) {
            session.user = {
                ...session.user,
                id: token.sub,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                role: token.role,
            };
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60 * 30,
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
