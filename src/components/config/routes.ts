import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function getMainNav() {
    const session = await getServerSession(authOptions);
    console.log(session);

    const mainNavIfLoggedOut = [
        { title: "Idea", href: "/idea" },
        { title: "Blog", href: "/blog" },
        { title: "Dashboard", href: "/dashboard" },
        { title: "Login", href: "/login" },
        { title: "Register", href: "/register" },
    ];

    const mainNavIfLoggedIn = [
        { title: "Idea", href: "/idea" },
        { title: "Blog", href: "/blog" },
        { title: "Dashboard", href: "/dashboard" },
        { title: "My Profile", href: "/profile" },
    ];

    const mainNav = session ? mainNavIfLoggedIn : mainNavIfLoggedOut;

    return mainNav;
}
