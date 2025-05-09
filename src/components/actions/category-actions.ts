"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getCategories() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const res = await fetch("http://localhost:5000/api/v1/category", {
        headers: {
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
}

export async function getCategory(id: string) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const res = await fetch(`http://localhost:5000/api/v1/category/${id}`, {
        headers: {
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch category");
    return res.json();
}

export async function createCategory(formData: FormData) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;
    const name = formData.get("name") as string;

    const res = await fetch("http://localhost:5000/api/v1/category", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        body: JSON.stringify({ name }),
    });

    if (!res.ok) throw new Error("Failed to create category");
    revalidatePath("/dashboard/categories");
    return res.json();
}

export async function updateCategory(id: string, formData: FormData) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;
    const name = formData.get("name") as string;

    const res = await fetch(`http://localhost:5000/api/v1/category/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        body: JSON.stringify({ name }),
    });

    if (!res.ok) {
        throw new Error("Failed to update category");
    }

    revalidatePath("/dashboard/categories");
    return res.json();
}
