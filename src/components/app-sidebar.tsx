import { Home, Lightbulb, List, ShoppingCart, User, Users } from "lucide-react";
import Link from "next/link";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

const allItems = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
        roles: ["ADMIN", "MEMBER"],
    },
    {
        title: "My Idea",
        url: "/dashboard/myidea",
        icon: Lightbulb,
        roles: ["MEMBER", "ADMIN"],
    },
    {
        title: "My Purchases",
        url: "/dashboard/mypurchases",
        icon: ShoppingCart,
        roles: ["MEMBER", "ADMIN"],
    },
    {
        title: "Manage Ideas",
        url: "/dashboard/manageideas",
        icon: Lightbulb,
        roles: ["ADMIN"],
    },
    {
        title: "Manage Users",
        url: "/dashboard/manageusers",
        icon: Users,
        roles: ["ADMIN"],
    },
    {
        title: "Manage Categories",
        url: "/dashboard/managecategories",
        icon: List,
        roles: ["ADMIN"],
    },
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User,
        roles: ["ADMIN", "MEMBER"],
    },
];

export async function AppSidebar() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const role = session?.user?.role;

    const filteredItems = allItems.filter((item) => item.roles.includes(role || ""));

    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <Link href="/">
                        <SidebarGroupLabel>Sustainability Idea Hub</SidebarGroupLabel>
                    </Link>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
