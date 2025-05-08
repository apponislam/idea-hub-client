import React from "react";
import "./globals.css"; // Ensure your global.d.ts fix is in place
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { House } from "lucide-react";

export default function Custom404() {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center space-y-4 h-min">
                <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl">404 - Page Not Found</h1>
                <h3 className="font-heading sm:text-xl md:text-xl">Sorry, the page you are looking for does not exist.</h3>
                <Link href={"/"} rel="noreferrer" className={cn(buttonVariants({ size: "lg" }), "mt-4")}>
                    <House className="w-4 h-4 mr-1" />
                    Home
                </Link>
            </div>
        </div>
    );
}
