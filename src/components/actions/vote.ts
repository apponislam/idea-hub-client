"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export type VoteType = "UPVOTE" | "DOWNVOTE";

export interface VoteResponse {
    data: {
        action: "created" | "updated" | "removed";
        type: VoteType;
        ideaId: string;
    };
}

export const submitVote = async (ideaId: string, voteType: VoteType): Promise<VoteResponse> => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    if (!sessionToken) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(`http://localhost:5000/api/v1/vote/${ideaId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        body: JSON.stringify({
            type: voteType,
        }),
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    revalidateTag(`idea-${ideaId}`);

    return await response.json();
};

export interface VoteResponse2 {
    success: boolean;
    message: string;
    data: {
        id: string;
        userId: string;
        ideaId: string;
        type: "UPVOTE" | "DOWNVOTE";
        createdAt: string;
    } | null;
}

export const getCurrentVote = async (ideaId: string): Promise<VoteResponse2> => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    if (!sessionToken) {
        return {
            success: false,
            message: "Not authenticated",
            data: null,
        };
    }

    const response = await fetch(`http://localhost:5000/api/v1/vote/${ideaId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        cache: "no-store",
    });

    if (!response.ok) {
        if (response.status === 404) {
            return {
                success: true,
                message: "No vote found",
                data: null,
            };
        }
        throw new Error(await response.text());
    }

    return await response.json();
};
