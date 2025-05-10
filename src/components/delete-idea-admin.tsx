"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { DropdownMenuItem } from "./ui/dropdown-menu";

interface DeleteIdeaButtonProps {
    id: string;
    asDropdownItem?: boolean;
}

export function DeleteIdeaButton({ id, asDropdownItem = false }: DeleteIdeaButtonProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/idea/delete/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete idea");
            }

            toast.success("Idea deleted successfully");
            router.push("/dashboard/manageideas");
            router.refresh();
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete idea");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            {asDropdownItem ? (
                <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onSelect={(e) => {
                        e.preventDefault(); // <- Important: prevents the dropdown from closing
                        setOpen(true);
                    }}
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Idea</span>
                </DropdownMenuItem>
            ) : (
                <Button variant="destructive" onClick={() => setOpen(true)} className="w-full">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Idea
                </Button>
            )}

            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete your idea and remove its data from our servers.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
