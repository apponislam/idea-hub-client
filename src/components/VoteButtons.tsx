"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { submitVote } from "./actions/vote";

interface VoteButtonsProps {
    ideaId: string;
    initialUpvotes: number;
    initialDownvotes: number;
}

export const VoteButtons = ({ ideaId, initialUpvotes, initialDownvotes }: VoteButtonsProps) => {
    const router = useRouter();
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);
    const [isLoading, setIsLoading] = useState(false);

    const handleVote = async (voteType: "UPVOTE" | "DOWNVOTE") => {
        setIsLoading(true);
        const toastId = toast.loading("Processing your vote...");

        try {
            const result = await submitVote(ideaId, voteType);

            // Optimistically update UI
            if (result.data.action === "removed") {
                if (voteType === "UPVOTE") setUpvotes((prev) => prev - 1);
                if (voteType === "DOWNVOTE") setDownvotes((prev) => prev - 1);
            } else if (result.data.action === "updated") {
                if (voteType === "UPVOTE") {
                    setUpvotes((prev) => prev + 1);
                    setDownvotes((prev) => prev - 1);
                } else {
                    setUpvotes((prev) => prev - 1);
                    setDownvotes((prev) => prev + 1);
                }
            } else if (result.data.action === "created") {
                if (voteType === "UPVOTE") setUpvotes((prev) => prev + 1);
                else setDownvotes((prev) => prev + 1);
            }

            toast.success(`Vote ${result.data.action} successfully`, { id: toastId });

            // Refresh the page data without full reload
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to submit vote", { id: toastId });
            // Revert on error
            setUpvotes(initialUpvotes);
            setDownvotes(initialDownvotes);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-4 mb-8">
            <Button variant={upvotes > initialUpvotes ? "default" : "outline"} className="flex items-center gap-2" onClick={() => handleVote("UPVOTE")} disabled={isLoading}>
                <ArrowBigUp className="h-4 w-4" />
                <span>{upvotes}</span>
            </Button>

            <Button variant={downvotes > initialDownvotes ? "default" : "outline"} className="flex items-center gap-2" onClick={() => handleVote("DOWNVOTE")} disabled={isLoading}>
                <ArrowBigDown className="h-4 w-4" />
                <span>{downvotes}</span>
            </Button>
        </div>
    );
};
