"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { BlogPost2 } from "@/app/types/blogs";
import { Button } from "@/components/ui/button";

export function PublicBlogCard({ post }: { post: BlogPost2 }) {
    return (
        <Card className="hover:shadow-lg transition-shadow duration-200 pt-0">
            {/* Cover Image */}
            <div className="relative h-48 w-full">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover rounded-t-lg" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </div>

            {/* Card Header */}
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <Image src={post.author.image} alt={post.author.name} width={32} height={32} className="rounded-full" />
                    <span className="text-sm">{post.author.name}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
            </CardHeader>

            {/* Card Content */}
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
                    <span>{Math.ceil(post.content.length / 1000)} min read</span>
                </div>
            </CardContent>

            {/* Card Footer */}
            <CardFooter className="flex justify-between">
                <div className="flex gap-4 text-sm">
                    <span>👁 {post.views.toLocaleString()}</span>
                </div>

                <Link href={`/blog/${post.id}`} passHref>
                    <Button variant="ghost" size="sm">
                        Read more →
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
