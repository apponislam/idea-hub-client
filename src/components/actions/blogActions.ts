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
        const response = await fetch("https://idea-hub-server.vercel.app/api/v1/blog", {
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

        revalidatePath("/dashboard/myblogs");
        return await response.json();
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create blog",
        };
    }
}

export const getMyBlogs = async (page: number = 1, limit: number = 10): Promise<BlogApiResponse> => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    try {
        const response = await fetch(`https://idea-hub-server.vercel.app/api/v1/blog/my-blogs?page=${page}&limit=${limit}`, {
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
        const response = await fetch(`https://idea-hub-server.vercel.app/api/v1/blog/${blogId}`, {
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

        revalidatePath("/dashboard/myblogs");
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
        const response = await fetch(`https://idea-hub-server.vercel.app/api/v1/blog/my-blogs/${blogId}`, {
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
        const response = await fetch(`https://idea-hub-server.vercel.app/api/v1/blog/${blogId}`, {
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

        revalidatePath("/dashboard/myblogs");
        return { success: true };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete blog",
        };
    }
}

// For admin users
export const getAdminBlogs = async (page: number = 1, limit: number = 10): Promise<BlogApiResponse> => {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    try {
        const response = await fetch(`https://idea-hub-server.vercel.app/api/v1/blog/admin/blogs?page=${page}&limit=${limit}`, {
            method: "GET",
            headers: {
                Cookie: `next-auth.session-token=${sessionToken}`,
            },
            cache: "no-store",
        });

        if (!response.ok) throw new Error("Failed to fetch admin blogs");
        return await response.json();
    } catch (error) {
        console.error("Error fetching admin blogs:", error);
        throw error;
    }
};

export async function getSingleBlogForAdmin(blogId: string): Promise<BlogPost2> {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    try {
        const response = await fetch(`https://idea-hub-server.vercel.app/api/v1/blog/admin/blogs/${blogId}`, {
            method: "GET",
            headers: {
                Cookie: `next-auth.session-token=${sessionToken}`,
                "Content-Type": "application/json",
            },
            cache: "no-store",
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch blog");
        }

        const responseData = await response.json();

        if (!responseData.data) {
            throw new Error("Blog data not found in response");
        }

        return responseData.data as BlogPost2;
    } catch (error) {
        console.error("Error fetching blog:", error);
        throw error;
    }
}

// PUBLIC API

export const getPublicBlogs = async (page: number = 1, limit: number = 10): Promise<BlogApiResponse> => {
    try {
        const response = await fetch(`https://idea-hub-server.vercel.app/api/v1/blog?page=${page}&limit=${limit}`, {
            method: "GET",
            cache: "no-store",
            next: { tags: ["blogs"], revalidate: 0 },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch blogs");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching public blogs:", error);
        throw error;
    }
};

export const getSinglePublicBlog = async (blogId: string): Promise<BlogApiResponse> => {
    try {
        const response = await fetch(`https://idea-hub-server.vercel.app/api/v1/blog/public/${blogId}`, {
            method: "GET",
            cache: "no-store",
            next: { tags: [`blog-${blogId}`], revalidate: 0 },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || "Failed to fetch blog");
        }

        const responseData = await response.json();

        if (!responseData) {
            throw new Error("Blog data not found in response");
        }

        return responseData;
    } catch (error) {
        console.error("Error fetching blog:", error);
        throw error;
    }
};
