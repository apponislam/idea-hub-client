import { getMainNav } from "@/components/config/routes";
import { MainNav } from "@/components/main-nav";
import NavRightMenu from "@/components/nav-right-menu";
import { SiteFooter } from "@/components/siteFooter";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
    const mainNav = await getMainNav();

    return (
        <div>
            <div className="mx-3 md:mx-0">
                <div className="sticky top-0 bg-white dark:bg-[#0a0a0a] z-50">
                    <header className=" container z-50 bg-background mx-auto">
                        <div className="flex h-20 items-center justify-between py-6">
                            <MainNav items={mainNav} />
                            <NavRightMenu></NavRightMenu>
                        </div>
                    </header>
                </div>

                <div className="container mx-auto">
                    {children}
                    <SiteFooter></SiteFooter>
                </div>
            </div>
        </div>
    );
}
