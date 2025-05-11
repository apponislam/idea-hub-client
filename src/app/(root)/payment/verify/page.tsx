"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle, Clock, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type PaymentStatus = "PAID" | "PENDING" | "FAILED" | "CANCELLED" | "REFUNDED";

export default function PaymentSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [error, setError] = useState<string | null>(null);
    const [paymentData, setPaymentData] = useState<any>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                const orderId = searchParams.get("order_id");
                if (!orderId) {
                    throw new Error("Missing order ID");
                }

                const response = await fetch(`/api/verify?order_id=${orderId}`);
                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.message || "Payment verification failed");
                }

                setPaymentData(data.data);
                setStatus("success");
            } catch (err) {
                console.error("Payment verification error:", err);
                setError(err instanceof Error ? err.message : "Payment verification failed");
                setStatus("error");
            }
        };

        verifyPayment();
    }, [searchParams]);

    const getStatusDetails = (status: PaymentStatus) => {
        switch (status) {
            case "PAID":
                return {
                    icon: <CheckCircle2 className="w-12 h-12 mx-auto text-green-500" />,
                    title: "Payment Successful!",
                    description: "Your payment has been processed successfully",
                    badgeVariant: "default" as const, // changed from "success"
                };
            case "PENDING":
                return {
                    icon: <Clock className="w-12 h-12 mx-auto text-yellow-500" />,
                    title: "Payment Pending",
                    description: "Your payment is being processed",
                    badgeVariant: "outline" as const, // changed from "warning"
                };
            case "FAILED":
                return {
                    icon: <XCircle className="w-12 h-12 mx-auto text-red-500" />,
                    title: "Payment Failed",
                    description: "The payment could not be processed",
                    badgeVariant: "destructive" as const,
                };
            case "CANCELLED":
                return {
                    icon: <AlertTriangle className="w-12 h-12 mx-auto text-orange-500" />,
                    title: "Payment Cancelled",
                    description: "The payment was cancelled",
                    badgeVariant: "secondary" as const,
                };
            default:
                return {
                    icon: <AlertCircle className="w-12 h-12 mx-auto text-gray-500" />,
                    title: "Payment Status Unknown",
                    description: "Unable to determine payment status",
                    badgeVariant: "outline" as const,
                };
        }
    };

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <p className="text-lg font-medium">Verifying your payment...</p>
                <p className="text-sm text-muted-foreground">Please wait while we confirm your payment</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="items-center">
                        <AlertCircle className="w-12 h-12 text-destructive" />
                        <CardTitle className="text-center">Payment Error</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground">{error}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-3">
                        <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                            Return Home
                        </Button>
                        <Button className="w-full" onClick={() => window.location.reload()}>
                            Try Again
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const statusDetails = getStatusDetails(paymentData?.paymentStatus as PaymentStatus);

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="items-center">
                    {statusDetails.icon}
                    <CardTitle className="text-center">{statusDetails.title}</CardTitle>
                    <CardDescription className="text-center">{statusDetails.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-center">
                        <Badge variant={statusDetails.badgeVariant}>{paymentData?.paymentStatus}</Badge>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-medium text-center">Order Summary</h3>
                        <div className="bg-secondary/50 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <span className="text-muted-foreground">Transaction ID:</span>
                                <span className="font-mono text-right">{paymentData?.transactionId}</span>
                                <span className="text-muted-foreground">Amount:</span>
                                <span className="text-right">${paymentData?.amount}</span>
                                <span className="text-muted-foreground">Date:</span>
                                <span className="text-right">{new Date(paymentData?.createdAt).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {paymentData?.idea && (
                        <div className="space-y-2">
                            <h3 className="font-medium text-center">Idea Details</h3>
                            <div className="bg-secondary/50 p-4 rounded-lg">
                                <p className="font-medium">{paymentData.idea.title}</p>
                                <p className="text-sm text-muted-foreground">${paymentData.idea.price}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    {paymentData?.paymentStatus === "PAID" && (
                        <Button className="w-full" onClick={() => router.push(`/ideas/${paymentData?.ideaId}`)}>
                            View Idea
                        </Button>
                    )}
                    <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
                        Return Home
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
