// components/pagination.tsx
"use client";

import { Button } from "@/components/ui/button";

interface PaginationProps {
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
    onPageChange?: (newPage: number) => void;
}

export function Pagination({ meta, onPageChange }: PaginationProps) {
    if (!meta || meta.total <= meta.limit) return null;

    const totalPages = Math.ceil(meta.total / meta.limit);
    const currentPage = meta.page;

    return (
        <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={currentPage <= 1} onClick={() => onPageChange?.(currentPage - 1)}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" disabled={currentPage >= totalPages} onClick={() => onPageChange?.(currentPage + 1)}>
                    Next
                </Button>
            </div>
        </div>
    );
}
