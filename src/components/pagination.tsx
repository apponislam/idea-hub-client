"use client";

import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

export function Pagination({
    meta,
}: {
    meta?: {
        page: number;
        limit: number;
        total: number;
    };
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    if (!meta || meta.total <= meta.limit) return null;

    const currentPage = meta.page;
    const totalPages = Math.ceil(meta.total / meta.limit);

    const updatePage = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * meta.limit + 1}-{Math.min(currentPage * meta.limit, meta.total)} of {meta.total} ideas
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => updatePage(currentPage - 1)} disabled={currentPage <= 1}>
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => updatePage(currentPage + 1)} disabled={currentPage >= totalPages}>
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
