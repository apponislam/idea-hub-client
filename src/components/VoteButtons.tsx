"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowBigUp, ArrowBigDown } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { submitVote, type VoteType } from "./actions/vote";

interface VoteButtonsProps {
    ideaId: string;
    initialUpvotes: number;
    initialDownvotes: number;
    initialUserVote?: VoteType | null;
}

export const VoteButtons = ({ ideaId, initialUpvotes, initialDownvotes, initialUserVote = null }: VoteButtonsProps) => {
    const router = useRouter();
    const [upvotes, setUpvotes] = useState(initialUpvotes);
    const [downvotes, setDownvotes] = useState(initialDownvotes);
    const [isLoading, setIsLoading] = useState(false);
    const [userVote, setUserVote] = useState<VoteType | null>(initialUserVote);

    // Optional: Fetch current vote on client side if not provided as prop
    // useEffect(() => {
    //     const fetchCurrentVote = async () => {
    //         try {
    //             const vote = await getCurrentVote(ideaId);
    //             console.log(vote);
    //             setUserVote(vote?.type || null);
    //         } catch (error) {
    //             console.error("Failed to fetch current vote:", error);
    //         }
    //     };

    //     if (initialUserVote === undefined) {
    //         fetchCurrentVote();
    //     }
    // }, [ideaId, initialUserVote]);

    const handleVote = async (voteType: VoteType) => {
        setIsLoading(true);
        const toastId = toast.loading("Processing your vote...");

        try {
            const result = await submitVote(ideaId, voteType);

            // Update UI based on the action
            switch (result.data.action) {
                case "removed":
                    if (userVote === "UPVOTE") setUpvotes((prev) => prev - 1);
                    if (userVote === "DOWNVOTE") setDownvotes((prev) => prev - 1);
                    setUserVote(null);
                    break;
                case "updated":
                    if (voteType === "UPVOTE") {
                        setUpvotes((prev) => prev + 1);
                        setDownvotes((prev) => prev - 1);
                    } else {
                        setUpvotes((prev) => prev - 1);
                        setDownvotes((prev) => prev + 1);
                    }
                    setUserVote(voteType);
                    break;
                case "created":
                    if (voteType === "UPVOTE") setUpvotes((prev) => prev + 1);
                    else setDownvotes((prev) => prev + 1);
                    setUserVote(voteType);
                    break;
            }

            toast.success(`Vote ${result.data.action} successfully`, { id: toastId });
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to submit vote", { id: toastId });
            // Revert on error
            setUpvotes(initialUpvotes);
            setDownvotes(initialDownvotes);
            setUserVote(initialUserVote || null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center gap-4 mb-8">
            <Button variant={userVote === "UPVOTE" ? "default" : "outline"} className={`flex items-center gap-2 ${userVote === "UPVOTE" ? "bg-blue-500 hover:bg-blue-600" : ""}`} onClick={() => handleVote("UPVOTE")} disabled={isLoading}>
                <ArrowBigUp className="h-4 w-4" />
                <span>{upvotes}</span>
            </Button>

            <Button variant={userVote === "DOWNVOTE" ? "default" : "outline"} className={`flex items-center gap-2 ${userVote === "DOWNVOTE" ? "bg-red-500 hover:bg-red-600" : ""}`} onClick={() => handleVote("DOWNVOTE")} disabled={isLoading}>
                <ArrowBigDown className="h-4 w-4" />
                <span>{downvotes}</span>
            </Button>
        </div>
    );
};
