import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { ImageCarousel } from "@/components/ImageCarouselSingleIdea";
import { VoteButtons } from "@/components/VoteButtons";

interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
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
    replies: Comment[];
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

    // Safely process comments
    const comments = idea.comments || [];
    const topLevelComments = comments.filter((comment) => !comment.parentCommentId);
    const commentReplies = comments
        .filter((comment) => comment.parentCommentId)
        .reduce((acc, comment) => {
            const parentId = comment.parentCommentId!;
            acc[parentId] = acc[parentId] || [];
            acc[parentId].push(comment);
            return acc;
        }, {} as Record<string, Comment[]>);

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

            {/* Voting */}
            {/* <div className="flex items-center gap-4 mb-8">
                <form action={`/api/ideas/${idea.id}/vote`} method="POST">
                    <input type="hidden" name="voteType" value="UPVOTE" />
                    <Button variant="outline" className="flex items-center gap-2" type="submit">
                        <ArrowBigUp className="h-4 w-4" />
                        <span>{idea.upvotes}</span>
                    </Button>
                </form>

                <form action={`/api/ideas/${idea.id}/vote`} method="POST">
                    <input type="hidden" name="voteType" value="DOWNVOTE" />
                    <Button variant="outline" className="flex items-center gap-2" type="submit">
                        <ArrowBigDown className="h-4 w-4" />
                        <span>{idea.downvotes}</span>
                    </Button>
                </form>
            </div> */}

            {/* <VoteButtons ideaId={idea.id} initialUpvotes={idea.upvotes} initialDownvotes={idea.downvotes} refetchIdea={fetchIdea} /> */}
            <VoteButtons ideaId={idea.id} initialUpvotes={idea.upvotes} initialDownvotes={idea.downvotes} />

            {/* Comments Section */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Comments ({idea._count.comments})
                </h2>

                {/* Add Comment */}
                <div className="mb-6">
                    <form action={`/api/ideas/${idea.id}/comment`} method="POST" className="space-y-2">
                        <Input name="content" placeholder="Add a comment..." className="flex-1" required />
                        <Button type="submit">Post Comment</Button>
                    </form>
                </div>

                {/* Comments List */}
                <div className="space-y-6">
                    {topLevelComments.map((comment) => (
                        <CommentItem key={comment.id} comment={comment} replies={commentReplies[comment.id] || []} ideaId={idea.id} />
                    ))}

                    {topLevelComments.length === 0 && <p className="text-muted-foreground text-center py-4">No comments yet. Be the first to comment!</p>}
                </div>
            </div>
        </div>
    );
};

const CommentItem = ({ comment, replies, ideaId }: { comment: Comment; replies: Comment[]; ideaId: string }) => {
    return (
        <div className="flex gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={comment.user.image || undefined} />
                <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{comment.user.name}</span>
                            <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
                        </div>
                    </div>

                    <p className="mb-3 whitespace-pre-line">{comment.content}</p>

                    <form action={`/api/ideas/${ideaId}/comment`} method="POST" className="mt-2 flex gap-2">
                        <input type="hidden" name="parentCommentId" value={comment.id} />
                        <Input name="content" placeholder="Write a reply..." className="flex-1" required />
                        <Button variant="outline" size="sm" type="submit">
                            Reply
                        </Button>
                    </form>
                </div>

                {/* Replies */}
                {replies.length > 0 && (
                    <div className="mt-4 pl-6 border-l-2 border-muted">
                        {replies.map((reply) => (
                            <CommentItem key={reply.id} comment={reply} replies={[]} ideaId={ideaId} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default IdeaPage;
