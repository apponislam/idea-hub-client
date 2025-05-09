"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    problemStatement: z.string().min(20, "Problem statement must be at least 20 characters"),
    proposedSolution: z.string().min(20, "Solution must be at least 20 characters"),
    description: z.string().min(50, "Description must be at least 50 characters"),
    images: z.array(z.string()).min(1, "At least one image is required"),
    isPaid: z.boolean(),
    price: z
        .number()
        .nullable()
        .refine((val) => val === null || val >= 0, {
            message: "Price must be positive or null",
        }),
    categoryIds: z.array(z.string()).min(1, "Select at least one category"),
    status: z.enum(["DRAFT", "PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"]),
});

type FormValues = z.infer<typeof formSchema>;

interface UpdateIdeaFormProps {
    ideaId: string;
    defaultValues: Partial<FormValues>;
    categories: {
        id: string;
        name: string;
    }[];
    isAdmin?: boolean;
}

export default function UpdateIdeaForm({ ideaId, defaultValues, categories, isAdmin = false }: UpdateIdeaFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            problemStatement: "",
            proposedSolution: "",
            description: "",
            images: [],
            isPaid: false,
            price: null,
            categoryIds: [],
            status: "DRAFT",
            ...defaultValues,
        },
    });

    const currentStatus = form.watch("status");

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
            form.setValue("images", [...form.getValues("images"), data.secure_url]);
        } catch (error) {
            console.log(error);
            toast.error("Couldn't upload image, please try again");
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);

        const sanitizedValues = { ...values, description: values.description.trim() };
        console.log(values);

        try {
            const response = await fetch(`/api/idea/update/${ideaId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(sanitizedValues),
            });

            console.log(response);

            if (!response.ok) throw new Error("Failed to update idea");

            toast.success("Idea updated successfully!");
            router.push(`/dashboard/myidea/${ideaId}`);
            router.refresh();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getAvailableStatuses = () => {
        if (isAdmin) {
            // Admin can change to any status except DRAFT
            return ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];
        }
        // Regular users can only move from DRAFT to PENDING
        return currentStatus === "DRAFT" ? ["DRAFT", "PENDING"] : [currentStatus];
    };

    const availableStatuses = getAvailableStatuses();

    return (
        <div className="container mx-auto py-8">
            <div className="flex items-center gap-4 mb-6">
                <Link href={`/dashboard/myidea/${ideaId}`}>
                    <Button variant="ghost" size="icon">
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold">Edit Idea</h1>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Title Field */}
                    <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Your innovative idea title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Problem Statement */}
                    <FormField
                        control={form.control}
                        name="problemStatement"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Problem Statement</FormLabel>
                                <FormControl>
                                    <Textarea rows={5} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Proposed Solution */}
                    <FormField
                        control={form.control}
                        name="proposedSolution"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Proposed Solution</FormLabel>
                                <FormControl>
                                    <Textarea rows={5} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Detailed Description</FormLabel>
                                <FormControl>
                                    <Textarea rows={8} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Images */}
                    <FormField
                        control={form.control}
                        name="images"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <div className="flex flex-col gap-2">
                                        <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                        <div className="flex flex-wrap gap-2">
                                            {field.value.map((image, index) => (
                                                <div key={index} className="relative h-20 w-20">
                                                    <Image src={image} alt={`Preview ${index}`} fill className="object-cover rounded" sizes="80px" />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            form.setValue(
                                                                "images",
                                                                field.value.filter((_, i) => i !== index)
                                                            )
                                                        }
                                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Paid Idea Toggle */}
                    <div className="flex items-center gap-4">
                        <FormField
                            control={form.control}
                            name="isPaid"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-2">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel>Paid Idea</FormLabel>
                                </FormItem>
                            )}
                        />

                        {form.watch("isPaid") && (
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="Price in USD"
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    field.onChange(value === "" ? null : Number(value));
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                    </div>

                    {/* Categories */}
                    <FormField
                        control={form.control}
                        name="categoryIds"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Categories</FormLabel>
                                <Select
                                    onValueChange={(value) => {
                                        if (!field.value.includes(value)) {
                                            form.setValue("categoryIds", [...field.value, value]);
                                        }
                                    }}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {field.value.map((categoryId) => {
                                        const category = categories.find((c) => c.id === categoryId);
                                        return (
                                            <div key={categoryId} className="bg-secondary px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                                {category?.name}
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        form.setValue(
                                                            "categoryIds",
                                                            field.value.filter((id) => id !== categoryId)
                                                        )
                                                    }
                                                    className="text-muted-foreground hover:text-foreground"
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Status Field */}
                    {(isAdmin || currentStatus === "DRAFT") && (
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value} disabled={!isAdmin && currentStatus !== "DRAFT"}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableStatuses.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status.replace("_", " ")}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    )}

                    {/* Submit Buttons */}
                    <div className="flex gap-4">
                        {!isAdmin && currentStatus === "DRAFT" && (
                            <>
                                <Button type="submit" variant="outline" onClick={() => form.setValue("status", "DRAFT")} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Save Draft
                                </Button>
                                <Button type="submit" onClick={() => form.setValue("status", "PENDING")} disabled={isSubmitting}>
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Submit for Review
                                </Button>
                            </>
                        )}

                        {(isAdmin || currentStatus !== "DRAFT") && (
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isAdmin ? "Update Status" : "Update Idea"}
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
        </div>
    );
}
