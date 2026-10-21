import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import CmsLayout from '@/layouts/cms-layout';
import { Article, Category, PaginatedData } from '@/types/news';
import { 
    Search, 
    Filter, 
    PlusCircle, 
    Trash2, 
    Edit, 
    Eye, 
    Clock, 
    ChevronRight,
    Send,
    CheckCircle
} from 'lucide-react';

interface Props {
    articles: PaginatedData<Article>;
    categories: Category[];
    filters: {
        status?: string;
        category?: string;
        search?: string;
    };
}

export default function CmsArticlesIndex({ articles, categories, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [categoryId, setCategoryId] = useState(filters.category || '');

    const handleFilter = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/cms/articles', {
            search: search || undefined,
            status: status || undefined,
            category: categoryId || undefined,
        }, { preserveState: true });
    };

    const handleDelete = (articleId: number) => {
        if (confirm('Are you sure you want to delete this article?')) {
            router.delete(`/cms/articles/${articleId}`);
        }
    };

    const handleTransition = (articleId: number, newStatus: string) => {
        router.post(`/cms/articles/${articleId}/transition`, { status: newStatus });
    };

    return (
        <CmsLayout title="Articles Queue & Editorial Desk">
            <Head title="Articles Queue | NEWSPORTAL CMS" />

            <div className="space-y-6">
                {/* Header Actions & Filter Controls */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs">
                            {['', 'published', 'in_review', 'draft', 'scheduled'].map((st) => (
                                <button
                                    key={st}
                                    type="button"
                                    onClick={() => {
                                        setStatus(st);
                                        router.get('/cms/articles', {
                                            search: search || undefined,
                                            status: st || undefined,
                                            category: categoryId || undefined,
                                        });
                                    }}
                                    className={`px-3 py-1.5 rounded-lg font-semibold transition capitalize ${
                                        status === st
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {st === '' ? 'All Stories' : st.replace('_', ' ')}
                                </button>
                            ))}
                        </div>

                        <Link
                            href="/cms/articles/create"
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition"
                        >
                            <PlusCircle className="w-4 h-4" /> Compose Story
                        </Link>
                    </div>

                    <form onSubmit={handleFilter} className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
                        <div className="relative flex-1 min-w-[200px]">
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search headline or standfirst..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs focus:bg-white focus:ring-1 focus:ring-blue-600 outline-none"
                            />
                            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                        </div>

                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 outline-none"
                        >
                            <option value="">All Categories</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition"
                        >
                            Filter
                        </button>
                    </form>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Headline</th>
                                    <th className="py-3 px-4">Desk</th>
                                    <th className="py-3 px-4">Author</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Format</th>
                                    <th className="py-3 px-4">Reads</th>
                                    <th className="py-3 px-4">Date</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {articles.data.map((art) => (
                                    <tr key={art.id} className="hover:bg-slate-50/60 transition">
                                        <td className="py-3.5 px-4 font-bold text-slate-900 max-w-sm">
                                            <div className="truncate">{art.title}</div>
                                            {art.is_breaking && (
                                                <span className="text-[10px] font-extrabold uppercase text-rose-600 mr-1.5">
                                                    [BREAKING]
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span 
                                                className="font-semibold text-[11px]"
                                                style={{ color: art.category?.accent_color || '#0066FF' }}
                                            >
                                                {art.category?.name}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-700 font-medium">
                                            {art.user?.name}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                                art.status === 'published' 
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : art.status === 'in_review'
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : art.status === 'scheduled'
                                                    ? 'bg-purple-100 text-purple-800'
                                                    : 'bg-slate-100 text-slate-700'
                                            }`}>
                                                {art.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 uppercase text-[10px] font-semibold text-slate-500">
                                            {art.content_type}
                                        </td>
                                        <td className="py-3.5 px-4 font-mono">
                                            {art.view_count.toLocaleString()}
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-400">
                                            {art.published_at 
                                                ? new Date(art.published_at).toLocaleDateString()
                                                : new Date(art.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="py-3.5 px-4 text-right space-x-2">
                                            <Link
                                                href={`/cms/articles/${art.id}/edit`}
                                                className="text-blue-600 hover:text-blue-800 font-semibold"
                                            >
                                                Edit
                                            </Link>
                                            {art.status === 'draft' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleTransition(art.id, 'in_review')}
                                                    className="text-amber-600 hover:text-amber-800 font-semibold"
                                                    title="Submit for Editorial Review"
                                                >
                                                    Submit
                                                </button>
                                            )}
                                            {art.status === 'in_review' && (
                                                <button
                                                    type="button"
                                                    onClick={() => handleTransition(art.id, 'published')}
                                                    className="text-emerald-600 hover:text-emerald-800 font-semibold"
                                                    title="Publish Live"
                                                >
                                                    Publish
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(art.id)}
                                                className="text-rose-500 hover:text-rose-700"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5 inline" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {articles.data.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="py-8 text-center text-slate-400 italic">
                                            No articles found in this queue.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {articles.links.length > 3 && (
                        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                            <span>Showing {articles.data.length} of {articles.total} stories</span>
                            <div className="flex items-center gap-1">
                                {articles.links.map((link, idx) => (
                                    <Link
                                        key={idx}
                                        href={link.url || '#'}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                        className={`px-2.5 py-1 rounded text-xs font-semibold ${
                                            link.active
                                                ? 'bg-blue-600 text-white'
                                                : link.url
                                                ? 'hover:bg-slate-100 text-slate-700'
                                                : 'text-slate-300 pointer-events-none'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CmsLayout>
    );
}
