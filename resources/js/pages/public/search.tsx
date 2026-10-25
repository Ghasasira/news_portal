import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Article, Category, PaginatedData } from '@/types/news';
import AuthorLink from '@/components/ui/author-link';
import { Search, Filter, Clock } from 'lucide-react';

interface Props {
    query: string;
    selectedCategory: string | null;
    selectedType: string | null;
    results: PaginatedData<Article>;
    categories: Category[];
}

export default function SearchPage({
    query: initialQuery,
    selectedCategory,
    selectedType,
    results,
    categories,
}: Props) {
    const [q, setQ] = useState(initialQuery);
    const [cat, setCat] = useState(selectedCategory || '');
    const [type, setType] = useState(selectedType || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/search', { q, category: cat || undefined, type: type || undefined });
    };

    return (
        <PublicLayout categories={categories}>
            <Head title={`Search Results: ${initialQuery || 'All Articles'} | NEWSPORTAL`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                {/* Search Bar & Filters */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-8">
                    <h1 className="text-2xl font-bold font-serif text-slate-900 mb-4">
                        Search Global Newsroom
                    </h1>
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="relative">
                            <input
                                type="search"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Search by headline, keyword, entity, or analysis..."
                                className="w-full bg-white border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            />
                            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                                <Filter className="w-3.5 h-3.5" /> Filters:
                            </div>

                            <select
                                value={cat}
                                onChange={(e) => setCat(e.target.value)}
                                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                            >
                                <option value="">All Categories</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>

                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none"
                            >
                                <option value="">All Formats</option>
                                <option value="news">News</option>
                                <option value="opinion">Opinion</option>
                                <option value="analysis">Analysis</option>
                                <option value="explainer">Explainer</option>
                            </select>

                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </form>
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-2">
                    <span>Showing {results.total} results {initialQuery && `for "${initialQuery}"`}</span>
                </div>

                {/* Results List */}
                <div className="space-y-6">
                    {results.data.map((article) => (
                        <Link
                            key={article.id}
                            href={`/${article.category?.slug}/${article.slug}`}
                            className="group flex flex-col sm:flex-row gap-5 p-4 rounded-xl border border-slate-100 hover:border-slate-300 bg-white hover:bg-slate-50/50 transition"
                        >
                            <div className="sm:w-48 aspect-video rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                {article.hero_image_url && (
                                    <img
                                        src={article.hero_image_url}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                                    />
                                )}
                            </div>
                            <div className="space-y-1.5 flex-1">
                                <span 
                                    className="text-[10px] font-bold uppercase tracking-wider"
                                    style={{ color: article.category?.accent_color || '#0066FF' }}
                                >
                                    {article.category?.name}
                                </span>
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
                                    {article.title}
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                                    {article.standfirst}
                                </p>
                                <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-1">
                                    <AuthorLink
                                        user={article.user}
                                        authorProfile={article.user?.author_profile}
                                        showAvatar={true}
                                        avatarSize="xs"
                                        textClassName="text-slate-600 font-medium"
                                    />
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {article.reading_time_minutes} min read
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {results.data.length === 0 && (
                        <div className="text-center py-16 text-slate-500 space-y-2">
                            <p className="font-semibold text-slate-800">No articles matched your criteria.</p>
                            <p className="text-xs">Try broader keywords or clear your category filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
