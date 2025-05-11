import { notFound } from "next/navigation";
import Image from "next/image";
import { getBlogData } from "@/components/actions/blogs";
import Link from "next/link";

export async function generateStaticParams() {
    const { posts } = await getBlogData();
    return posts.map((post) => ({
        blogId: post.id,
    }));
}

type Params = Promise<{ blogId: string }>;

export default async function BlogPostPage({ params }: { params: Params }) {
    const { posts } = await getBlogData();

    const { blogId } = await params;

    const post = posts.find((post) => post.id === blogId);

    if (!post) {
        return notFound();
    }

    return (
        <article className="max-w-4xl mx-auto py-8 px-4">
            {/* Header Section */}
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

                <div className="flex items-center gap-4 mb-6">
                    <Image src={post.author.avatar} alt={post.author.name} width={48} height={48} className="rounded-full" />
                    <div>
                        <p className="font-medium">{post.author.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(post.publishedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}{" "}
                            · {post.readingTime}
                        </p>
                    </div>
                </div>

                <div className="relative h-96 w-full rounded-lg overflow-hidden mb-6">
                    <Image src={post.coverImage.url} alt={post.coverImage.alt} fill className="object-cover" priority />
                </div>
            </header>

            {/* Content Section */}
            <section className="prose prose-lg dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </section>

            {/* Footer Section */}
            <footer className="mt-12 pt-6 border-t">
                <div className="flex flex-wrap gap-2 mb-6">
                    {post.tags.map((tag) => (
                        <span key={tag} className="bg-secondary px-3 py-1 rounded-full text-sm">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                            <EyeIcon className="w-4 h-4" />
                            {post.stats.views.toLocaleString()} views
                        </span>
                        <span className="flex items-center gap-1">
                            <HeartIcon className="w-4 h-4" />
                            {post.stats.likes.toLocaleString()} likes
                        </span>
                    </div>
                    <Link href="/blog" className="text-sm font-medium hover:underline">
                        ← Back to all posts
                    </Link>
                </div>
            </footer>
        </article>
    );
}

// Simple icon components (replace with your actual icons)
function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function HeartIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}
