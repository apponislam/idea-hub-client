import { getServerSession } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/authOptions";

const page = async () => {
    const session = await getServerSession(authOptions);

    return (
        <div className="p-6">
            <Card>
                <CardHeader>
                    <CardTitle>Welcome back, {session?.user?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={session?.user?.image || "/default-avatar.png"} alt="User Avatar" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-semibold">{session?.user?.name}</h2>
                            <p className="text-gray-500">{session?.user?.email}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default page;
