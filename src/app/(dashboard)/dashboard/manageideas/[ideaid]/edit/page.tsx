import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UpdateIdeaForm from "./update-idea-form";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

async function getIdea(ideaId: string) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const res = await fetch(`https://idea-hub-server.vercel.app/api/v1/idea/adminideas/${ideaId}`, {
        headers: {
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch idea");
    return res.json();
}

async function getCategories() {
    const res = await fetch("https://idea-hub-server.vercel.app/api/v1/category", {
        cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch categories");
    return res.json();
}

type Params = Promise<{ ideaid: string }>;

export default async function EditIdeaPage({ params }: { params: Params }) {
    const { ideaid } = await params;

    console.log(ideaid);

    const session = await getServerSession(authOptions);

    try {
        const [ideaResponse, categories] = await Promise.all([getIdea(ideaid), getCategories()]);

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

        return <UpdateIdeaForm ideaId={ideaid} defaultValues={defaultValues} categories={maincategories} isAdmin={session?.user.role === "ADMIN"} />;
    } catch (error) {
        console.error(error);
        redirect("/dashboard/manageideas");
    }
}
