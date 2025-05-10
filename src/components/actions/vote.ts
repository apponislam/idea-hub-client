"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export const submitVote = async (ideaId: string, voteType: "UPVOTE" | "DOWNVOTE") => {
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
