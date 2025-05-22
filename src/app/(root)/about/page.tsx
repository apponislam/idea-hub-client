import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Lightbulb, ShieldCheck, Users, ArrowRight } from "lucide-react";
import { TeamMember } from "./Team-member";
import Link from "next/link";

export default function AboutPage() {
    const team = [
        {
            name: "Alex Green",
            role: "Founder & CEO",
            bio: "Environmental scientist with 10+ years in sustainability projects.",
        },
        {
            name: "Sarah Eco",
            role: "Community Manager",
            bio: "Expert in building engaged eco-communities.",
        },
    ];

    return (
        <div className="container mx-auto px-4 py-12 space-y-16">
            {/* Hero Section */}
            <section className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                    Powering <span className="text-primary">Sustainable</span> Innovation
                </h1>
                <p className="mt-6 text-lg text-muted-foreground">We connect thinkers, doers, and changemakers to turn eco-ideas into reality.</p>
            </section>

            {/* Mission Section */}
            <section className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-muted-foreground mb-6">To democratize sustainability innovation by providing a platform where every voice can contribute to environmental solutions.</p>
                    <Button variant="outline" className="text-primary">
                        See Our Impact Report
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
                <div className="bg-secondary rounded-lg p-8">
                    <Globe className="h-12 w-12 mx-auto text-primary mb-4" />
                    <h3 className="text-xl font-semibold text-center mb-2">5,000+ Ideas Shared</h3>
                    <p className="text-center text-muted-foreground">Leading to 200+ implemented projects worldwide</p>
                </div>
            </section>

            {/* How It Works */}
            <section>
                <h2 className="text-2xl font-bold mb-8 text-center">How Our Platform Works</h2>
                <div className="grid md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Lightbulb className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Submit Ideas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Members share sustainability solutions, either free or paid.</CardDescription>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <ShieldCheck className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Expert Review</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Our team vets ideas for feasibility and impact.</CardDescription>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <CardTitle>Community Implementation</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CardDescription>Top-voted projects get community support and funding.</CardDescription>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Team Section */}
            <section>
                <h2 className="text-2xl font-bold mb-8 text-center">Meet Our Team</h2>
                <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {team.map((member) => (
                        <TeamMember key={member.name} {...member} />
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-primary/10 rounded-xl p-8 text-center">
                <h2 className="text-2xl font-bold mb-4">Ready to Make an Impact?</h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">Join our growing community of sustainability innovators today.</p>
                <div className="flex gap-4 justify-center">
                    <Link href="/register">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">Sign Up Free</Button>
                    </Link>
                    <Link href="/ideas">
                        <Button variant="secondary">Browse Ideas</Button>
                    </Link>
                </div>
            </section>
        </div>
    );
}
