import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get("order_id");

        console.log(orderId);

        if (!orderId) {
            return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
        }

        const verifyResponse = await fetch(`http://localhost:5000/api/v1/payment/verify?order_id=${orderId}`);

        if (!verifyResponse.ok) {
            throw new Error("Verification failed");
        }

        const data = await verifyResponse.json();

        return NextResponse.json(data);
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, message: "Payment verification failed" }, { status: 500 });
    }
}
