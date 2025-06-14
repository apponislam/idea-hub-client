"use client";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Lightbulb, ChevronDown } from "lucide-react";

export const HeroBanner = () => {
    return (
        <section className="relative w-full h-[70vh] md:h-[65vh] min-h-[400px] max-h-[700px] overflow-hidden rounded-2xl">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image src="/banner.jpeg" alt="Developer collaboration" fill className="object-cover" priority quality={100} />
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 to-gray-800/60" />
            </div>

            {/* Content */}
            <div className="relative z-10 container h-full flex items-center px-4">
                <div className="max-w-2xl space-y-6 text-white">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Build the <span className="text-blue-400">Future</span> with Code
                        </h1>

                        <p className="text-[16px] sm:text-lg text-gray-200">Join a community of developers creating innovative solutions that shape tomorrow&apos;s technology landscape.</p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg" asChild>
                                <Link href="/ideas" className="flex items-center gap-2">
                                    Explore Projects
                                    <ArrowRight className="w-5 h-5" />
                                </Link>
                            </Button>

                            <Button size="lg" variant="outline" className="border-blue-300 text-white hover:bg-blue-900/30 hover:text-white bg-transparent" asChild>
                                <Link href="/dashboard" className="flex items-center gap-2">
                                    <Lightbulb className="w-5 h-5" />
                                    Contribute
                                </Link>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Tech Badges */}
            <div className="absolute bottom-16 left-0 w-full sm:flex justify-center gap-6 z-10 hidden">
                {["next", "react", "typescript", "node"].map((tech) => (
                    <motion.div
                        key={tech}
                        whileHover={{ scale: 1.1 }}
                        className="bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center"
                        style={{
                            width: "48px",
                            height: "48px",
                            padding: "4px",
                        }}
                    >
                        <div className="relative w-8 h-8">
                            <Image src={`/${tech}.svg`} alt={`${tech} logo`} fill className="object-contain opacity-90" sizes="32px" />
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Scroll indicator */}
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex flex-col items-center">
                <ChevronDown className="w-6 h-6 text-blue-300" />
                <span className="text-sm text-blue-200 mt-1">Scroll to explore</span>
            </motion.div>
        </section>
    );
};
