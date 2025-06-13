"use server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

type IdeaFormValues = {
    title: string;
    problemStatement: string;
    proposedSolution: string;
    description: string;
    images: string[];
    isPaid: boolean;
    price: number | null;
    categoryIds: string[];
};

export async function createIdea(values: IdeaFormValues, status: string) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const res = await fetch("http://localhost:5000/api/v1/idea", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        credentials: "include",
        body: JSON.stringify({ ...values, status }),
    });

    if (!res.ok) throw new Error("Failed to create idea");

    revalidatePath("/dashboard/myidea");
    return res.json();
}
