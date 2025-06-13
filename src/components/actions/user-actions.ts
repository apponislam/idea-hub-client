"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function updateUserRole(userId: string, newRole: string) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const res = await fetch(`http://localhost:5000/api/v1/user/${userId}/role`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        body: JSON.stringify({ role: newRole }),
    });

    if (!res.ok) throw new Error("Failed to update user role");

    revalidatePath("/dashboard/manageusers");

    return res.json();
}

export async function activateUser(userId: string) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const res = await fetch(`http://localhost:5000/api/v1/user/${userId}/activate`, {
        method: "PATCH",
        headers: {
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
    });

    if (!res.ok) throw new Error("Failed to activate user");
    revalidatePath("/dashboard/manageusers");
    return res.json();
}

export async function deactivateUser(userId: string) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const res = await fetch(`http://localhost:5000/api/v1/user/${userId}/deactivate`, {
        method: "PATCH",
        headers: {
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
    });

    if (!res.ok) throw new Error("Failed to deactivate user");
    revalidatePath("/dashboard/manageusers");
    return res.json();
}

export async function deleteUser(userId: string) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const res = await fetch(`http://localhost:5000/api/v1/user/${userId}/delete`, {
        method: "DELETE",
        headers: {
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
    });

    if (!res.ok) throw new Error("Failed to delete user");
    revalidatePath("/dashboard/manageusers");
    return res.json();
}

export async function getUsers() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const res = await fetch(`http://localhost:5000/api/v1/user`, {
        headers: {
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch users");
    revalidatePath("/dashboard/manageusers");
    return res.json();
}

export async function getUser(userId: string) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const res = await fetch(`http://localhost:5000/api/v1/user/${userId}`, {
        headers: {
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch user (ID: ${userId})`);
    }

    // revalidatePath(`/dashboard/profile`);
    return res.json();
}
