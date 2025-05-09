"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

// Define form schema
const formSchema = z.object({
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(1, "Password is required"),
});

export function LoginForm() {
    // const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsSubmitting(true);
        try {
            // Use NextAuth's signIn instead of direct fetch
            const result = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
                callbackUrl: "/",
            });

            if (result?.error) {
                throw new Error(result.error);
            }

            // Optional: Store token in localStorage if still needed elsewhere
            // if (result?.url) {
            //     if (result?.data?.accessToken) {
            //         localStorage.setItem("accessToken", session.user.accessToken);
            //     }
            // }

            toast.success("Logged in successfully!");
            window.location.href = result?.url || "/";
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Login failed");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="your@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex items-center justify-between">
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                        Forgot password?
                    </Link>
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                        </>
                    ) : (
                        "Login"
                    )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?
                    <Link href="/register" className="text-primary hover:underline">
                        Register
                    </Link>
                </div>
            </form>
        </Form>
    );
}
