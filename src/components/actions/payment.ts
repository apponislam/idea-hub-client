"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const verifyPurchaseAndRedirect = async (ideaId: string) => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    if (!sessionToken) {
        redirect("/login");
    }

    try {
        // Check if user has purchased this idea
        const response = await fetch(`https://idea-hub-server.vercel.app/api/v1/payment/my-purchases/${ideaId}`, {
            method: "GET",
            headers: {
                Cookie: `next-auth.session-token=${sessionToken}`,
            },
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const purchases = await response.json();

        // If no purchases found, redirect to payment page
        if (!purchases.data || purchases.data.length === 0) {
            redirect(`/ideas/${ideaId}/payfirst`);
        }

        // If purchase exists, return the purchase data
        return purchases.data;
    } catch (error) {
        console.error("Payment verification failed:", error);
        redirect(`/ideas/${ideaId}/payfirst`);
    }
};

export const getMyPurchases = async () => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    if (!sessionToken) {
        throw new Error("Not authenticated");
    }

    const response = await fetch(`https://idea-hub-server.vercel.app/api/v1/payment/my-purchases`, {
        headers: {
            "Content-Type": "application/json",
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        next: { tags: ["user-purchases"] },
    });

    if (!response.ok) {
        throw new Error(await response.text());
    }

    return await response.json();
};
