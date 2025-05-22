"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageCarousel } from "@/components/ImageCarousel";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";

interface Category {
    id: string;
    name: string;
    createdAt: string;
}

interface Idea {
    id: string;
    title: string;
    description: string;
    images: string[];
    status: string;
    isPaid: boolean;
    price: number | null;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
    categories: {
        category: Category;
    }[];
    creator: {
        id: string;
        name: string;
        email: string;
    };
    _count: {
        votes: number;
        comments: number;
    };
}

interface IdeasResponse {
    success: boolean;
    message: string;
    data: Idea[];
}

const IdeaPage = () => {
    const [ideasData, setIdeasData] = useState<IdeasResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                setLoading(true);
                const res = await fetch("https://idea-hub-server.vercel.app/api/v1/idea?limit=6");
                if (!res.ok) {
                    throw new Error("Failed to fetch ideas");
                }
                const data = await res.json();
                setIdeasData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchIdeas();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Featured Ideas</h1>

                {/* Skeleton Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, index) => (
                        <Card key={index} className="flex flex-col h-full p-0">
                            {/* Image Skeleton */}
                            <div className="relative aspect-video">
                                <Skeleton className="h-full w-full rounded-t-lg" />
                            </div>

                            {/* Content Skeleton */}
                            <div className="p-4 flex flex-col flex-1">
                                <CardHeader className="p-0">
                                    <div className="flex justify-between items-start">
                                        <Skeleton className="h-6 w-3/4" />
                                        <Skeleton className="h-6 w-10" />
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-16" />
                                    </div>
                                </CardHeader>

                                <CardContent className="p-0 mt-4 flex-1 space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <Skeleton className="h-4 w-4/6" />
                                </CardContent>

                                <CardFooter className="mt-4 flex justify-between items-center p-0 pt-4 border-t border-muted-foreground/10">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-9 w-24" />
                                </CardFooter>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Skeleton View All Button */}
                <div className="mt-8 flex justify-center">
                    <Skeleton className="h-10 w-32" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-red-500 text-center">Error loading ideas: {error}</div>
                <div className="flex justify-center mt-4">
                    <Button onClick={() => window.location.reload()}>Try Again</Button>
                </div>
            </div>
        );
    }

    if (!ideasData) {
        return <div className="container mx-auto px-4 py-8">No ideas data available</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Featured Ideas</h1>

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideasData.data.map((idea) => (
                    <Card key={idea.id} className="flex flex-col h-full p-0">
                        {/* Image */}
                        <div className="relative">
                            <ImageCarousel images={idea.images} />
                            {idea.isPaid && <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-sm z-10 dark:bg-black">Premium</div>}
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1">
                            <CardHeader className="p-0">
                                <div className="flex justify-between items-start">
                                    <CardTitle>{idea.title}</CardTitle>
                                    {idea.isPaid && <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">${idea.price}</span>}
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {idea.categories.map((cat) => (
                                        <span key={cat.category.id} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                                            {cat.category.name}
                                        </span>
                                    ))}
                                </div>
                            </CardHeader>

                            <CardContent className="p-0 mt-4 flex-1">
                                <CardDescription className="line-clamp-3">
                                    {idea.isPaid ? (
                                        <>
                                            <span className="font-medium">Premium Idea Preview:</span> {idea.description.substring(0, 100)}...
                                        </>
                                    ) : (
                                        idea.description
                                    )}
                                </CardDescription>
                            </CardContent>

                            <CardFooter className="mt-4 flex justify-between items-center p-0 pt-4 border-t border-muted-foreground/10">
                                <span className="text-sm text-muted-foreground">By {idea.creator.name}</span>

                                <Button asChild>
                                    <a href={`/ideas/${idea.id}`}>View Details</a>
                                </Button>
                            </CardFooter>
                        </div>
                    </Card>
                ))}
            </div>

            {ideasData.data.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No ideas found.</p>
                </div>
            )}

            {/* View All Button */}
            <div className="mt-8 flex justify-center">
                <Button asChild>
                    <Link href="/ideas">View All Ideas</Link>
                </Button>
            </div>
        </div>
    );
};

export default IdeaPage;
