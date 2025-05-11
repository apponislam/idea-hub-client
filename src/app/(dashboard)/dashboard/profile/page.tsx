import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/lib/authOptions";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect("/login");
    }

    const user = session.user;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Card className="rounded-2xl shadow-md">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={user.image || undefined} alt={user.name || "User"} />
                        <AvatarFallback>{user.name?.slice(0, 2).toUpperCase() || "US"}</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-xl">{user.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex gap-2 mt-2">
                            {user.role && <Badge variant="outline">{user.role}</Badge>}
                            {/* {user?.status && <Badge variant={user?.status === "ACTIVE" ? "default" : "destructive"}>{user?.status}</Badge>} */}
                        </div>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className="mt-4 space-y-2 text-sm text-muted-foreground">
                    <p>
                        <strong>User ID:</strong> {user.id}
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
