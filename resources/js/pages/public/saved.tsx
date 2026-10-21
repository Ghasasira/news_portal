import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import PublicLayout from '@/layouts/public-layout';
import { Article, Category, PaginatedData } from '@/types/news';
import { Bookmark, Clock, Trash2, ArrowRight } from 'lucide-react';
import { LocalBookmark } from '@/hooks/use-bookmarks';

interface Props {
    articles: PaginatedData<Article>;
    categories: Category[];
}

export default function SavedArticlesPage({ articles, categories }: Props) {
    const { auth } = usePage().props as unknown as { auth?: { user?: { name: string }; reader?: { name: string } } };
    const isLoggedIn = Boolean(auth?.reader || auth?.user);

    const [localBookmarks, setLocalBookmarks] = useState<LocalBookmark[]>([]);

    useEffect(() => {
        const loadLocal = () => {
            try {
                const stored = localStorage.getItem('newsportal_guest_bookmarks');
                if (stored) {
                    setLocalBookmarks(JSON.parse(stored));
                } else {
                    setLocalBookmarks([]);
                }
            } catch {
                setLocalBookmarks([]);
            }
        };

        loadLocal();
        window.addEventListener('bookmarks-updated', loadLocal);
        return () => window.removeEventListener('bookmarks-updated', loadLocal);
    }, []);

    const removeServerBookmark = (articleId: number) => {
        router.post(`/articles/${articleId}/bookmark`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Removed from bookmarks'),
        });
    };

    const removeLocalBookmark = (articleId: number) => {
        try {
            const next = localBookmarks.filter(b => b.id !== articleId);
            localStorage.setItem('newsportal_guest_bookmarks', JSON.stringify(next));
            setLocalBookmarks(next);
            toast.success('Removed from device bookmarks');
        } catch {}
    };

    const hasServerArticles = articles?.data && articles.data.length > 0;
    const hasLocalArticles = localBookmarks.length > 0;
    const hasAny = hasServerArticles || hasLocalArticles;

    return (
        <PublicLayout categories={categories}>
            <Head title="Saved Bookmarks | NEWSPORTAL" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                <div className="border-b border-slate-200 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                            <Bookmark className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Personal Reading List</span>
                            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900">
                                Saved Bookmarks
                            </h1>
                        </div>
                    </div>

                    {!isLoggedIn && (
                        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                            <span>Saved to this device.</span>
                            <Link href="/reader/login" className="font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">
                                Sign in to sync <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    )}
                </div>

                {hasAny ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Server saved articles */}
                        {hasServerArticles && articles.data.map((art) => (
                            <div
                                key={`server-${art.id}`}
                                className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-3 shadow-xs space-y-3 flex flex-col justify-between"
                            >
                                <Link href={`/${art.category?.slug}/${art.slug}`} className="space-y-2 block">
                                    <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
                                        {art.hero_image_url && (
                                            <img
                                                src={art.hero_image_url}
                                                alt={art.title}
                                                className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                                            />
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                        {art.category?.name}
                                    </span>
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                                        {art.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 line-clamp-2">
                                        {art.standfirst}
                                    </p>
                                </Link>

                                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {art.reading_time_minutes} min read
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeServerBookmark(art.id)}
                                        className="text-slate-400 hover:text-rose-600 transition flex items-center gap-1 text-[11px]"
                                        title="Remove bookmark"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Local guest saved articles */}
                        {!isLoggedIn && localBookmarks.map((art) => (
                            <div
                                key={`local-${art.id}`}
                                className="group bg-white rounded-xl border border-slate-200 hover:border-slate-300 p-3 shadow-xs space-y-3 flex flex-col justify-between"
                            >
                                <Link href={`/${art.category?.slug || 'technology'}/${art.slug}`} className="space-y-2 block">
                                    <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
                                        {art.hero_image_url && (
                                            <img
                                                src={art.hero_image_url}
                                                alt={art.title}
                                                className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                                            />
                                        )}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                        {art.category?.name || 'News'}
                                    </span>
                                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                                        {art.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 line-clamp-2">
                                        {art.standfirst}
                                    </p>
                                </Link>

                                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {art.reading_time_minutes} min read
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeLocalBookmark(art.id)}
                                        className="text-slate-400 hover:text-rose-600 transition flex items-center gap-1 text-[11px]"
                                        title="Remove bookmark"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" /> Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 text-slate-500 space-y-3 bg-white rounded-2xl border border-slate-200 p-8">
                        <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="font-semibold text-slate-800">Your reading list is empty.</p>
                        <p className="text-xs max-w-sm mx-auto text-slate-500">
                            Click the bookmark icon on any article to save it for offline or later reading.
                        </p>
                        <Link
                            href="/"
                            className="inline-block mt-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                        >
                            Explore Latest Stories
                        </Link>
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
