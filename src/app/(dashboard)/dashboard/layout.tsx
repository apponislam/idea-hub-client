import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="w-full">
                <div className="flex items-center justify-between p-3">
                    <SidebarTrigger />
                    <ModeToggle></ModeToggle>
                </div>
                <div className="p-3 pt-0">{children}</div>
            </main>
        </SidebarProvider>
    );
}
