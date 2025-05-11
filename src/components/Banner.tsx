"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export const HeroBanner = () => {
    return (
        <section className="relative w-full h-[70vh] max-h-[900px] overflow-hidden rounded-2xl">
            <div className="absolute inset-0 z-0">
                <Image src="/banner.jpeg" alt="Sustainable future" fill className="object-cover" priority quality={100} />
                {/* <div className="absolute inset-0 bg-gradient-to-r from-green-900/85 to-green-800/70" /> */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-800/70" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 container h-full flex items-center">
                <Card className="bg-transparent border-none shadow-none max-w-2xl">
                    <CardHeader className="px-0">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6 px-6 md:px-12">
                            <CardTitle className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                Innovate for a <span className="text-green-300">Developer</span> Tomorrow
                            </CardTitle>

                            <CardDescription className="text-lg md:text-xl text-green-50">Join our network of forward-thinking developers to create, explore, and support innovative solutions that will define the future of technology.</CardDescription>

                            <CardContent className="flex flex-col sm:flex-row gap-4 px-0 pt-4">
                                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white text-lg shadow-lg transition-all" asChild>
                                    <Link href="/ideas" className="flex items-center gap-2">
                                        <span>Explore Ideas</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                </Button>

                                <Button size="lg" variant="outline" className="border-green-300 bg-transparent text-green-100 hover:bg-green-900/30 hover:text-white text-lg" asChild>
                                    <Link href="/register" className="flex items-center gap-2">
                                        <Lightbulb className="w-5 h-5" />
                                        <span>Submit Your Idea</span>
                                    </Link>
                                </Button>
                            </CardContent>
                        </motion.div>
                    </CardHeader>
                </Card>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-green-950 to-transparent z-10" />
            <LeafDecoration />

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-green-300 flex flex-col items-center">
                    <ChevronDown className="w-8 h-8" />
                    <span className="text-sm mt-1">Scroll to explore</span>
                </motion.div>
            </div>
        </section>
    );
};

const LeafDecoration = () => {
    return (
        <>
            <motion.div
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, 5, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute top-1/4 right-20 z-10"
            >
                <Image src="/next-js.svg" width={80} height={80} alt="Leaf decoration" className="opacity-90 drop-shadow-lg" />
            </motion.div>

            <motion.div
                animate={{
                    y: [0, 15, 0],
                    rotate: [0, -5, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
                className="absolute bottom-1/3 left-10 z-10"
            >
                <Image src="/postgresql.svg" width={60} height={60} alt="Leaf decoration" className="opacity-90 drop-shadow-lg" />
            </motion.div>
        </>
    );
};

// Import these icons from lucide-react
import { ArrowRight, Lightbulb, ChevronDown } from "lucide-react";
