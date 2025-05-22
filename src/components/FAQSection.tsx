"use client";
import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

const FAQSection = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");

    const faqData = {
        general: [
            {
                question: "What is the Sustainability Idea Hub?",
                answer: "Our platform is a community-driven space for sharing and developing sustainable solutions to environmental challenges. Members can submit ideas, collaborate, and help bring eco-friendly projects to life.",
            },
            {
                question: "How do I get started with the platform?",
                answer: "Simply register for an account, verify your email, and you can immediately start browsing ideas. To submit your own ideas or participate in discussions, you'll need to complete your profile.",
            },
            {
                question: "Is there a mobile app available?",
                answer: "Currently we're web-only, but our site is fully responsive and works great on mobile browsers. We plan to launch native apps in the future.",
            },
        ],
        ideas: [
            {
                question: "How do I submit a sustainability idea?",
                answer: "Navigate to your dashboard and click 'Create New Idea'. Provide a title, detailed description, select relevant categories, and upload any supporting images or documents. You can save as draft or submit for admin review.",
            },
            {
                question: "What makes a good sustainability idea submission?",
                answer: "Strong submissions clearly define: 1) The environmental problem being addressed, 2) The proposed solution, 3) Potential impact, and 4) Implementation steps. Including research or data strengthens your proposal.",
            },
            {
                question: "Can I collaborate with others on an idea?",
                answer: "Absolutely! Once your idea is approved, other members can comment and suggest improvements. For deeper collaboration, use the 'Team Up' feature to invite specific members to work with you.",
            },
        ],
        voting: [
            {
                question: "How does the voting system work?",
                answer: "Each member gets one vote per idea (up or down). Voting helps surface the best ideas to the community. Top-voted ideas get featured on our homepage and may receive additional support from our partners.",
            },
            {
                question: "Why can't I vote on some ideas?",
                answer: "You need to be logged in to vote. Also, voting is disabled during admin review or if the idea creator has disabled voting. Premium ideas may require payment before voting is enabled.",
            },
            {
                question: "How are featured ideas selected?",
                answer: "Our algorithm considers vote count, engagement metrics, and admin selections. We prioritize ideas with clear environmental impact, feasibility, and community support.",
            },
        ],
        premium: [
            {
                question: "What are premium ideas?",
                answer: "Premium ideas are specialized solutions that creators choose to monetize. These often include detailed implementation plans, proprietary research, or professional consulting services.",
            },
            {
                question: "How do payments work for premium content?",
                answer: "We use secure payment processing (SSLCommerz). 80% goes to the idea creator, 20% supports platform maintenance. Payments are one-time unless marked as subscription-based.",
            },
            {
                question: "Can I make my idea premium later?",
                answer: "Yes, you can convert free ideas to premium, but only if they haven't received significant community contributions. This ensures fair access to collaboratively developed solutions.",
            },
        ],
        moderation: [
            {
                question: "How long does idea review take?",
                answer: "Our admin team typically reviews submissions within 48 hours. Complex proposals or high-volume periods may take up to 5 business days. You'll receive email notifications about your submission status.",
            },
            {
                question: "Why was my idea rejected?",
                answer: "Common reasons include: insufficient detail, lack of environmental focus, duplication of existing ideas, or policy violations. You'll always receive specific feedback to improve your submission.",
            },
            {
                question: "How do I report inappropriate content?",
                answer: "Use the 'Report' button on any idea or comment. Our moderation team reviews reports daily and will take appropriate action per our community guidelines.",
            },
        ],
    };

    // const allQuestions = Object.values(faqData).flat();

    const filteredFaqs = {
        general: faqData.general.filter((item) => item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.answer.toLowerCase().includes(searchQuery.toLowerCase())),
        ideas: faqData.ideas.filter((item) => item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.answer.toLowerCase().includes(searchQuery.toLowerCase())),
        voting: faqData.voting.filter((item) => item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.answer.toLowerCase().includes(searchQuery.toLowerCase())),
        premium: faqData.premium.filter((item) => item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.answer.toLowerCase().includes(searchQuery.toLowerCase())),
        moderation: faqData.moderation.filter((item) => item.question.toLowerCase().includes(searchQuery.toLowerCase()) || item.answer.toLowerCase().includes(searchQuery.toLowerCase())),
    };

    const hasResults = Object.values(filteredFaqs).some((category) => category.length > 0);

    return (
        <section className="container mx-auto md:px-4 py-12 md:py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Community Help Center</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Find answers to your questions about submitting ideas, community guidelines, and platform features.</p>
            </div>

            <Card className="w-full mx-auto p-3 md:p-6">
                {/* Search */}
                <div className="mb-8">
                    <Input placeholder="Search help articles..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full" />
                </div>

                {hasResults ? (
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto mb-6">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="ideas">Ideas</TabsTrigger>
                            <TabsTrigger value="voting">Voting</TabsTrigger>
                            <TabsTrigger value="premium">Premium</TabsTrigger>
                            <TabsTrigger value="moderation">Moderation</TabsTrigger>
                        </TabsList>

                        {Object.entries(filteredFaqs).map(
                            ([category, items]) =>
                                items.length > 0 && (
                                    <TabsContent key={category} value={category}>
                                        <Accordion type="single" collapsible className="w-full">
                                            {items.map((item, index) => (
                                                <AccordionItem key={`${category}-${index}`} value={`${category}-${index}`}>
                                                    <AccordionTrigger className="text-left hover:no-underline px-4 py-3">
                                                        <span className="font-medium text-base hover:underline">{item.question}</span>
                                                    </AccordionTrigger>
                                                    <AccordionContent className="px-4 pb-3 text-muted-foreground">{item.answer}</AccordionContent>
                                                </AccordionItem>
                                            ))}
                                        </Accordion>
                                    </TabsContent>
                                )
                        )}
                    </Tabs>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-lg text-muted-foreground">No results found for {searchQuery}. Try different keywords or browse our categories.</p>
                    </div>
                )}

                <Separator className="my-8" />

                {/* Support Card */}
                <div className="bg-secondary/30 rounded-lg p-3">
                    <h3 className="text-xl font-semibold mb-2">Still need help?</h3>
                    <p className="text-muted-foreground mb-4">Our support team is available to answer your specific questions about the platform.</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link href="/contact" className="flex-1">
                            <Button variant="outline" className="w-full">
                                Email Support
                            </Button>
                        </Link>
                        <Link href="/blog" className="flex-1">
                            <Button className="w-full">Community Forum</Button>
                        </Link>
                    </div>
                </div>
            </Card>
        </section>
    );
};

export default FAQSection;
