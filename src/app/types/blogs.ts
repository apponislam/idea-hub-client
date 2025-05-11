export interface Author {
    name: string;
    avatar: string;
    bio: string;
}

export interface CoverImage {
    url: string;
    alt: string;
}

export interface SEO {
    description: string;
    keywords: string[];
}

export interface Stats {
    views: number;
    likes: number;
    comments: number;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    author: Author;
    content: string;
    excerpt: string;
    coverImage: CoverImage;
    category: string;
    tags: string[];
    publishedAt: string;
    updatedAt: string;
    stats: Stats;
    readingTime: string;
    seo: SEO;
}

export interface BlogData {
    posts: BlogPost[];
}
