"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { toast } from "sonner";
import { createCategory } from "@/components/actions/category-actions";

export default function NewCategoryPage() {
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        try {
            await createCategory(formData);
            toast.success("Category created successfully!");
            router.push("/dashboard/managecategories");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to create category");
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/dashboard/managecategories">
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">New Category</h1>
            </div>

            <Card>
                <CardContent className="p-6">
                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="mb-4">
                                Category Name
                            </Label>
                            <Input id="name" name="name" placeholder="Enter category name" required />
                        </div>
                        <Button type="submit">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Category
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
