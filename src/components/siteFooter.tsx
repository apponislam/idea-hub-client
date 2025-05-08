import Link from "next/link";
import { Mail, Twitter, Facebook, Linkedin, Instagram } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export function SiteFooter() {
    return (
        <footer className="bg-background border-t">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo and description */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Sustainability Idea Hub</h3>
                        <p className="text-sm text-muted-foreground">Empowering communities to share and implement sustainable ideas for a greener future.</p>
                        <div className="flex space-x-4">
                            <Button variant="ghost" size="icon" aria-label="Twitter">
                                <Twitter className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" aria-label="Facebook">
                                <Facebook className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" aria-label="LinkedIn">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" aria-label="Instagram">
                                <Instagram className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/" className="hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/ideas" className="hover:text-primary transition-colors">
                                    Ideas
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-primary transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="hover:text-primary transition-colors">
                                    Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Categories</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link href="/categories/energy" className="hover:text-primary transition-colors">
                                    Energy
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories/waste" className="hover:text-primary transition-colors">
                                    Waste
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories/transportation" className="hover:text-primary transition-colors">
                                    Transportation
                                </Link>
                            </li>
                            <li>
                                <Link href="/categories/all" className="hover:text-primary transition-colors">
                                    View All
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Stay Updated</h3>
                        <p className="text-sm text-muted-foreground">Subscribe to our newsletter for the latest sustainable ideas.</p>
                        <div className="flex space-x-2">
                            <Input type="email" placeholder="Your email" className="flex-1" />
                            <Button variant="default" size="icon" aria-label="Subscribe">
                                <Mail className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
                    <div>© {new Date().getFullYear()} Sustainability Idea Hub. All rights reserved.</div>
                    <div className="flex space-x-4 mt-4 md:mt-0">
                        <Link href="/privacy" className="hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/contact" className="hover:text-primary transition-colors">
                            Contact Us
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
