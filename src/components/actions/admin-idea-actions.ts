"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function getAdminIdeas(filters: { page?: number; limit?: number; searchTerm?: string; category?: string; status?: string; isPaid?: boolean }) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const queryParams = new URLSearchParams();
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.limit) queryParams.append("limit", filters.limit.toString());
    if (filters.searchTerm) queryParams.append("search", filters.searchTerm);
    if (filters.category) queryParams.append("category", filters.category);
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.isPaid !== undefined) queryParams.append("isPaid", filters.isPaid.toString());

    const res = await fetch(`https://idea-hub-server.vercel.app/api/v1/idea/adminideas?${queryParams.toString()}`, {
        headers: {
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch ideas");
    return res.json();
}

export async function updateIdeaStatus(ideaId: string, status: string, rejectionFeedback?: string) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    try {
        const res = await fetch(`https://idea-hub-server.vercel.app/api/v1/idea/${ideaId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: `next-auth.session-token=${sessionToken}`,
            },
            body: JSON.stringify({
                status,
                ...(status === "REJECTED" && { rejectionFeedback }),
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to update idea status");
        }

        revalidatePath("/dashboard/manageideas");
        revalidateTag("adminideas");
        return await res.json();
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update idea status",
        };
    }
}
