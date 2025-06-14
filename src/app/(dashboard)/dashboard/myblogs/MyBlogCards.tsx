"use client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { BlogPost2 } from "@/app/types/blogs";
import { deleteBlog } from "@/components/actions/blogActions";

export function BlogCard({ post }: { post: BlogPost2 }) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteBlog(post.id);
            if (!result.success) throw new Error(result.error);
            toast.success("Blog deleted successfully");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to delete blog");
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
        }
    };

    return (
        <Card className="hover:shadow-lg transition-shadow duration-200 pt-0">
            {/* Cover Image */}
            <div className="relative h-48 w-full">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover rounded-t-lg" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            </div>

            {/* Card Header */}
            <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                    <Image src={post.author.image} alt={post.author.name} width={32} height={32} className="rounded-full" />
                    <span className="text-sm">{post.author.name}</span>
                </div>
                <CardTitle className="text-xl">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
            </CardHeader>

            {/* Card Content */}
            <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag) => (
                        <span key={tag} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                    <span>{Math.ceil(post.content.length / 1000)} min read</span>
                </div>
            </CardContent>

            {/* Card Footer with Actions */}
            <CardFooter className="flex justify-between">
                <div className="flex gap-4 text-sm">
                    <span>👁 {post.views.toLocaleString()}</span>
                </div>

                <div className="flex gap-2">
                    <Link href={`/dashboard/myblogs/${post.id}`} passHref>
                        <Button variant="ghost" size="sm">
                            Read more →
                        </Button>
                    </Link>

                    <Link href={`/dashboard/myblogs/update/${post.id}`} passHref>
                        <Button variant="outline" size="sm" className="gap-1">
                            <Edit className="h-3 w-3" />
                            Edit
                        </Button>
                    </Link>

                    <Button variant="destructive" size="sm" className="gap-1" onClick={() => setShowDeleteDialog(true)}>
                        <Trash2 className="h-3 w-3" />
                        Delete
                    </Button>
                </div>
            </CardFooter>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete your blog post.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {isDeleting ? (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2 animate-pulse" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
