// components/rejection-modal.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface RejectionModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (feedback: string) => Promise<void>;
}

export function RejectionModal({ open, onOpenChange, onConfirm }: RejectionModalProps) {
    const [feedback, setFeedback] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!feedback.trim()) return;
        setIsSubmitting(true);
        await onConfirm(feedback);
        setIsSubmitting(false);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Provide Rejection Feedback</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <Textarea placeholder="Explain why this idea was rejected..." value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} disabled={!feedback.trim() || isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit Rejection"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
