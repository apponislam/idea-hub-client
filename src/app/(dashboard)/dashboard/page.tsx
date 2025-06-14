import { getServerSession } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authOptions } from "@/lib/authOptions";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getUser } from "@/components/actions/user-actions";
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
            blogs: 0,
        },
    };

    const stats = [
        { name: "Ideas", value: user._count.ideas, color: "bg-blue-500" },
        { name: "Votes", value: user._count.votes, color: "bg-green-500" },
        { name: "Comments", value: user._count.comments, color: "bg-yellow-500" },
        { name: "Purchases", value: user._count.payments, color: "bg-orange-500" },
        { name: "Blogs", value: user._count.blogs, color: "bg-purple-500" },
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
                {/* Stats Cards */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {stats.map((stat) => (
                                <div key={stat.name} className="flex flex-col items-center p-4 rounded-lg border">
                                    <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center text-white mb-2`}>
                                        <span className="text-xl font-bold">{stat.value}</span>
                                    </div>
                                    <span className="text-sm font-medium">{stat.name}</span>
                                </div>
                            ))}
                        </div>
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
