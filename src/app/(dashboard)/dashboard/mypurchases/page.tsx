"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { getMyPurchases } from "@/components/actions/payment";
import Image from "next/image";

interface PurchasedItem {
    id: string;
    title: string;
    description: string;
    price: number;
    images: string[];
    creator: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
    purchasedAt: string;
    transactionId: string;
    paymentAmount: number;
}

const MyPurchasesPage = () => {
    const [purchases, setPurchases] = useState<PurchasedItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPurchases = async () => {
            try {
                setLoading(true);
                const response = await getMyPurchases();
                if (response.success && response.data) {
                    setPurchases(response.data);
                } else {
                    throw new Error(response.message || "Failed to load purchases");
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load purchases");
            } finally {
                setLoading(false);
            }
        };

        fetchPurchases();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p>Loading your purchases...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-red-500 text-center max-w-md p-4">
                    <h2 className="text-xl font-bold mb-2">Error loading purchases</h2>
                    <p>{error}</p>
                    <Button className="mt-4" onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </div>
            </div>
        );
    }

    if (purchases.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-center max-w-md p-4">
                    <h2 className="text-xl font-bold mb-2">No purchases yet</h2>
                    <p className="text-muted-foreground mb-4">You haven`&apos;`t made any purchases yet. Explore ideas to get started!</p>
                    <Button asChild>
                        <Link href="/ideas">Browse Ideas</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-8 mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">My Purchases</h1>
                <p className="text-muted-foreground">
                    {purchases.length} {purchases.length === 1 ? "item" : "items"} purchased
                </p>
            </div>

            <div className="grid gap-6">
                {purchases.map((purchase) => {
                    const purchaseDate = purchase.purchasedAt ? new Date(purchase.purchasedAt) : new Date();
                    const creatorInitial = purchase.creator?.name?.charAt(0) || "U";

                    return (
                        <Card key={purchase.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between pb-3">
                                <div>
                                    <CardTitle className="text-lg">
                                        <Link href={`/ideas/${purchase.id}`} className="hover:underline">
                                            {purchase.title}
                                        </Link>
                                    </CardTitle>
                                    <CardDescription className="flex items-center gap-2 mt-1">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={purchase.creator?.image} />
                                            <AvatarFallback>{creatorInitial}</AvatarFallback>
                                        </Avatar>
                                        <span>Created by {purchase.creator?.name || "Unknown"}</span>
                                    </CardDescription>
                                </div>
                                <Badge variant="default">PAID</Badge>
                            </CardHeader>
                            <CardContent>
                                <p className="line-clamp-2 text-muted-foreground mb-4">{purchase.description}</p>

                                {purchase.images?.length > 0 && (
                                    <div className="flex gap-2 mb-4">
                                        {purchase.images.slice(0, 3).map((image, index) => (
                                            <div key={index} className="relative h-20 w-20 rounded-md overflow-hidden">
                                                <Image src={image} alt={`Preview ${index + 1}`} fill className="object-cover" sizes="80px" />
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Purchased on</p>
                                        <p>{format(purchaseDate, "MMM d, yyyy")}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Transaction ID</p>
                                        <p className="font-mono">{purchase.transactionId}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Idea Price</p>
                                        <p>${purchase.price}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Amount paid</p>
                                        <p>${purchase.paymentAmount}</p>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button asChild>
                                    <Link href={`/ideas/${purchase.id}`}>View Idea</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};

export default MyPurchasesPage;
