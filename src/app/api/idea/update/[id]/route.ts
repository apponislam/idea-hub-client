import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const data = await req.json();

    const res = await fetch(`http://localhost:5000/api/v1/idea/${params.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        body: JSON.stringify(data),
    });

    const resData = await res.json();

    return new NextResponse(JSON.stringify(resData), { status: res.status });
}
