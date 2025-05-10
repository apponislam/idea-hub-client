import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

const fetchIdeas = async (search?: string, category?: string): Promise<IdeasResponse> => {
    const url = new URL("http://localhost:5000/api/v1/idea");

    if (search) {
        url.searchParams.append("search", search);
    }

    if (category && category !== "all") {
        url.searchParams.append("category", category);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
        throw new Error("Failed to fetch ideas");
    }
    return res.json();
};

const IdeaPage = async ({
    searchParams,
}: {
    searchParams?: {
        search?: string;
        category?: string;
    };
}) => {
    const searchTerm = searchParams?.search || "";
    const selectedCategory = searchParams?.category || "all";

    let ideasData: IdeasResponse;
    try {
        ideasData = await fetchIdeas(searchTerm, selectedCategory);
    } catch (error) {
        return <div className="container mx-auto px-4 py-8">Error loading ideas: {(error as Error).message}</div>;
    }

    const ideas = ideasData.data;
    const allCategories = ideas.flatMap((idea) => idea.categories.map((cat) => cat.category.name));
    const uniqueCategories = Array.from(new Set(allCategories));

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Browse Ideas</h1>

            {/* Search and Filter Form */}
            <form className="mb-8 flex flex-col md:flex-row gap-4" action="/ideas" method="GET">
                <Input placeholder="Search by keyword..." className="flex-1" name="search" defaultValue={searchTerm} />
                <Select name="category" defaultValue={selectedCategory}>
                    <SelectTrigger className="w-[180px]">
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
        </div>
    );
};

export default IdeaPage;
