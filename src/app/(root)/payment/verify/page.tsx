"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

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

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <p className="text-lg">Verifying your payment...</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
                <div className="max-w-md w-full p-6 bg-red-50 rounded-lg text-center">
                    <AlertCircle className="w-10 h-10 mx-auto text-red-500 mb-3" />
                    <h2 className="text-xl font-bold text-red-700 mb-2">Payment Error</h2>
                    <p className="text-red-600 mb-4">{error}</p>
                    <div className="flex gap-3 justify-center">
                        <Button variant="outline" onClick={() => router.push("/")}>
                            Return Home
                        </Button>
                        <Button onClick={() => window.location.reload()}>Try Again</Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
            <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md text-center border border-gray-200">
                <CheckCircle2 className="w-16 h-16 mx-auto text-green-500 mb-4" />
                <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>

                <div className="bg-gray-50 p-4 rounded-lg mb-6 text-left">
                    <h2 className="font-semibold mb-2">Order Details</h2>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <span className="text-gray-500">Transaction ID:</span>
                        <span className="font-mono">{paymentData?.transactionId}</span>
                        <span className="text-gray-500">Amount:</span>
                        <span>${paymentData?.amount}</span>
                    </div>
                </div>

                <div className="flex gap-3 justify-center">
                    <Button onClick={() => router.push(`/ideas/${paymentData?.ideaId}`)}>View Idea</Button>
                    <Button variant="outline" onClick={() => router.push("/")}>
                        Return Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
