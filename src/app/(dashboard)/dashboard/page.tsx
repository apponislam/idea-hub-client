// import { getServerSession } from "next-auth";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { authOptions } from "@/lib/authOptions";

// const page = async () => {
//     const session = await getServerSession(authOptions);

//     return (
//         <div className="p-6">
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Welcome back, {session?.user?.name}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="flex items-center space-x-4">
//                         <Avatar>
//                             <AvatarImage src={session?.user?.image || "/default-avatar.png"} alt="User Avatar" />
//                             <AvatarFallback>U</AvatarFallback>
//                         </Avatar>
//                         <div>
//                             <h2 className="text-xl font-semibold">{session?.user?.name}</h2>
//                             <p className="text-gray-500">{session?.user?.email}</p>
//                         </div>
//                     </div>
//                 </CardContent>
//             </Card>
//         </div>
//     );
// };

// export default page;

// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/components/actions/user-actions";
import { PieChart } from "./pie-chart";
import { allItems } from "@/components/app-sidebar";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return <div>Not authenticated</div>;
    }

    const userData = await getUser(session.user.id);
    const user = userData?.data || {
        id: session.user.id,
        name: session.user.name || "User",
        email: session.user.email || "",
        role: "MEMBER",
        status: "ACTIVE",
        image: session.user.image,
        _count: {
            ideas: 0,
            votes: 0,
            comments: 0,
            payments: 0,
        },
    };

    const pieData = [
        { name: "Ideas", value: user._count.ideas },
        { name: "Votes", value: user._count.votes },
        { name: "Comments", value: user._count.comments },
        { name: "Purchases", value: user._count.payments },
    ];

    const filteredItems = allItems.filter((item) => item.roles.includes(user.role));

    return (
        <div className="p-6 space-y-6">
            {/* Welcome Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Welcome back, {user.name}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src={user.image || "/default-avatar.png"} />
                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-semibold">{user.name}</h2>
                            <p className="text-muted-foreground">{user.email}</p>
                            <Badge variant="outline" className="mt-1 capitalize">
                                {user.role.toLowerCase()}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Pie Chart Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                        <PieChart data={pieData} />
                    </CardContent>
                </Card>

                {/* Quick Links Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Links</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            {filteredItems.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Link key={item.title} href={item.url}>
                                        <Card className="hover:bg-accent transition-colors h-full">
                                            <CardContent className="p-4 flex flex-col items-center justify-center gap-2">
                                                <Icon className="h-6 w-6 text-primary" />
                                                <span className="text-center">{item.title}</span>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
