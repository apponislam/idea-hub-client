import { NextAuthOptions } from "next-auth";
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
                    const res = await fetch("https://idea-hub-server.vercel.app/api/v1/auth/login", {
                        method: "POST",
                        body: JSON.stringify(credentials),
                        headers: { "Content-Type": "application/json" },
                    });

                    const data = await res.json();

                    if (!res.ok) throw new Error(data.message || "Authentication failed");

                    // Return both user data and tokens
                    return {
                        id: data.data.user.id,
                        name: data.data.user.name,
                        email: data.data.user.email,
                        image: data.data.user.image,
                        role: data.data.user.role,
                        accessToken: data.data.accessToken,
                        refreshToken: data.data.refreshToken,
                    };
                } catch (error) {
                    console.error("Authentication error:", error);
                    return null;
                }
            },
        }),
    ],
    cookies: {
        sessionToken: {
            name: "next-auth.session-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
                maxAge: 30 * 24 * 60 * 60, // 30 days
            },
        },
        callbackUrl: {
            name: "next-auth.callback-url",
            options: {
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
        csrfToken: {
            name: "next-auth.csrf-token",
            options: {
                httpOnly: true,
                sameSite: "lax",
                path: "/",
                secure: process.env.NODE_ENV === "production",
            },
        },
    },
    callbacks: {
        async jwt({ token, user }) {
            // Initial sign in
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    accessToken: user?.accessToken,
                    refreshToken: user?.refreshToken,
                    role: user.role,
                };
            }
            return token;
        },
        async session({ session, token }) {
            session.user = {
                ...session.user,
                id: token.id,
                accessToken: token.accessToken,
                refreshToken: token.refreshToken,
                role: token.role,
            };
            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60 * 30,
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    debug: process.env.NODE_ENV === "development",
};
