"use client";

import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface ViewCounterProps {
    initialViews: number;
}

export function ViewCounter({ initialViews }: ViewCounterProps) {
    // Start with server count +1 for instant feedback
    const [views, setViews] = useState(initialViews + 1);

    // Sync with server data if it changes
    useEffect(() => {
        setViews(initialViews + 1);
    }, [initialViews]);

    return (
        <span className="flex items-center gap-1 text-sm">
            <Eye className="w-4 h-4" />
            {views.toLocaleString()} views
        </span>
    );
}
