"use client";

import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createComment, deleteComment } from "@/components/actions/comments";
import { Reply, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface User {
    id: string;
    name: string;
    email: string;
    image: string | null;
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
    replies?: Comment[];
    isDeleted?: boolean;
}

interface CommentItemProps {
    comment: Comment;
    ideaId: string;
    depth?: number;
    currentUser?: {
        id?: string;
        role?: string;
    };
}

const CommentItem = ({ comment, ideaId, depth = 0, currentUser }: CommentItemProps) => {
    const [isReplying, setIsReplying] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const canDelete = currentUser && (currentUser.id === comment.userId || currentUser.role === "ADMIN");

    const handleReply = async (formData: FormData) => {
        setIsSubmitting(true);
        const content = formData.get("content") as string;
        const toastId = toast.loading("Posting your reply...");

        try {
            await createComment(ideaId, content, comment.id);
            toast.success("Reply posted successfully", { id: toastId });
            setIsReplying(false);
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to post reply", { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        const toastId = toast.loading("Deleting comment...");

        try {
            await deleteComment(comment.id, ideaId);
            toast.success("Comment deleted successfully", { id: toastId });
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete comment", { id: toastId });
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className={`flex gap-3 ${depth > 0 ? "mt-3" : "mt-4"}`}>
            <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage src={comment.user?.image || undefined} />
                <AvatarFallback>{comment.user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
                <div className="bg-muted/50 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                            <span className="font-medium">{comment.user?.name || "Unknown"}</span>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.createdAt), {
                                    addSuffix: true,
                                })}
                            </span>
                        </div>
                        {depth === 0 && comment.replies?.length && <span className="text-xs text-muted-foreground">{comment.replies.length} replies</span>}
                    </div>

                    <p className="mb-3 whitespace-pre-line">{comment.content}</p>

                    <div className="flex justify-end">
                        <Button variant="ghost" size="sm" onClick={() => setIsReplying(!isReplying)} className="text-sm text-muted-foreground">
                            <Reply className="h-4 w-4 mr-2" />
                            Reply
                        </Button>
                        {canDelete && (
                            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-sm text-muted-foreground hover:text-destructive" disabled={isDeleting}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                {isDeleting ? "Deleting..." : "Delete"}
                            </Button>
                        )}
                    </div>
                </div>

                {isReplying && (
                    <form action={handleReply} className="mt-3 flex gap-2">
                        <Input name="content" placeholder="Write a reply..." className="flex-1" required minLength={3} maxLength={500} disabled={isSubmitting} />
                        <Button type="submit" size="sm" disabled={isSubmitting}>
                            {isSubmitting ? "Posting..." : "Post"}
                        </Button>
                    </form>
                )}

                {/* Nested Replies */}
                {comment.replies && comment.replies.length > 0 && (
                    <div className={`mt-3 ${depth > 0 ? "pl-4 border-l-2 border-muted" : ""}`}>
                        {comment.replies.map((reply) => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                ideaId={ideaId}
                                depth={depth + 1}
                                currentUser={{
                                    id: currentUser?.id,
                                    role: currentUser?.role,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentItem;
