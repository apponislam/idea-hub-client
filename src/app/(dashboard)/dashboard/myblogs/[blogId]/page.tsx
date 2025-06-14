import { getSingleBlog } from "@/components/actions/blogActions";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Params = Promise<{ blogId: string }>;

export default async function BlogDetailsPage({ params }: { params: Params }) {
    const { blogId } = await params;
    const blog = await getSingleBlog(blogId);

    if (!blog) {
        return notFound();
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <Link href="/dashboard/myblogs">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to All Blogs
                    </Button>
                </Link>

                <Link href={`/dashboard/myblogs/update/${blog.id}`}>
                    <Button>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Post
                    </Button>
                </Link>
            </div>

            <article className="space-y-8">
                {/* Author and Date */}
                <div className="flex items-center gap-4">
                    <Image src={blog.author.image} alt={blog.author.name} width={48} height={48} className="rounded-full" />
                    <div>
                        <p className="font-medium">{blog.author.name}</p>
                        <p className="text-sm text-muted-foreground">
                            Published on{" "}
                            {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    </div>
                </div>

                {/* Title and Excerpt */}
                <header className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">{blog.title}</h1>
                    <p className="text-xl text-muted-foreground">{blog.excerpt}</p>
                </header>

                {/* Cover Image */}
                <div className="relative aspect-[16/9] rounded-lg overflow-hidden border">
                    <Image src={blog.coverImage} alt={`Cover image for ${blog.title}`} fill className="object-cover" priority />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                    {blog.tags.map((tag) => (
                        <span key={tag} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Category */}
                <div>
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">{blog.category}</span>
                </div>

                {/* Content */}
                <div className="prose dark:prose-invert max-w-none">{blog.content}</div>

                {/* SEO Section */}
                <section className="border-t pt-6 mt-8">
                    <h2 className="text-xl font-semibold mb-4">SEO Information</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Meta Description</h3>
                            <p>{blog.seo.description}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Keywords</h3>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {blog.seo.keywords.map((keyword) => (
                                    <span key={keyword} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm">
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            </article>
        </div>
    );
}
