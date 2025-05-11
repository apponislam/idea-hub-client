import { authOptions } from "@/lib/authOptions";
import { ModeToggle } from "./mode-toggle";
import { getServerSession } from "next-auth";
// import {  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Button } from "./ui/button";
import Link from "next/link";
import { CircleUserRound, LayoutDashboard, User } from "lucide-react";
import { DropdownMenu, DropdownMenuShortcut, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import SignOutBtn from "./sign-out-button";
import Image from "next/image";

const NavRightMenu = async () => {
    const session = await getServerSession(authOptions);

    return (
        <nav className="flex items-center gap-4">
            {session ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className="flex items-center p-1 rounded-full h-10 w-10">{session?.user?.image ? <Image src={session.user.image} alt={session.user.name ?? "User"} width={32} height={32} className="rounded-full" /> : <CircleUserRound style={{ height: "32px", width: "32px" }} />}</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <Link href="/dashboard">
                                <DropdownMenuItem>
                                    <LayoutDashboard />
                                    <span>Dashboard</span>
                                    <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/dashboard/profile">
                                <DropdownMenuItem>
                                    <User />
                                    <span>Profile</span>
                                    <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
                                </DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator />
                        <SignOutBtn></SignOutBtn>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <></>
            )}
            <ModeToggle />
        </nav>
    );
};

export default NavRightMenu;
