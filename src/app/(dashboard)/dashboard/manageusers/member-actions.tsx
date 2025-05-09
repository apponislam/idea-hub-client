"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical, Check, Lock, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { activateUser, deactivateUser, deleteUser } from "@/components/actions/user-actions";
import { toast } from "sonner";

interface MemberActionsProps {
    member: {
        id: string;
        status: "ACTIVE" | "BLOCKED" | "DELECTED";
    };
}

export function MemberActions({ member }: MemberActionsProps) {
    const handleStatusChange = async () => {
        if (member.status === "ACTIVE") {
            const result = await deactivateUser(member.id);
            toast.success(result.message);
        } else {
            const result = await activateUser(member.id);
            toast.success(result.message);
        }
    };

    const handleDelete = async () => {
        await deleteUser(member.id);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {member.status !== "DELECTED" && (
                    <>
                        <DropdownMenuItem onClick={handleStatusChange} className="cursor-pointer">
                            {member.status === "ACTIVE" ? (
                                <>
                                    <Lock className="mr-2 h-4 w-4" />
                                    Block User
                                </>
                            ) : member.status === "BLOCKED" ? (
                                <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Activate User
                                </>
                            ) : null}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleDelete} className="cursor-pointer text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete User
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
