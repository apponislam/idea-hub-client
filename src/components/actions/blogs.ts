import { BlogData } from "@/app/types/blogs";

export async function getBlogData(): Promise<BlogData> {
    try {
        const response = await fetch("http://localhost:3000/blogs.json");
        if (!response.ok) {
            throw new Error("Failed to fetch blog data");
        }
        return await response.json();
    } catch (error) {
        console.error("Error loading blog data:", error);
        return { posts: [] };
    }
}
