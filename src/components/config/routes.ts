import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export async function getMainNav() {
    const session = await getServerSession(authOptions);

    const mainNavIfLoggedOut = [
        { title: "Ideas", href: "/ideas" },
        { title: "Blog", href: "/blog" },
        { title: "Dashboard", href: "/dashboard" },
        { title: "About Us", href: "/about" },
        { title: "Contact", href: "/contact" },
        { title: "Login", href: "/login" },
        { title: "Register", href: "/register" },
    ];

    const mainNavIfLoggedIn = [
        { title: "Ideas", href: "/ideas" },
        { title: "Blog", href: "/blog" },
        { title: "Dashboard", href: "/dashboard" },
        { title: "About Us", href: "/about" },
        { title: "Contact", href: "/contact" },
        { title: "My Profile", href: "/dashboard/profile" },
    ];

    const mainNav = session ? mainNavIfLoggedIn : mainNavIfLoggedOut;

    return mainNav;
}
