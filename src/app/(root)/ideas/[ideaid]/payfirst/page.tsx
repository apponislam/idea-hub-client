"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";

export default function PaymentPage() {
    const router = useRouter();
    const params = useParams();
    const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<{
        title: string;
        message: string;
        retryable: boolean;
    } | null>(null);

    const initiatePayment = useCallback(async () => {
        const orderId = params.ideaid as string;
        console.log("Order ID:", orderId); // Debug log

        if (!orderId) {
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
                body: JSON.stringify({ id: orderId }), // Sending as 'id' to match API
            });

            const data = await response.json();
            console.log("Payment response:", data); // Debug log

            if (!response.ok) {
                throw new Error(data.message || "Payment processing failed");
            }

            if (!data.success || !data.data) {
                throw new Error(data.message || "Invalid payment response");
            }

            setPaymentUrl(data.data);
        } catch (err) {
            console.error("Payment error:", err); // Debug log
            setError({
                title: "Payment Error",
                message: err instanceof Error ? err.message : "An unknown error occurred",
                retryable: true,
            });
        } finally {
            setLoading(false);
        }
    }, [params.ideaid]);

    useEffect(() => {
        initiatePayment();
    }, [initiatePayment]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-lg">Preparing your payment...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4 max-w-md mx-auto">
                <div className="bg-red-50 p-4 rounded-lg w-full text-center">
                    <AlertCircle className="w-10 h-10 mx-auto text-red-500 mb-3" />
                    <h2 className="text-xl font-bold text-red-700 mb-2">{error.title}</h2>
                    <p className="text-red-600 mb-4">{error.message}</p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={() => router.push("/")}>
                            Return Home
                        </Button>
                        {error.retryable && <Button onClick={initiatePayment}>Try Again</Button>}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center border border-gray-200">
                <h1 className="text-2xl font-bold mb-4">Complete Payment</h1>
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-blue-800">
                        Order: <span className="font-mono">{params.ideaid}</span>
                    </p>
                </div>
                <p className="mb-6 text-gray-600">You`&apos;`ll be redirected to our secure payment gateway</p>
                <Button onClick={() => paymentUrl && (window.location.href = paymentUrl)} className="w-full py-6 text-lg bg-green-600 hover:bg-green-700" disabled={!paymentUrl}>
                    {paymentUrl ? "Proceed to Payment" : "Processing..."}
                </Button>
                <p className="mt-4 text-sm text-gray-500">
                    <span className="inline-block mr-2">🔒</span>
                    All transactions are securely encrypted
                </p>
            </div>
        </div>
    );
}
