import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Leaf, Lightbulb, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function WhyChooseUs() {
    const features = [
        {
            icon: <Leaf className="h-8 w-8 text-emerald-600" />,
            title: "Impact-Driven Community",
            description: "Join 10,000+ members actively reducing waste and carbon footprints.",
        },
        {
            icon: <Lightbulb className="h-8 w-8 text-amber-500" />,
            title: "Monetize Your Ideas",
            description: "Earn rewards for paid sustainability solutions.",
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-blue-600" />,
            title: "Expert-Reviewed",
            description: "Get actionable feedback from environmental specialists.",
        },
    ];

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-950">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <Badge variant="outline" className="px-4 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        Why Join Us?
                    </Badge>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Empower Change Through Collective Action</h2>
                    <p className="max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">Our platform bridges the gap between innovative sustainability ideas and real-world implementation.</p>
                </div>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                    {features.map((feature, index) => (
                        <Card key={index} className="hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-50 mb-4">{feature.icon}</div>
                                <CardTitle>{feature.title}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>{feature.description}</CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 flex flex-col items-center gap-4">
                    <Link href="/register">
                        <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                            Join Our Community
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                    {/* <div className="flex gap-8 mt-6">
                        <div className="text-center">
                            <p className="text-3xl font-bold">5,000+</p>
                            <p className="text-sm text-gray-500">Ideas Shared</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">200+</p>
                            <p className="text-sm text-gray-500">Projects Implemented</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold">90%</p>
                            <p className="text-sm text-gray-500">Positive Feedback</p>
                        </div>
                    </div> */}
                </div>
            </div>
        </section>
    );
}
