import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UpdateIdeaForm from "./update-idea-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function getIdea(ideaId: string) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const res = await fetch(`http://localhost:5000/api/v1/idea/my-ideas/${ideaId}`, {
        headers: {
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch idea");
    return res.json();
}

async function getCategories() {
    const res = await fetch("http://localhost:5000/api/v1/category", {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
}

export default async function EditIdeaPage({ params }: { params: { ideaid: string } }) {
    const session = await getServerSession(authOptions);
    // console.log(session?.user.role);

    try {
        const [ideaResponse, categories] = await Promise.all([getIdea(params.ideaid), getCategories()]);

        const idea = ideaResponse.data;
        const maincategories = categories?.data || categories || [];

        // Transform categories to match form structure
        const defaultValues = {
            title: idea.title,
            problemStatement: idea.problemStatement,
            proposedSolution: idea.proposedSolution,
            description: idea.description,
            images: idea.images,
            isPaid: idea.isPaid,
            price: idea.price,
            categoryIds: idea.categories.map((c: any) => c.category.id),
            status: idea.status,
        };

        return <UpdateIdeaForm ideaId={params.ideaid} defaultValues={defaultValues} categories={maincategories} isAdmin={session?.user.role === "ADMIN"} />;
    } catch (error) {
        console.error(error);
        redirect("/dashboard/myidea");
    }
}
