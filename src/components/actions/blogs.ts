import { BlogData } from "@/app/types/blogs";

export async function getBlogData(): Promise<BlogData> {
    try {
        const response = await fetch("https://idea-hub-client.vercel.app/blogs.json");
        if (!response.ok) {
            throw new Error("Failed to fetch blog data");
        }
        return await response.json();
    } catch (error) {
        console.error("Error loading blog data:", error);
        return { posts: [] };
    }
}
