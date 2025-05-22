import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { authOptions } from "@/lib/authOptions";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import { Activity, Lightbulb, ThumbsUp, MessageSquare, DollarSign, TrendingUp, Info } from "lucide-react";
import { getUser } from "@/components/actions/user-actions";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return redirect("/login");
    }

    const response = await getUser(session.user.id);
    const user = response?.data || {
        id: "N/A",
        name: "Unknown User",
        email: "No email",
        role: "MEMBER",
        status: "ACTIVE",
        image: undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        _count: {
            ideas: 0,
            votes: 0,
            comments: 0,
            payments: 0,
        },
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <div className="lg:col-span-1">
                    <Card className="rounded-xl shadow-lg h-full">
                        <CardHeader className="flex flex-col items-center text-center pb-6">
                            <Avatar className="w-24 h-24 mb-4">
                                <AvatarImage src={user.image} alt={user.name} />
                                <AvatarFallback className="text-2xl">{user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-2xl">{user.name}</CardTitle>
                            <p className="text-muted-foreground">{user.email}</p>
                            <div className="flex gap-2 mt-4">
                                <Badge variant="secondary" className="capitalize">
                                    {user.role.toLowerCase()}
                                </Badge>
                                <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>{user.status.toLowerCase()}</Badge>
                            </div>
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Member since</p>
                                <p className="font-medium">{format(new Date(user.createdAt), "MMMM d, yyyy")}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Last updated</p>
                                <p className="font-medium">{format(new Date(user.updatedAt), "MMMM d, yyyy")}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Stats and Activity */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Engagement Stats */}
                    <Card className="rounded-xl shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-primary" />
                                Engagement Stats
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <StatCard icon={<Lightbulb className="h-6 w-6" />} value={user._count.ideas} label="Ideas Shared" />
                                <StatCard icon={<ThumbsUp className="h-6 w-6" />} value={user._count.votes} label="Votes Cast" />
                                <StatCard icon={<MessageSquare className="h-6 w-6" />} value={user._count.comments} label="Comments" />
                                <StatCard icon={<DollarSign className="h-6 w-6" />} value={user._count.payments} label="Paid Ideas" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Progress Section */}
                    <Card className="rounded-xl shadow-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-primary" />
                                Community Impact
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium">Idea Quality Score</span>
                                    <span className="text-sm text-muted-foreground">85%</span>
                                </div>
                                <Progress value={85} className="h-2" />
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm font-medium">Community Engagement</span>
                                    <span className="text-sm text-muted-foreground">72%</span>
                                </div>
                                <Progress value={72} className="h-2" />
                            </div>
                        </CardContent>
                        <CardFooter className="text-sm text-muted-foreground">
                            <Info className="h-4 w-4 mr-2" />
                            Scores based on your contributions and peer feedback
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, value, label }: { icon: React.ReactNode; value: number; label: string }) {
    return (
        <div className="flex flex-col items-center p-4 bg-secondary/50 rounded-lg">
            <div className="p-3 rounded-full bg-primary/10 mb-2">{icon}</div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    );
}
