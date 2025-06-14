import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cookies } from "next/headers";
import { Pagination } from "@/components/pagination";

interface Idea {
    id: string;
    title: string;
    status: string;
    createdAt: string;
    description: string;
    isPaid: boolean;
    price: number | null;
}

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function MyIdeasPage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams;

    const page = Number(params.page ?? 1);
    const limit = Number(params.limit ?? 10);

    // const page = Number(searchParams.page) || 1;
    // const limit = Number(searchParams.limit) || 10;
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    let ideas: Idea[] = [];
    let meta = { page, limit, total: 0 };

    if (sessionToken) {
        try {
            const res = await fetch(`https://idea-hub-server.vercel.app/api/v1/idea/my-ideas?page=${page}&limit=${limit}`, {
                headers: {
                    Cookie: `next-auth.session-token=${sessionToken}`,
                },
                cache: "no-store",
            });

            if (res.ok) {
                const data = await res.json();
                ideas = data.data;
                meta = data.meta;
            }
        } catch (error) {
            console.error("Error fetching ideas:", error);
        }
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Ideas</h1>
                <Link href="/dashboard/myidea/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New Idea
                    </Button>
                </Link>
            </div>

            {ideas.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {ideas.map((idea) => (
                            <div key={idea.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium">{idea.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{idea.description}</p>
                                        <div className="flex gap-4 text-sm">
                                            <span>Status: {idea.status}</span>
                                            <span>Created: {new Date(idea.createdAt).toLocaleDateString()}</span>
                                            {idea.isPaid && <span>Price: ${idea.price?.toFixed(2)}</span>}
                                        </div>
                                    </div>
                                    <Link href={`/dashboard/myidea/${idea.id}`}>
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination meta={meta} />
                </>
            ) : (
                <div className="bg-muted rounded-lg p-8 text-center">
                    <p className="text-muted-foreground mb-4">You haven&apos;t created any ideas yet</p>
                    <Link href="/dashboard/myidea/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Your First Idea
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
