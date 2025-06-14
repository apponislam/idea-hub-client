import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { getMyBlogs } from "@/components/actions/blogActions";
import { BlogCard } from "./MyBlogCards";
import { BlogApiResponse } from "@/app/types/blogs";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";

type SearchParams = Promise<{ page?: string }>;

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
    const { page } = await searchParams;
    const currentPage = parseInt(page || "1", 10);
    const response = (await getMyBlogs(currentPage)) as BlogApiResponse;
    const posts = Array.isArray(response.data) ? response.data : [response.data];
    const meta = response.meta;

    return (
        <div className="p-4 container mx-auto">
            <Link href="/dashboard/myblogs/create">
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Blog Post
                </Button>
            </Link>

            <div className="py-8">
                <h1 className="text-3xl font-bold mb-8">My Blog Posts</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>

                {meta.total > meta.limit && (
                    <div className="mt-8">
                        <Pagination>
                            <PaginationContent>
                                {/* Previous Button */}
                                <PaginationItem>
                                    {currentPage > 1 ? (
                                        <Link href={`?page=${currentPage - 1}`}>
                                            <Button variant="outline" size="sm">
                                                <ChevronLeft className="h-4 w-4 mr-1" />
                                                Previous
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button variant="outline" size="sm" disabled>
                                            <ChevronLeft className="h-4 w-4 mr-1" />
                                            Previous
                                        </Button>
                                    )}
                                </PaginationItem>

                                {/* Page Numbers */}
                                {Array.from({ length: Math.ceil(meta.total / meta.limit) }, (_, i) => i + 1).map((page) => (
                                    <PaginationItem key={page}>
                                        <Link href={`?page=${page}`}>
                                            <Button variant={page === currentPage ? "default" : "outline"} size="sm">
                                                {page}
                                            </Button>
                                        </Link>
                                    </PaginationItem>
                                ))}

                                {/* Next Button */}
                                <PaginationItem>
                                    {currentPage < Math.ceil(meta.total / meta.limit) ? (
                                        <Link href={`?page=${currentPage + 1}`}>
                                            <Button variant="outline" size="sm">
                                                Next
                                                <ChevronRight className="h-4 w-4 ml-1" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button variant="outline" size="sm" disabled>
                                            Next
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    )}
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
