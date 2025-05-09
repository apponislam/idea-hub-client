"use client";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Shield, User } from "lucide-react";
import { updateUserRole } from "@/components/actions/user-actions";
import { toast } from "sonner";

interface RoleSelectProps {
    userId: string;
    currentRole: "MEMBER" | "ADMIN";
}

export function RoleSelect({ userId, currentRole }: RoleSelectProps) {
    const handleRoleChange = async (newRole: "MEMBER" | "ADMIN") => {
        const result = await updateUserRole(userId, newRole);
        toast.success(result.message);
    };

    const getRoleIcon = (role: "MEMBER" | "ADMIN") => {
        switch (role) {
            case "ADMIN":
                return <Shield className="h-4 w-4" />;
            case "MEMBER":
                return <User className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    return (
        <Select defaultValue={currentRole} onValueChange={handleRoleChange}>
            <SelectTrigger className="w-[120px]">
                <div className="flex items-center gap-2">
                    {getRoleIcon(currentRole)}
                    <span className="capitalize">{currentRole.toLowerCase()}</span>
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="ADMIN">
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Admin
                    </div>
                </SelectItem>
                <SelectItem value="MEMBER">
                    <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Member
                    </div>
                </SelectItem>
            </SelectContent>
        </Select>
    );
}
