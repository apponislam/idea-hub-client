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

// ("use server");

// import { revalidatePath, revalidateTag } from "next/cache";
// import { cookies } from "next/headers";

// export async function createBlog(blogData: {
//     title: string;
//     content: string;
//     excerpt: string;
//     coverImage: string;
//     category: string;
//     tags: string[];
//     seo: {
//         description: string;
//         keywords: string[];
//     };
// }) {
//     const cookieStore = await cookies();
//     const sessionToken = cookieStore.get("next-auth.session-token")?.value;

//     try {
//         const res = await fetch("https://idea-hub-server.vercel.app/api/v1/blog", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 Cookie: `next-auth.session-token=${sessionToken}`,
//             },
//             body: JSON.stringify(blogData),
//             cache: "no-store",
//         });

//         if (!res.ok) {
//             const errorData = await res.json();
//             throw new Error(errorData.message || "Failed to create blog");
//         }

//         revalidatePath("/dashboard/blogs");
//         revalidateTag("blogs");
//         return await res.json();
//     } catch (error) {
//         return {
//             success: false,
//             error: error instanceof Error ? error.message : "Failed to create blog",
//         };
//     }
// }
