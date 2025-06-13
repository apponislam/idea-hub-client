import { cookies } from "next/headers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ChevronLeft, UserPlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Check, Lock, Trash2, User } from "lucide-react";
import { RoleSelect } from "./role-select";
import { MemberActions } from "./member-actions";

interface Member {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: "MEMBER" | "ADMIN";
    status: "ACTIVE" | "BLOCKED" | "DELECTED";
    createdAt: string;
    lastLogin?: string | null;
}

interface ApiResponse {
    success: boolean;
    message?: string;
    data: Member[];
}

async function getMembers(): Promise<Member[]> {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const res = await fetch("http://localhost:5000/api/v1/user", {
        headers: {
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch members");

    const response: ApiResponse = await res.json();
    return response.data || [];
}

export default async function MembersPage() {
    let members: Member[] = [];

    try {
        members = await getMembers();
        // console.log("Fetched members:", members);
    } catch (error) {
        console.error("Error fetching members:", error);
        return (
            <div className="container mx-auto py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Error Loading Members</h1>
                </div>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">Could not load member data.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getStatusBadgeVariant = (status: Member["status"]) => {
        switch (status) {
            case "ACTIVE":
                return "default";
            case "BLOCKED":
                return "destructive";
            case "DELECTED":
                return "outline";
            default:
                return "secondary";
        }
    };

    const getStatusIcon = (status: Member["status"]) => {
        switch (status) {
            case "ACTIVE":
                return <Check className="h-3 w-3" />;
            case "BLOCKED":
                return <Lock className="h-3 w-3" />;
            case "DELECTED":
                return <Trash2 className="h-3 w-3" />;
            default:
                return null;
        }
    };

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Members Management</h1>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Members ({members.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead>Last Active</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableCell className="flex items-center gap-3 w-40">
                                        <div className="flex-shrink-0">
                                            {member.image ? (
                                                <Image src={member.image} alt={member.name} width={32} height={32} className="h-8 w-8 rounded-full" />
                                            ) : (
                                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                                    <User className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                        <span>{member.name}</span>
                                    </TableCell>
                                    <TableCell>{member.email}</TableCell>
                                    <TableCell>
                                        <RoleSelect userId={member.id} currentRole={member.role} />
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={getStatusBadgeVariant(member.status)} className="flex items-center gap-1 capitalize">
                                            {getStatusIcon(member.status)}
                                            {member.status.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{new Date(member.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{member.lastLogin ? new Date(member.lastLogin).toLocaleString() : "Never"}</TableCell>
                                    <TableCell className="text-right">
                                        <MemberActions member={member} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
