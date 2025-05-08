import { getMainNav } from "@/components/config/routes";
import { MainNav } from "@/components/main-nav";
import NavRightMenu from "@/components/nav-right-menu";
import { SiteFooter } from "@/components/siteFooter";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
    const mainNav = await getMainNav();

    return (
        <div className="container mx-auto">
            <div className="mx-3 md:mx-0">
                <header className="container z-50 bg-background mx-auto">
                    <div className="flex h-20 items-center justify-between py-6">
                        <MainNav items={mainNav} />
                        {/* <nav className="flex items-center gap-4">
                            <ModeToggle />
                        </nav> */}
                        <NavRightMenu></NavRightMenu>
                    </div>
                </header>
                {children}
                <SiteFooter></SiteFooter>
            </div>
        </div>
    );
}
