import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { User } from "lucide-react"; // Import a user icon from Lucide

interface TeamMemberProps {
    name: string;
    role: string;
    bio: string;
    image?: string; // Make image optional
}

export function TeamMember({ name, role, bio, image }: TeamMemberProps) {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="relative h-48 w-full rounded-t-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    {image ? (
                        <Image src={image} alt={name} fill className="object-cover" />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <User className="h-16 w-16" />
                            <span className="mt-2 text-sm">No Image</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <h3 className="font-bold">{name}</h3>
                <p className="text-sm text-emerald-600 mb-2">{role}</p>
                <p className="text-sm text-muted-foreground">{bio}</p>
            </CardContent>
        </Card>
    );
}
