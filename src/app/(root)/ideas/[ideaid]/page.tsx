import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { ImageCarousel } from "@/components/ImageCarouselSingleIdea";
import { VoteButtons } from "@/components/VoteButtons";
import { getCurrentVote } from "@/components/actions/vote";
import CommentItem from "./commnetItem";
import { AddCommentForm } from "./AddCommentForm";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { verifyPurchaseAndRedirect } from "@/components/actions/payment";

// Shared interfaces - should match exactly with commentItem.tsx
interface User {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role?: string;
}

interface Category {
    id: string;
    name: string;
    createdAt: string;
}

interface IdeaCategory {
    ideaId: string;
    categoryId: string;
    createdAt: string;
    category: Category;
}

interface Vote {
    id: string;
    userId: string;
    type: "UPVOTE" | "DOWNVOTE";
    createdAt: string;
}

interface Comment {
    id: string;
    content: string;
    userId: string;
    ideaId: string;
    parentCommentId: string | null;
    createdAt: string;
    updatedAt: string;
    user: User;
    replies?: Comment[]; // Made optional to match both files
}

interface Idea {
    id: string;
    title: string;
    problemStatement: string;
    proposedSolution: string;
    description: string;
    images: string[];
    status: string;
    isPaid: boolean;
    price: number | null;
    creator: User;
    categories: IdeaCategory[];
    votes: Vote[];
    comments: Comment[];
    rejectionFeedback: string | null;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    _count: {
        votes: number;
        comments: number;
    };
    upvotes: number;
    downvotes: number;
    commentCount?: number;
}

interface ApiResponse {
    success: boolean;
    message: string;
    data: Idea;
}

const fetchIdea = async (id: string): Promise<ApiResponse> => {
    const res = await fetch(`http://localhost:5000/api/v1/idea/public/${id}`, {
        next: { tags: [`idea-${id}`], revalidate: 1 },
    });
    if (!res.ok) throw new Error("Failed to fetch idea");
    return res.json();
};

const IdeaPage = async ({ params }: { params: { ideaid: string } }) => {
    let response: ApiResponse;
    try {
        response = await fetchIdea(params.ideaid);
    } catch (error) {
        return <div className="container mx-auto p-4">Error loading idea: {(error as Error).message}</div>;
    }

    const idea = response.data;

    const session = await getServerSession(authOptions);
    const user = session?.user;
    console.log(user);

    if (idea.isPaid) {
        if (!user) {
            redirect("/login");
        }
        const hasPurchased = await verifyPurchaseAndRedirect(idea.id);
        if (!hasPurchased) {
            redirect(`/ideas/${idea.id}/payfirst`);
        }
    }

    const comments = idea.comments || [];
    const commentMap = new Map<string, Comment>();
    const topLevelComments: Comment[] = [];

    comments.forEach((comment) => {
        const replies = "replies" in comment ? comment.replies : [];
        commentMap.set(comment.id, { ...comment, replies: replies || [] });
    });

    // Second pass: build hierarchy
    comments.forEach((comment) => {
        if (comment.parentCommentId) {
            const parent = commentMap.get(comment.parentCommentId);
            if (parent && parent.replies) {
                parent.replies.push(commentMap.get(comment.id)!);
            }
        } else {
            topLevelComments.push(commentMap.get(comment.id)!);
        }
    });

    const currentVote = await getCurrentVote(params.ideaid);

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Idea Header */}
            <div className="mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{idea.title}</h1>
                        <div className="flex items-center gap-2 mb-4">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={idea.creator.image || undefined} />
                                <AvatarFallback>{idea.creator.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-muted-foreground">Posted by {idea.creator.name}</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <span className={`px-3 py-1 rounded-md text-sm ${idea.status === "APPROVED" ? "bg-green-100 text-green-800" : idea.status === "REJECTED" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>{idea.status.replace("_", " ")}</span>
                        {idea.isPaid && <span className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-sm">${idea.price?.toFixed(2)}</span>}
                    </div>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {idea.categories.map(({ category }) => (
                        <span key={category.id} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                            {category.name}
                        </span>
                    ))}
                </div>
            </div>

            {/* Problem & Solution Sections */}
            <div className="space-y-6 mb-8">
                <div className="relative">
                    <ImageCarousel images={idea.images} />
                    {idea.isPaid && <div className="absolute top-2 right-2 bg-primary text-white px-2 py-1 rounded-md text-sm z-10">Premium</div>}
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-3">Problem Statement</h2>
                    <p className="whitespace-pre-line">{idea.problemStatement}</p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-3">Proposed Solution</h2>
                    <p className="whitespace-pre-line">{idea.proposedSolution}</p>
                </div>

                {idea.description && (
                    <div className="bg-white dark:bg-gray-900 rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-3">Additional Details</h2>
                        <p className="whitespace-pre-line">{idea.description}</p>
                    </div>
                )}
            </div>

            <VoteButtons ideaId={idea.id} initialUpvotes={idea.upvotes} initialDownvotes={idea.downvotes} initialUserVote={currentVote?.data?.type || null} />

            {/* Comments Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    {/* Comments ({idea._count.comments}) */}
                    Comments ({idea.commentCount})
                </h2>

                {/* Add Comment Form */}
                <div className="mb-6">
                    <div className="mb-6">
                        <AddCommentForm ideaId={idea.id} />
                    </div>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                    {topLevelComments.length > 0 ? (
                        topLevelComments.map((comment) => (
                            <CommentItem
                                key={comment.id}
                                comment={comment}
                                ideaId={idea.id}
                                currentUser={{
                                    id: session?.user.id,
                                    role: session?.user.role,
                                }}
                            />
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default IdeaPage;
