"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
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
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { createIdea } from "@/app/(dashboard)/dashboard/myidea/create/createIdea";

enum IdeaStatus {
    DRAFT = "DRAFT",
    PENDING = "PENDING",
    UNDER_REVIEW = "UNDER_REVIEW",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

// 1. Define schema with required fields (no .default() here)
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
        .refine((val) => val === null || val >= 0, { message: "Price must be positive or null" }),
    categoryIds: z.array(z.string()).min(1, "Select at least one category"),
    status: z.nativeEnum(IdeaStatus),
});

// 2. Create type for default values
type FormDefaults = {
    images: string[];
    isPaid: boolean;
    price: number | null;
    categoryIds: string[];
    status?: IdeaStatus;
};

// 3. Combine schema and defaults for complete type
type FormValues = z.infer<typeof formSchema> & FormDefaults;

interface Category {
    id: string;
    name: string;
    createdAt: string;
}

export default function CreateIdeaPage({ categories }: { categories: Category[] }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // 4. Define explicit default values
    const defaultValues: FormDefaults = {
        images: [],
        isPaid: false,
        price: null,
        categoryIds: [],
        status: IdeaStatus.DRAFT,
    };

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            problemStatement: "",
            proposedSolution: "",
            description: "",
            ...defaultValues,
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

            const response = await fetch(`https://api.cloudinary.com/v1_1/dqkx3gcnm/image/upload`, {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            form.setValue("images", [...form.getValues("images"), data.secure_url]);

            // Clear the file input after successful upload
            event.target.value = ""; // This is the key fix
        } catch (error) {
            console.error(error);
            toast.error("Couldn't upload image, please try again");
        } finally {
            setIsUploading(false);
        }
    };

    const onSubmitWithStatus =
        (status: IdeaStatus): SubmitHandler<FormValues> =>
        async (values) => {
            setIsSubmitting(true);
            try {
                const { status, ...othervalues } = values;

                console.log(status);
                console.log(othervalues);

                const response = await createIdea(othervalues, status);

                // const data = await response.json();
                console.log(response);

                // if (!response.ok) throw new Error("Failed to create idea");

                toast.success("Idea created successfully!");
                router.push("/dashboard/myidea");
            } catch (error) {
                toast.error(error instanceof Error ? error.message : "An error occurred");
            } finally {
                setIsSubmitting(false);
            }
        };

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Create New Idea</h1>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitWithStatus(IdeaStatus.PENDING))} className="space-y-6">
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
                                                        onClick={() => {
                                                            form.setValue(
                                                                "images",
                                                                field.value.filter((_, i) => i !== index)
                                                            );
                                                        }}
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
                                                    onClick={() => {
                                                        form.setValue(
                                                            "categoryIds",
                                                            field.value.filter((id) => id !== categoryId)
                                                        );
                                                    }}
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

                    {/* Submit Buttons */}
                    <div className="flex gap-4">
                        <Button type="button" variant="outline" onClick={form.handleSubmit(onSubmitWithStatus(IdeaStatus.DRAFT))} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Draft
                        </Button>

                        <Button type="button" onClick={form.handleSubmit(onSubmitWithStatus(IdeaStatus.UNDER_REVIEW))} disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Submit for Review
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
