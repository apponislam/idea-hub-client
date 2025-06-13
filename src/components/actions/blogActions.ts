"use server";
import { BlogApiResponse, BlogPost2 } from "@/app/types/blogs";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createBlog(blogData: {
    title: string;
    content: string;
    excerpt: string;
    coverImage: string;
    category: string;
    tags: string[];
    seo: {
        description: string;
        keywords: string[];
    };
}) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    try {
        const response = await fetch("http://localhost:5000/api/v1/blog", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `next-auth.session-token=${sessionToken}`,
            },
            body: JSON.stringify(blogData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to create blog");
        }

        revalidatePath("/dashboard/manageblogs");
        return await response.json();
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create blog",
        };
    }
}

export const getMyBlogs = async (): Promise<BlogApiResponse> => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    try {
        const response = await fetch("http://localhost:5000/api/v1/blog/my-blogs", {
            method: "GET",
            headers: {
                Cookie: `next-auth.session-token=${sessionToken}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch blogs");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching blogs:", error);
        throw error;
    }
};

export async function updateBlog(
    blogId: string,
    blogData: {
        title: string;
        content: string;
        excerpt: string;
        coverImage: string;
        category: string;
        tags: string[];
        seo: {
            description: string;
            keywords: string[];
        };
    }
) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    try {
        const response = await fetch(`http://localhost:5000/api/v1/blog/${blogId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Cookie: `next-auth.session-token=${sessionToken}`,
            },
            body: JSON.stringify(blogData),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to update blog");
        }

        revalidatePath("/dashboard/manageblogs");
        return await response.json();
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update blog",
        };
    }
}

export async function getSingleBlog(blogId: string): Promise<BlogPost2> {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    try {
        const response = await fetch(`http://localhost:5000/api/v1/blog/my-blogs/${blogId}`, {
            method: "GET",
            headers: {
                Cookie: `next-auth.session-token=${sessionToken}`,
            },
            cache: "no-store",
        });

        console.log(response);

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch blog");
        }

        const responseData = await response.json();
        return responseData.data;
    } catch (error) {
        console.error("Error fetching blog:", error);
        throw error;
    }
}

export async function deleteBlog(blogId: string) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    try {
        const response = await fetch(`http://localhost:5000/api/v1/blog/${blogId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Cookie: `next-auth.session-token=${sessionToken}`,
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to delete blog");
        }

        revalidatePath("/dashboard/manageblogs");
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete blog",
        };
    }
}
