"use client";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Pagination } from "./paginagtion";

interface PaginationWrapperProps {
    meta: {
        page: number;
        limit: number;
        total: number;
    };
}

export function PaginationWrapper({ meta }: PaginationWrapperProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", newPage.toString());
        router.push(`${pathname}?${params.toString()}`);
    };

    return <Pagination meta={meta} onPageChange={handlePageChange} />;
}
