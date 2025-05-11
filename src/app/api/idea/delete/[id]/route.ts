import { NextResponse } from "next/server";
import { cookies } from "next/headers";

type Params = Promise<{ id: string }>;

export async function DELETE(request: Request, { params }: { params: Params }) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const { id } = await params;

    try {
        const res = await fetch(`http://localhost:5000/api/v1/idea/${id}`, {
            method: "DELETE",
            headers: {
                Cookie: `next-auth.session-token=${sessionToken}`,
            },
        });

        if (!res.ok) {
            throw new Error("Failed to delete idea");
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Failed to delete idea" }, { status: 500 });
    }
}
