"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { signIn } from "next-auth/react";

export function RegisterForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const registerSchema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters"),
        email: z.string().email("Please enter a valid email"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        image: z.string().optional(),
    });

    const form = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            image: "",
        },
    });

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "apponislam-portfolio");
            formData.append("cloud_name", "dqkx3gcnm");

            const response = await fetch(`https://api.cloudinary.com/v1_1/dqkx3gcnm/image/upload`, { method: "POST", body: formData });

            const data = await response.json();
            form.setValue("image", data.secure_url);
        } catch (error) {
            console.log(error);
            toast.info("Couldn't upload image, please try again");
        } finally {
            setIsUploading(false);
        }
    };

    async function onSubmit(values: z.infer<typeof registerSchema>) {
        setIsSubmitting(true);
        try {
            const res = await fetch("https://idea-hub-server.vercel.app/api/v1/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            // console.log(res);

            // const data = await res.json();
            // console.log(data);

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Registration failed");
            }

            const result = await signIn("credentials", {
                redirect: false,
                email: values.email,
                password: values.password,
                callbackUrl: "/",
            });

            toast.success("Account created successfully");

            window.location.href = result?.url || "/";

            form.reset();
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="john@example.com" {...field} />
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

                <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                        <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} ref={fileInputRef} />
                    </FormControl>
                    {form.watch("image") ? (
                        <div className="mt-2">
                            <Image
                                src={form.watch("image") || "/default-image.jpg"} // Fallback image if undefined
                                alt="Preview"
                                width={80}
                                height={80}
                                className="rounded-full object-cover"
                            />
                        </div>
                    ) : null}
                    <FormMessage />
                </FormItem>

                <Button type="submit" className="w-full" disabled={isSubmitting || isUploading}>
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                        </>
                    ) : (
                        "Register"
                    )}
                </Button>
            </form>
        </Form>
    );
}
