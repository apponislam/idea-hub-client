import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

type Params = Promise<{ id: string }>;

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const { id } = await params;

    const data = await req.json();

    const res = await fetch(`https://idea-hub-server.vercel.app/api/v1/idea/${id}`, {
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
