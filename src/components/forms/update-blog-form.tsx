"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import { getSingleBlog, updateBlog } from "../actions/blogActions";

const formSchema = z.object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    content: z.string().min(50, "Content must be at least 50 characters"),
    excerpt: z.string().min(10, "Excerpt must be at least 10 characters"),
    coverImage: z.string().url("Please upload a valid image"),
    category: z.string().min(1, "Please select a category"),
    tags: z.array(z.string()).min(1, "Please add at least one tag"),
    seoDescription: z.string().min(10, "SEO description must be at least 10 characters"),
    seoKeywords: z.array(z.string()).min(1, "Please add at least one keyword"),
});

export default function UpdateBlogForm() {
    const router = useRouter();
    const params = useParams<{ blogId: string }>();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            content: "",
            excerpt: "",
            coverImage: "",
            category: "",
            tags: [],
            seoDescription: "",
            seoKeywords: [],
        },
    });

    // Fetch blog data
    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const blog = await getSingleBlog(params.blogId);
                // console.log(response);
                // const blog = response.data as BlogPost2;

                console.log(blog);

                if (blog) {
                    console.log("hii");
                    form.reset({
                        title: blog.title,
                        content: blog.content,
                        excerpt: blog.excerpt,
                        coverImage: blog.coverImage,
                        category: blog.category,
                        tags: blog.tags,
                        seoDescription: blog.seo.description,
                        seoKeywords: blog.seo.keywords,
                    });
                }
            } catch (error) {
                console.log(error);
                toast.error("Failed to load blog data");
                router.push("/dashboard/myblogs");
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlog();
    }, [params.blogId, form, router]);

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
            form.setValue("coverImage", data.secure_url);
            event.target.value = "";
        } catch (error) {
            console.log(error);
            toast.error("Image upload failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const removeImage = () => {
        form.setValue("coverImage", "");
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const blogData = {
                title: values.title,
                content: values.content,
                excerpt: values.excerpt,
                coverImage: values.coverImage,
                category: values.category,
                tags: values.tags,
                seo: {
                    description: values.seoDescription,
                    keywords: values.seoKeywords,
                },
            };

            await updateBlog(params.blogId, blogData);

            toast.success("Blog updated successfully!");
            router.push("/dashboard/myblogs");
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Failed to update blog");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 max-w-4xl">
            <div className="flex items-center gap-4 mb-6">
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back</span>
                </Button>
                <h1 className="text-3xl font-bold">Update Blog Post</h1>
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
                                    <Input placeholder="Enter your blog title" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Content Field */}
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Content</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Write your blog content here..." className="min-h-[300px]" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Excerpt Field */}
                    <FormField
                        control={form.control}
                        name="excerpt"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Excerpt</FormLabel>
                                <FormControl>
                                    <Input placeholder="A short summary of your blog post" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Cover Image Upload */}
                    <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cover Image</FormLabel>
                                <FormControl>
                                    <div className="flex flex-col gap-2">
                                        <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={isUploading} />
                                        {field.value && (
                                            <div className="relative group">
                                                <div className="relative h-64 w-full rounded-md overflow-hidden border">
                                                    <Image src={field.value} alt="Blog cover preview" fill className="object-cover" />
                                                </div>
                                                <Button type="button" variant="destructive" size="sm" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={removeImage}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category Field */}
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="Web Development">Web Development</SelectItem>
                                        <SelectItem value="Mobile Development">Mobile Development</SelectItem>
                                        <SelectItem value="DevOps">DevOps</SelectItem>
                                        <SelectItem value="AI/ML">AI/ML</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Tags Field */}
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Enter tags separated by commas (e.g., javascript, webdev, react)"
                                        onChange={(e) => {
                                            const tags = e.target.value.split(",").map((tag) => tag.trim());
                                            field.onChange(tags);
                                        }}
                                        value={field.value?.join(", ")}
                                    />
                                </FormControl>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {field.value?.map((tag, index) => (
                                        <span key={index} className="bg-secondary px-3 py-1 rounded-full text-sm">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* SEO Section */}
                    <div className="space-y-4 p-4 border rounded-lg">
                        <h3 className="font-medium text-lg">SEO Settings</h3>

                        <FormField
                            control={form.control}
                            name="seoDescription"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Meta Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="A compelling description for search engines (150-160 characters recommended)" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="seoKeywords"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Keywords</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Important keywords separated by commas"
                                            onChange={(e) => {
                                                const keywords = e.target.value.split(",").map((kw) => kw.trim());
                                                field.onChange(keywords);
                                            }}
                                            value={field.value?.join(", ")}
                                        />
                                    </FormControl>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {field.value?.map((keyword, index) => (
                                            <span key={index} className="bg-secondary px-3 py-1 rounded-full text-sm">
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => router.push("/dashboard/myblogs")}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Blog
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
