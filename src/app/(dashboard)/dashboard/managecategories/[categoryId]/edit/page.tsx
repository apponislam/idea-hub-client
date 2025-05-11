import { getCategory, updateCategory } from "@/components/actions/category-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Save } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

type Params = Promise<{ categoryId: string }>;

export default async function EditCategoryPage({ params }: { params: Params }) {
    const { categoryId } = await params;

    console.log("Category ID:", categoryId);

    const response = await getCategory(categoryId);

    if (!response.data) {
        redirect("/dashboard/managecategories");
    }

    const category = response.data;

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/managecategories">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Edit Category</h1>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form
                        action={async (formData) => {
                            "use server";
                            await updateCategory(categoryId, formData);
                            redirect("/dashboard/managecategories");
                        }}
                        className="space-y-4"
                    >
                        <div>
                            <Label htmlFor="name">Category Name</Label>
                            <Input id="name" name="name" defaultValue={category.name} placeholder="Enter category name" required />
                        </div>
                        <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
