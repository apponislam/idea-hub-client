"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { updateIdeaStatus } from "./actions/admin-idea-actions";
import { cn } from "@/lib/utils";
import { RejectionModal } from "./rejection-modal";

interface StatusDropdownProps {
    ideaId: string;
    currentStatus: "UNDER_REVIEW" | "PENDING" | "APPROVED" | "REJECTED";
    onStatusChange?: () => void;
}

export function StatusDropdown({ ideaId, currentStatus, onStatusChange }: StatusDropdownProps) {
    const router = useRouter();
    const [rejectionModalOpen, setRejectionModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

    const handleStatusChange = async (status: string) => {
        if (status === "REJECTED") {
            setSelectedStatus(status);
            setRejectionModalOpen(true);
            return;
        }

        await updateStatus(status);
    };

    const updateStatus = async (status: string, feedback?: string) => {
        try {
            const result = await updateIdeaStatus(ideaId, status, status === "REJECTED" ? feedback : undefined);
            console.log(result);
            onStatusChange?.();
            toast.success("Idea status updated");
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update status");
        }
    };

    const handleRejectionConfirm = async (feedback: string) => {
        if (selectedStatus) {
            await updateStatus(selectedStatus, feedback);
        }
    };

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "UNDER_REVIEW":
                return "bg-blue-500 hover:bg-blue-600 text-white";
            case "APPROVED":
                return "bg-green-500 hover:bg-green-600 text-white";
            case "PENDING":
                return "bg-amber-500 hover:bg-amber-600 text-white";
            case "REJECTED":
                return "bg-destructive text-white hover:bg-destructive/90";
            default:
                return "bg-secondary text-secondary-foreground hover:bg-secondary/80";
        }
    };

    return (
        <>
            <Select value={currentStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px]">
                    <div className="flex items-center gap-2">
                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", getStatusStyles(currentStatus))}>{currentStatus.toLowerCase().replace("_", " ")}</span>
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="UNDER_REVIEW">
                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", "bg-blue-500 hover:bg-blue-600 text-white")}>Under Review</span>
                    </SelectItem>
                    <SelectItem value="PENDING">
                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", "bg-amber-500 hover:bg-amber-600 text-white")}>Pending</span>
                    </SelectItem>
                    <SelectItem value="APPROVED">
                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", "bg-green-500 hover:bg-green-600 text-white")}>Approved</span>
                    </SelectItem>
                    <SelectItem value="REJECTED">
                        <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize", "bg-destructive text-white hover:bg-destructive/90")}>Rejected</span>
                    </SelectItem>
                </SelectContent>
            </Select>

            <RejectionModal open={rejectionModalOpen} onOpenChange={setRejectionModalOpen} onConfirm={handleRejectionConfirm} />
        </>
    );
}
