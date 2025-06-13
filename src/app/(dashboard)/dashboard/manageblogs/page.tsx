import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming you're using shadcn/ui
import { Plus } from "lucide-react";
import { getMyBlogs } from "@/components/actions/blogActions";
import { BlogCard } from "./MyBlogCards";
import { BlogApiResponse, BlogPost2 } from "@/app/types/blogs";

const Page = async () => {
    const { data: posts } = (await getMyBlogs()) as BlogApiResponse;

    return (
        <div className="p-4 container mx-auto">
            <Link href="/dashboard/manageblogs/create">
                <Button variant="default">
                    <Plus className="h-4 w-4" />
                    Create New Blog Post
                </Button>
            </Link>
            <div className="py-8">
                <h1 className="text-3xl font-bold mb-8">My Blog Posts</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(posts as BlogPost2[]).map((post) => (
                        <BlogCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page;
