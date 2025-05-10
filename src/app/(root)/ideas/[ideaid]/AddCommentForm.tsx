"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createComment } from "@/components/actions/comments";
import { toast } from "sonner";

export function AddCommentForm({ ideaId }: { ideaId: string }) {
    const handleSubmit = async (formData: FormData) => {
        const content = formData.get("content") as string;
        try {
            await createComment(ideaId, content);
            toast.success("Comment posted successfully");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to post comment");
        }
    };

    return (
        <form action={handleSubmit} className="space-y-2">
            <Input name="content" placeholder="Add a comment..." className="flex-1" required minLength={3} maxLength={500} />
            <Button type="submit">Post Comment</Button>
        </form>
    );
}
