import { PublicBlogCard } from "@/app/(root)/blog/PublicBlogCard";
import { BlogPost2 } from "@/app/types/blogs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPublicBlogs } from "./actions/blogActions";

export default async function HomeBlogPage() {
    const response = await getPublicBlogs(1, 6);

    // Ensure posts is always an array
    const posts = Array.isArray(response.data) ? response.data : [response.data];
    const displayedPosts = posts.slice(0, 6);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Latest Blog Posts</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedPosts.map((post: BlogPost2) => (
                    <PublicBlogCard key={post.id} post={post} />
                ))}
            </div>
            {posts.length > 6 && (
                <div className="mt-8 text-center">
                    <Link href="/blog">
                        <Button className="px-6 py-3">View More Posts</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
