"use client";
import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageCarousel } from "@/components/ImageCarousel";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { useSearchParams } from "next/navigation";

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
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
}

const IdeaPage = () => {
    const [ideasData, setIdeasData] = useState<IdeasResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const searchTerm = searchParams.get("search") || "";
    const selectedCategory = searchParams.get("category") || "all";
    const currentPage = Number(searchParams.get("page")) || 1;

    useEffect(() => {
        const fetchIdeas = async () => {
            try {
                setLoading(true);
                const url = new URL("https://idea-hub-server.vercel.app/api/v1/idea");

                if (searchTerm) {
                    url.searchParams.append("search", searchTerm);
                }

                if (selectedCategory && selectedCategory !== "all") {
                    url.searchParams.append("category", selectedCategory);
                }

                url.searchParams.append("page", currentPage.toString());
                url.searchParams.append("limit", "9");

                const res = await fetch(url.toString());
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
    }, [searchTerm, selectedCategory, currentPage]);

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

    if (!ideasData) {
        return <div className="container mx-auto px-4 py-8">No ideas data available</div>;
    }

    const ideas = ideasData.data;
    const allCategories = ideas.flatMap((idea) => idea.categories.map((cat) => cat.category.name));
    const uniqueCategories = Array.from(new Set(allCategories));
    const totalPages = ideasData.meta ? Math.ceil(ideasData.meta.total / ideasData.meta.limit) : 1;

    const buildQueryString = (params: Record<string, string>) => {
        const searchParams = new URLSearchParams();
        if (searchTerm) searchParams.set("search", searchTerm);
        if (selectedCategory !== "all") searchParams.set("category", selectedCategory);

        Object.entries(params).forEach(([key, value]) => {
            searchParams.set(key, value);
        });

        return searchParams.toString();
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Browse Ideas</h1>

            {/* Search and Filter Form */}
            <form className="mb-8 flex flex-col md:flex-row gap-4" action="/" method="GET">
                <Input placeholder="Search by keyword..." className="flex-1" name="search" defaultValue={searchTerm} />
                <Select name="category" defaultValue={selectedCategory}>
                    <SelectTrigger className="w-full md:w-52">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {uniqueCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                                {category}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <input type="hidden" name="page" value="1" />
                <Button type="submit">Search</Button>
            </form>

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea) => (
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

            {ideas.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">No ideas found. Try different search criteria.</p>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href={`/?${buildQueryString({ page: Math.max(1, currentPage - 1).toString() })}`} isActive={currentPage > 1} />
                            </PaginationItem>

                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum;
                                if (totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (currentPage >= totalPages - 2) {
                                    pageNum = totalPages - 4 + i;
                                } else {
                                    pageNum = currentPage - 2 + i;
                                }

                                return (
                                    <PaginationItem key={pageNum}>
                                        <PaginationLink href={`/?${buildQueryString({ page: pageNum.toString() })}`} isActive={pageNum === currentPage}>
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            })}

                            <PaginationItem>
                                <PaginationNext href={`/?${buildQueryString({ page: Math.min(totalPages, currentPage + 1).toString() })}`} isActive={currentPage < totalPages} />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
};

export default IdeaPage;
