export interface AuthorProfile {
    id: number;
    user_id: number;
    slug: string;
    bio: string | null;
    avatar_url: string | null;
    credentials: string | null;
    beat: string | null;
    social_links: Record<string, string> | null;
    is_verified: boolean;
    user?: User;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    author_profile?: AuthorProfile;
}

export interface Category {
    id: number;
    parent_id: number | null;
    name: string;
    slug: string;
    description: string | null;
    accent_color: string;
    sort_order: number;
    is_visible_in_nav: boolean;
    children?: Category[];
    parent?: Category;
    articles_count?: number;
}

export interface Topic {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    is_featured: boolean;
    faq_json?: Array<{ question: string; answer: string }> | null;
    timeline_json?: Array<{ date: string; title: string; description: string }> | null;
    meta_title?: string | null;
    meta_description?: string | null;
    articles_count?: number;
}

export interface Tag {
    id: number;
    name: string;
    slug: string;
}

export interface ArticleSeo {
    id: number;
    meta_title: string | null;
    meta_description: string | null;
    canonical_url: string | null;
    social_image_url: string | null;
    focus_keyword: string | null;
    score: number;
}

export interface ArticleAiMeta {
    id: number;
    tldr: string | null;
    key_facts: string[] | null;
    five_w_one_h: {
        who?: string;
        what?: string;
        when?: string;
        where?: string;
        why?: string;
        how?: string;
    } | null;
    faq_json: Array<{ question: string; answer: string }> | null;
    aeo_score: number;
}

export interface Comment {
    id: number;
    article_id: number;
    user_id: number | null;
    author_name: string;
    content: string;
    status: string;
    created_at: string;
    user?: User;
}

export interface Article {
    id: number;
    uuid: string;
    title: string;
    slug: string;
    standfirst: string | null;
    body: string;
    content_type: 'news' | 'opinion' | 'analysis' | 'explainer' | 'liveblog' | 'video' | 'sponsored';
    status: 'draft' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'archived';
    primary_category_id: number;
    user_id: number;
    hero_image_url: string | null;
    hero_image_caption: string | null;
    reading_time_minutes: number;
    view_count: number;
    is_breaking: boolean;
    is_featured: boolean;
    is_trending: boolean;
    is_editors_pick: boolean;
    published_at: string | null;
    scheduled_at: string | null;
    created_at: string;
    updated_at: string;
    category?: Category;
    user?: User;
    topics?: Topic[];
    tags?: Tag[];
    seo?: ArticleSeo;
    ai_meta?: ArticleAiMeta;
    comments?: Comment[];
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export interface MediaItem {
    id: number;
    user_id: number | null;
    filename: string;
    original_name: string;
    disk_path: string;
    url: string;
    mime_type: string;
    original_size_bytes: number;
    optimized_size_bytes: number;
    formatted_original_size?: string;
    formatted_optimized_size?: string;
    savings_percentage?: number;
    width: number | null;
    height: number | null;
    alt_text: string | null;
    caption: string | null;
    created_at: string;
    updated_at: string;
    user?: { id: number; name: string };
}


