// app/api/payment/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // 1. Validate session
        const cookieStore = await cookies();
        const sessionToken = cookieStore.get("next-auth.session-token")?.value;

        if (!sessionToken) {
            return NextResponse.json({ success: false, message: "Session expired. Please login again." }, { status: 401 });
        }

        // 2. Validate request body
        const body = await req.json();

        if (!body?.id || typeof body.id !== "string") {
            return NextResponse.json({ success: false, message: "Invalid payment request. Missing order ID." }, { status: 400 });
        }

        // 3. Forward to payment backend
        const backendResponse = await fetch("https://idea-hub-server.vercel.app/api/v1/payment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Cookie: `next-auth.session-token=${sessionToken}`,
            },
            body: JSON.stringify(body),
        });

        // 4. Validate backend response
        if (!backendResponse.ok) {
            throw new Error(`Backend responded with ${backendResponse.status}`);
        }

        const data = await backendResponse.json();

        if (!data?.success || !data?.data) {
            return NextResponse.json({ success: false, message: data?.message || "Payment gateway error" }, { status: 502 });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Payment processing error:", error);
        return NextResponse.json(
            {
                success: false,
                message: error instanceof Error ? error.message : "Payment processing failed",
            },
            { status: 500 }
        );
    }
}
