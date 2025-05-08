"use client";
import React from "react";
import { DropdownMenuItem, DropdownMenuShortcut } from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

const SignOutBtn = () => {
    return (
        <DropdownMenuItem onClick={() => signOut()}>
            <LogOut />
            <span>Log out</span>
            <DropdownMenuShortcut>⌘L</DropdownMenuShortcut>
        </DropdownMenuItem>
    );
};

export default SignOutBtn;
