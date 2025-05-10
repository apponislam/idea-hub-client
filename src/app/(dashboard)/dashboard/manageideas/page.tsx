"use client";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StatusDropdown } from "@/components/status-dropdown";
import { useCallback, useEffect, useState } from "react";
import { PaginationWrapper } from "./pagination-wrapper";

interface Idea {
    id: string;
    title: string;
    status: "UNDER_REVIEW" | "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    description: string;
    isPaid: boolean;
    price: number | null;
    creator: {
        name: string;
        email: string;
    };
}

interface Meta {
    page: number;
    limit: number;
    total: number;
}

export default function ManageIdeasPage() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // State for ideas and pagination
    const [ideas, setIdeas] = useState<Idea[]>([]);
    const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0 });
    const [isLoading, setIsLoading] = useState(true);

    // Get current filter values from URL
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const searchTerm = searchParams.get("search") || "";
    const category = searchParams.get("category") || "ALL";
    const status = searchParams.get("status") || "ALL";
    const isPaid = searchParams.get("isPaid") === "true";

    // Fetch ideas when filters change
    const fetchIdeas = useCallback(async () => {
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams();
            queryParams.set("page", page.toString());
            queryParams.set("limit", limit.toString());
            if (searchTerm) queryParams.set("search", searchTerm);
            if (category !== "ALL") queryParams.set("category", category);
            if (status !== "ALL") queryParams.set("status", status);
            if (isPaid) queryParams.set("isPaid", "true");

            const res = await fetch(`http://localhost:5000/api/v1/idea/adminideas?${queryParams.toString()}`, {
                next: { tags: ["adminideas"] },
            });
            const data = await res.json();
            console.log(data);
            setIdeas(data.data);
            setMeta(data.meta);
        } catch (error) {
            console.error("Error fetching ideas:", error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, searchTerm, category, status, isPaid]);

    useEffect(() => {
        fetchIdeas();
    }, [fetchIdeas]);

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const params = new URLSearchParams();

        // Set new filter values
        params.set("search", formData.get("search") as string);
        params.set("status", formData.get("status") as string);
        params.set("category", formData.get("category") as string);
        if (formData.get("isPaid")) params.set("isPaid", "true");

        // Reset to first page when filters change
        params.set("page", "1");
        params.set("limit", limit.toString());

        // Update URL
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleStatusUpdate = () => {
        fetchIdeas(); // Simply refetch the ideas
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Manage Ideas</h1>
                {/* <Link href="/dashboard/manageideas/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Idea
                    </Button>
                </Link> */}
            </div>

            <form onSubmit={handleSubmit} className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search ideas..." name="search" defaultValue={searchTerm} className="pl-8" />
                </div>

                <Select name="status" defaultValue={status}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Statuses</SelectItem>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="UNDER_REVIEW">Under Review</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                </Select>

                <Select name="category" defaultValue={category}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">All Categories</SelectItem>
                        <SelectItem value="TECH">Technology</SelectItem>
                        <SelectItem value="BUSINESS">Business</SelectItem>
                        <SelectItem value="DESIGN">Design</SelectItem>
                    </SelectContent>
                </Select>

                <Button type="submit" variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Apply Filters
                </Button>
            </form>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : ideas.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {ideas.map((idea) => (
                            <div key={idea.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-medium">{idea.title}</h3>
                                            {idea.isPaid && <Badge variant="secondary">${idea.price?.toFixed(2)}</Badge>}
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{idea.description}</p>
                                        <div className="flex gap-4 text-sm">
                                            <span>By: {idea.creator.name}</span>
                                            <span>Created: {new Date(idea.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link href={`/dashboard/manageideas/${idea.id}`}>
                                            <Button variant="outline" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                        <StatusDropdown ideaId={idea.id} currentStatus={idea.status} onStatusChange={handleStatusUpdate} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* <Pagination
                        meta={meta}
                        onPageChange={(newPage) => {
                            const params = new URLSearchParams(searchParams.toString());
                            params.set("page", newPage.toString());
                            router.push(`${pathname}?${params.toString()}`);
                        }}
                    /> */}
                    <PaginationWrapper meta={meta} />
                </>
            ) : (
                <div className="bg-muted rounded-lg p-8 text-center">
                    <p className="text-muted-foreground mb-4">No ideas found matching your filters</p>
                    <Button variant="outline" onClick={() => router.push("/dashboard/manageideas")}>
                        Clear Filters
                    </Button>
                </div>
            )}
        </div>
    );
}
