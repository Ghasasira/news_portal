import { Head, Link, router } from '@inertiajs/react';
import CmsLayout from '@/layouts/cms-layout';
import { Article } from '@/types/news';
import { 
    FileText, 
    CheckCircle2, 
    Clock, 
    FileEdit, 
    Eye, 
    Calendar, 
    ArrowUpRight, 
    AlertCircle,
    ChevronRight,
    Sparkles
} from 'lucide-react';

interface Props {
    stats: {
        totalArticles: number;
        published: number;
        inReview: number;
        drafts: number;
        scheduled: number;
        totalViews: number;
    };
    recentArticles: Article[];
    pendingReviews: Article[];
    userRole: string;
}

export default function CmsDashboard({ stats, recentArticles, pendingReviews, userRole }: Props) {
    const handleQuickPublish = (articleId: number) => {
        router.post(`/cms/articles/${articleId}/transition`, { status: 'published' });
    };

    return (
        <CmsLayout title="Newsroom Command & Editorial Queue">
            <Head title="CMS Dashboard | NEWSPORTAL" />

            <div className="space-y-8">
                {/* 1. KEY METRICS STATS CARDS */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Stories</span>
                        <div className="text-2xl font-black text-slate-900">{stats.totalArticles}</div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Published</span>
                        <div className="text-2xl font-black text-emerald-700">{stats.published}</div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600">In Review</span>
                        <div className="text-2xl font-black text-amber-700">{stats.inReview}</div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Drafts</span>
                        <div className="text-2xl font-black text-slate-700">{stats.drafts}</div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600">Scheduled</span>
                        <div className="text-2xl font-black text-purple-700">{stats.scheduled}</div>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-1">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Total Reads</span>
                        <div className="text-2xl font-black text-blue-700">{stats.totalViews.toLocaleString()}</div>
                    </div>
                </div>

                {/* 2. PENDING EDITORIAL REVIEWS (Workflow Priority) */}
                {pendingReviews.length > 0 && (
                    <div className="bg-white rounded-2xl border border-amber-200 shadow-xs overflow-hidden">
                        <div className="p-5 bg-amber-50/50 border-b border-amber-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-600" />
                                <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                                    Stories Awaiting Editorial Approval ({pendingReviews.length})
                                </h2>
                            </div>
                            <span className="text-xs text-amber-800 font-semibold">Chief & Section Editor Action Required</span>
                        </div>

                        <div className="divide-y divide-slate-100">
                            {pendingReviews.map((art) => (
                                <div key={art.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="space-y-1 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                                {art.category?.name}
                                            </span>
                                            <span className="text-xs text-slate-400">By {art.user?.name}</span>
                                        </div>
                                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                                            {art.title}
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-2 shrink-0">
                                        <Link
                                            href={`/cms/articles/${art.id}/edit`}
                                            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
                                        >
                                            Review Story
                                        </Link>
                                        {['super_admin', 'chief_editor', 'section_editor'].includes(userRole) && (
                                            <button
                                                type="button"
                                                onClick={() => handleQuickPublish(art.id)}
                                                className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition"
                                            >
                                                Approve & Publish
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. RECENT EDITORIAL ACTIVITY TABLE */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                    <div className="p-5 border-b border-slate-200 flex items-center justify-between">
                        <h2 className="font-bold text-slate-900 text-base">
                            Recent Newsroom Activity
                        </h2>
                        <Link
                            href="/cms/articles"
                            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                        >
                            View All Articles <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 text-[11px] uppercase tracking-wider font-bold text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="py-3 px-4">Headline</th>
                                    <th className="py-3 px-4">Category</th>
                                    <th className="py-3 px-4">Author</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className="py-3 px-4">Views</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentArticles.map((art) => (
                                    <tr key={art.id} className="hover:bg-slate-50/60 transition">
                                        <td className="py-3.5 px-4 font-bold text-slate-900 max-w-md truncate">
                                            {art.title}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span 
                                                className="font-semibold text-[11px]"
                                                style={{ color: art.category?.accent_color || '#0066FF' }}
                                            >
                                                {art.category?.name}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 text-slate-700">
                                            {art.user?.name}
                                        </td>
                                        <td className="py-3.5 px-4">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                                art.status === 'published' 
                                                    ? 'bg-emerald-100 text-emerald-800'
                                                    : art.status === 'in_review'
                                                    ? 'bg-amber-100 text-amber-800'
                                                    : 'bg-slate-100 text-slate-700'
                                            }`}>
                                                {art.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-4 font-mono">
                                            {art.view_count.toLocaleString()}
                                        </td>
                                        <td className="py-3.5 px-4 text-right space-x-2">
                                            <Link
                                                href={`/cms/articles/${art.id}/edit`}
                                                className="text-blue-600 hover:text-blue-800 font-semibold"
                                            >
                                                Edit
                                            </Link>
                                            {art.status === 'published' && (
                                                <a
                                                    href={`/${art.category?.slug}/${art.slug}`}
                                                    target="_blank"
                                                    className="text-slate-400 hover:text-slate-600 font-medium"
                                                >
                                                    View
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </CmsLayout>
    );
}
