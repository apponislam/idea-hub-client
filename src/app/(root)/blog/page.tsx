import { BlogPost } from "@/app/types/blogs";
import { getBlogData } from "@/components/actions/blogs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

export default async function BlogPage() {
    const { posts } = await getBlogData();

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Latest Blog Posts</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
}

function BlogCard({ post }: { post: BlogPost }) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <div className="relative h-48">
                <Image src={post.coverImage.url} alt={post.coverImage.alt} fill className="object-cover rounded-t-lg" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </div>
            <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                    <Image src={post.author.avatar} alt={post.author.name} width={32} height={32} className="rounded-full" />
                    <span className="text-sm">{post.author.name}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                        <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                            {tag}
                        </span>
                    ))}
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    <span>{post.readingTime} read</span>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="flex space-x-4 text-sm">
                    <span>👁 {post.stats.views.toLocaleString()}</span>
                    <span>❤️ {post.stats.likes.toLocaleString()}</span>
                    <span>💬 {post.stats.comments.toLocaleString()}</span>
                </div>
                <Link href={`/blog/${post.id}`} className="text-sm font-medium hover:underline">
                    Read more →
                </Link>
            </CardFooter>
        </Card>
    );
}
