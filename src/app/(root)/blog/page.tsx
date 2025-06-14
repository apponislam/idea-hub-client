import { getPublicBlogs } from "@/components/actions/blogActions";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PublicBlogCard } from "./PublicBlogCard";
import Link from "next/link";
import { BlogApiResponse } from "@/app/types/blogs";

type SearchParams = Promise<{ page?: string }>;

export default async function BlogPage({ searchParams }: { searchParams: SearchParams }) {
    const { page } = await searchParams;
    const currentPage = parseInt(page || "1", 10);
    const response = (await getPublicBlogs(currentPage)) as BlogApiResponse;
    const posts = Array.isArray(response.data) ? response.data : [response.data];
    const meta = response.meta;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-12">
                <h1 className="text-3xl font-bold mb-2">Latest Blog Posts</h1>
                <p className="text-muted-foreground">Discover our latest articles and insights</p>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-xl font-medium mb-2">No posts found</h3>
                    <p className="text-muted-foreground">Check back later for new articles</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        {posts.map((post) => (
                            <PublicBlogCard key={post.id} post={post} />
                        ))}
                    </div>

                    {/* Pagination - Only show if there are multiple pages */}
                    {meta.total > meta.limit && (
                        <div className="flex justify-center mt-8">
                            <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                {currentPage > 1 ? (
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/blog?page=${currentPage - 1}`}>
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Previous
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" disabled>
                                        <ChevronLeft className="h-4 w-4 mr-1" />
                                        Previous
                                    </Button>
                                )}

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: Math.min(5, Math.ceil(meta.total / meta.limit)) }, (_, i) => {
                                        const page = i + 1;
                                        return (
                                            <Button key={page} asChild variant={page === currentPage ? "default" : "outline"} size="sm">
                                                <Link href={`/blog?page=${page}`}>{page}</Link>
                                            </Button>
                                        );
                                    })}
                                </div>

                                {/* Next Button */}
                                {currentPage < Math.ceil(meta.total / meta.limit) ? (
                                    <Button asChild variant="outline" size="sm">
                                        <Link href={`/blog?page=${currentPage + 1}`}>
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="sm" disabled>
                                        Next
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
