// types/next-auth.d.ts
import { DefaultUser } from "next-auth";

declare module "next-auth" {
    interface User extends DefaultUser {
        id: string;
        accessToken?: string;
        refreshToken?: string;
        role?: string;
    }

    interface Session {
        user: {
            id: string;
            accessToken?: string;
            refreshToken?: string;
            role?: string;
        } & DefaultUser;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        accessToken?: string;
        refreshToken?: string;
        role?: string;
    }
}
