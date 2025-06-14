import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
// import { Eye } from "lucide-react";
import { getSinglePublicBlog } from "@/components/actions/blogActions";
import { ViewCounter } from "../ViewCounter";

interface BlogPost {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    coverImage: string;
    category: string;
    tags: string[];
    publishedAt: string;
    updatedAt: string;
    views: number;
    isDeleted: boolean;
    seo: {
        keywords: string[];
        description: string;
    };
    authorId: string;
    createdAt: string;
    author: {
        id: string;
        name: string;
        email: string;
        image: string;
    };
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: BlogPost;
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Params = Promise<{ blogId: string }>;

export default async function BlogPostPage({ params }: { params: Params }) {
    const { blogId } = await params;

    const response = (await getSinglePublicBlog(blogId)) as ApiResponse;

    if (!response.success || !response.data) {
        return notFound();
    }

    const post = response.data;

    return (
        <article className="max-w-4xl mx-auto py-8 px-4">
            {/* Header Section */}
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

                {/* Author Info */}
                <div className="flex items-center gap-4 mb-6">
                    <Image src={post.author.image} alt={post.author.name} width={48} height={48} className="rounded-full" priority />
                    <div>
                        <p className="font-medium">{post.author.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                            <span className="mx-2">•</span>
                            {Math.ceil(post.content.length / 1000)} min read
                        </p>
                    </div>
                </div>

                {/* Cover Image */}
                <div className="relative h-96 w-full rounded-lg overflow-hidden mb-6">
                    <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
                </div>
            </header>

            {/* Content Section */}
            <section className="prose prose-lg dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />

            {/* Footer Section */}
            <footer className="mt-12 pt-6 border-t">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag, index) => (
                        <span key={index} className="bg-secondary px-3 py-1 rounded-full text-sm">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Views and Back Link */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* <span className="flex items-center gap-1 text-sm">
                            <Eye className="w-4 h-4" />
                            {post.views.toLocaleString()} views
                        </span> */}
                        <ViewCounter initialViews={post.views} />
                    </div>
                    <Link href="/blog" className="text-sm font-medium hover:underline flex items-center gap-1">
                        <span>←</span> Back to all posts
                    </Link>
                </div>
            </footer>
        </article>
    );
}
