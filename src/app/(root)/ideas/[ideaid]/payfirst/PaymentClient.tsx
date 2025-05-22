"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Lock, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
}

interface PaymentClientProps {
    ideaid: string;
    user: User;
}

export default function PaymentClient({ ideaid, user }: PaymentClientProps) {
    const router = useRouter();
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<{
        title: string;
        message: string;
        retryable: boolean;
    } | null>(null);

    const initiatePayment = useCallback(async () => {
        if (!ideaid) {
            setError({
                title: "Invalid Order",
                message: "Order reference is missing",
                retryable: false,
            });
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch("/api/payment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: ideaid }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Payment processing failed");
            }

            if (!data.success || !data.data) {
                throw new Error(data.message || "Invalid payment response");
            }

            setPaymentUrl(data.data);
        } catch (err) {
            setError({
                title: "Payment Error",
                message: err instanceof Error ? err.message : "An unknown error occurred",
                retryable: true,
            });
        } finally {
            setLoading(false);
        }
    }, [ideaid]);

    useEffect(() => {
        initiatePayment();
    }, [initiatePayment]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-lg font-medium">Preparing your payment...</p>
                <p className="text-sm text-muted-foreground">This won&apos;t take long</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <div className="flex justify-center">
                            <AlertCircle className="w-12 h-12 text-destructive" />
                        </div>
                        <CardTitle className="text-center text-2xl">{error.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground">{error.message}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                            Return Home
                        </Button>
                        {error.retryable && (
                            <Button className="w-full" onClick={initiatePayment}>
                                Try Again
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                        <Avatar>
                            <AvatarImage src={user.image} />
                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                    </div>
                    <CardTitle className="text-2xl text-center">Complete Payment</CardTitle>
                    <CardDescription className="text-center">Secure checkout process</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                        <span className="text-sm font-medium">Order ID</span>
                        <Badge variant="outline" className="font-mono">
                            {ideaid}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="w-4 h-4" />
                        <span>256-bit SSL encrypted payment</span>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button size="lg" className="w-full" onClick={() => paymentUrl && (window.location.href = paymentUrl)} disabled={!paymentUrl}>
                        {paymentUrl ? (
                            <>
                                Proceed to Payment
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        ) : (
                            "Processing..."
                        )}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                        Cancel
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
