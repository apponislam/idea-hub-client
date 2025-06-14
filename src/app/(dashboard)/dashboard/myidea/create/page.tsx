import CreateIdeaPage from "@/components/forms/create-idea-form";
import React from "react";

async function getCategories() {
    try {
        const res = await fetch("https://idea-hub-server.vercel.app/api/v1/category");
        if (!res.ok) {
            throw new Error("Failed to fetch categories");
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching categories:", error);
        return []; // Return empty array if fetch fails
    }
}

const Page = async () => {
    const categoriesData = await getCategories();
    const categories = categoriesData.data || categoriesData || [];

    return (
        <div className="container mx-auto py-8">
            <CreateIdeaPage categories={categories} />
        </div>
    );
};

export default Page;
