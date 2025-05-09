import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Plus, Edit } from "lucide-react";
import { getCategories } from "@/components/actions/category-actions";

interface Category {
    id: string;
    name: string;
    createdAt: string;
}

export default async function CategoriesPage() {
    let categories: Category[] = [];

    try {
        const response = await getCategories();
        categories = response.data || [];
    } catch (error) {
        console.error("Error fetching categories:", error);
        return (
            <div className="container mx-auto py-8">
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">Could not load categories.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Categories</h1>
                <Link href="/dashboard/managecategories/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Category
                    </Button>
                </Link>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Categories ({categories.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Created At</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">{category.name}</TableCell>
                                    <TableCell>{new Date(category.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/dashboard/managecategories/${category.id}/edit`}>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
