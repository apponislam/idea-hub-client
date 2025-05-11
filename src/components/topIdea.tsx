"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImageCarousel } from "@/components/ImageCarousel";

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

const IdeaPage2 = () => {
    const [ideasData, setIdeasData] = useState<IdeasResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [topVotedIdeas, setTopVotedIdeas] = useState<Idea[]>([]);

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                setLoading(true);
                const res = await fetch("https://idea-hub-server.vercel.app/api/v1/idea");
                if (!res.ok) {
                    throw new Error("Failed to fetch ideas");
                }
                const data = await res.json();
                setIdeasData(data);

                // Sort ideas by vote count (descending) and take top 3
                const sortedIdeas = [...data.data].sort((a, b) => b._count.votes - a._count.votes).slice(0, 3);
                setTopVotedIdeas(sortedIdeas);
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
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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

    if (!ideasData || topVotedIdeas.length === 0) {
        return <div className="container mx-auto px-4 py-8">No top voted ideas available</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Top Voted Ideas</h1>

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topVotedIdeas.map((idea) => (
                    <Card key={idea.id} className="flex flex-col h-full p-0">
                        {/* Image */}
                        <div className="relative">
                            <ImageCarousel images={idea.images} />
                            {idea.isPaid && <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-sm z-10">Premium</div>}
                        </div>

                        {/* Content */}
                        <div className="p-4 flex flex-col flex-1">
                            <CardHeader className="p-0">
                                <div className="flex justify-between items-start">
                                    <CardTitle>{idea.title}</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-sm">{idea._count.votes} votes</span>
                                        {idea.isPaid && idea.price && <span className="bg-green-500 text-white px-2 py-1 rounded text-sm">${idea.price}</span>}
                                    </div>
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
                                <CardDescription className="line-clamp-3">{idea.description}</CardDescription>
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
        </div>
    );
};

export default IdeaPage2;
