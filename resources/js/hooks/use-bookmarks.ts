import { useState, useEffect } from 'react';
import { router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { Article } from '@/types/news';

const STORAGE_KEY = 'newsportal_guest_bookmarks';

export interface LocalBookmark {
    id: number;
    title: string;
    slug: string;
    standfirst: string | null;
    hero_image_url: string | null;
    reading_time_minutes: number;
    category?: { name: string; slug: string };
    published_at: string | null;
}

export function useBookmarks(article?: Article | null) {
    const { auth } = usePage().props as unknown as { auth?: { user?: { id: number; name: string } } };
    const isLoggedIn = Boolean(auth?.user);

    const [isSaved, setIsSaved] = useState(false);

    // Load initial state
    useEffect(() => {
        if (!article) return;

        if (isLoggedIn) {
            // When logged in, parent page passes isSaved or we check via props
            return;
        }

        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const list: LocalBookmark[] = JSON.parse(stored);
                setIsSaved(list.some(b => b.id === article.id));
            }
        } catch {}
    }, [article?.id, isLoggedIn]);

    const toggle = (targetArticle: Article | LocalBookmark) => {
        if (isLoggedIn) {
            setIsSaved(!isSaved);
            router.post(
                `/articles/${targetArticle.id}/bookmark`,
                {},
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        toast.success(isSaved ? 'Bookmark removed' : 'Saved to your bookmarks');
                    },
                    onError: () => {
                        toast.error('Failed to update bookmark.');
                    },
                }
            );
            return;
        }

        // Guest mode using localStorage
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            let list: LocalBookmark[] = stored ? JSON.parse(stored) : [];

            const exists = list.some(b => b.id === targetArticle.id);
            if (exists) {
                list = list.filter(b => b.id !== targetArticle.id);
                setIsSaved(false);
                toast.success('Article removed from your saved list');
            } else {
                list.unshift({
                    id: targetArticle.id,
                    title: targetArticle.title,
                    slug: targetArticle.slug,
                    standfirst: targetArticle.standfirst ?? null,
                    hero_image_url: targetArticle.hero_image_url ?? null,
                    reading_time_minutes: targetArticle.reading_time_minutes || 3,
                    category: targetArticle.category ? {
                        name: targetArticle.category.name,
                        slug: targetArticle.category.slug,
                    } : undefined,
                    published_at: targetArticle.published_at ?? null,
                });
                setIsSaved(true);
                toast.success('Article saved to your device bookmarks');
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
            // Trigger storage event so other components update
            window.dispatchEvent(new Event('bookmarks-updated'));
        } catch {
            toast.error('Could not save to local storage.');
        }
    };

    return {
        isSaved,
        setIsSaved,
        toggle,
        isLoggedIn,
    };
}
