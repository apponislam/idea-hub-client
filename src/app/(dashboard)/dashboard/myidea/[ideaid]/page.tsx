import { cookies } from "next/headers";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, MoreVertical } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DeleteIdeaButton } from "@/components/delete-idea-button";

interface Idea {
    id: string;
    title: string;
    problemStatement: string;
    proposedSolution: string;
    description: string;
    images: string[];
    status: string;
    isPaid: boolean;
    price: number | null;
    rejectionFeedback: string | null;
    createdAt: string;
    updatedAt: string;
    categories: {
        category: {
            id: string;
            name: string;
        };
    }[];
    creator: {
        id: string;
        name: string;
        email: string;
    };
    _count: {
        votes: number;
        comments: number;
    };
}

async function getIdea(ideaId: string) {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;

    const res = await fetch(`http://localhost:5000/api/v1/idea/my-ideas/${ideaId}`, {
        headers: {
            Cookie: `next-auth.session-token=${sessionToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch idea");
    return res.json();
}

export default async function IdeaPage({ params }: { params: { ideaid: string } }) {
    let idea: Idea | null = null;

    try {
        const response = await getIdea(params.ideaid);
        idea = response.data;
    } catch (error) {
        console.log(error);
        return (
            <div className="container mx-auto py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/dashboard/myidea">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Error Loading Idea</h1>
                </div>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">Could not load the requested idea.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!idea) {
        return (
            <div className="container mx-auto py-8">
                <div className="flex items-center gap-4 mb-6">
                    <Link href="/dashboard/myidea">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold">Idea Not Found</h1>
                </div>
                <Card>
                    <CardContent className="p-6 text-center">
                        <p className="text-muted-foreground">The idea you`&apos;`re looking for does not exist.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const getStatusBadgeVariant = () => {
        switch (idea?.status) {
            case "APPROVED":
                return "default";
            case "REJECTED":
                return "destructive";
            case "PENDING":
                return "secondary";
            case "UNDER_REVIEW":
                return "outline";
            default:
                return "secondary";
        }
    };

    return (
        <div className="container mx-auto py-8 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/myidea">
                        <Button variant="ghost" size="icon">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight">{idea.title}</h1>
                    <Badge variant={getStatusBadgeVariant()}>{idea.status.replace("_", " ")}</Badge>
                    {idea.isPaid && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                            ${idea.price?.toFixed(2)}
                        </Badge>
                    )}
                </div>

                {idea.status === "APPROVED" || (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <Link href={`/dashboard/myidea/${idea.id}/edit`}>
                                <DropdownMenuItem className="cursor-pointer">
                                    <Edit className="mr-2 h-4 w-4" />
                                    <span>Edit Idea</span>
                                </DropdownMenuItem>
                            </Link>
                            <DeleteIdeaButton id={idea.id} asDropdownItem />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Problem Statement</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{idea.problemStatement}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Proposed Solution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{idea.proposedSolution}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Detailed Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-line">{idea.description}</p>
                        </CardContent>
                    </Card>

                    {/* Rejection Feedback Card - Only shown when status is REJECTED */}
                    {idea.status === "REJECTED" && idea.rejectionFeedback && (
                        <Card className="border-red-200 bg-red-50">
                            <CardHeader>
                                <CardTitle className="text-red-600">Rejection Feedback</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-red-700">{idea.rejectionFeedback}</p>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Idea Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${idea.creator.name}`} />
                                    <AvatarFallback>{idea.creator.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{idea.creator.name}</p>
                                    <p className="text-sm text-muted-foreground">{idea.creator.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Created</p>
                                    <p>{format(new Date(idea.createdAt), "MMM d, yyyy")}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Last Updated</p>
                                    <p>{format(new Date(idea.updatedAt), "MMM d, yyyy")}</p>
                                </div>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground">Categories</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {idea.categories.map((cat) => (
                                        <Badge key={cat.category.id} variant="secondary">
                                            {cat.category.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Votes</p>
                                    <p>{idea._count.votes}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Comments</p>
                                    <p>{idea._count.comments}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {idea.images.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Images</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4">
                                    {idea.images.map((image, index) => (
                                        <div key={index} className="relative aspect-video overflow-hidden rounded-lg">
                                            <Image src={image} alt={`Idea visual ${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority={index === 0} />
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {idea.status === "APPROVED" || (
                        <div className="flex gap-4">
                            <Link href={`/dashboard/myidea/${idea.id}/edit`} className="w-full">
                                <Button variant="outline" className="w-full">
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit Idea
                                </Button>
                            </Link>
                            <div className="w-full">
                                <DeleteIdeaButton id={idea.id} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
