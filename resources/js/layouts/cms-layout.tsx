import { type ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutDashboard, 
    FileText, 
    PlusCircle, 
    Tags, 
    Eye, 
    LogOut, 
    Shield, 
    ChevronRight,
    Sparkles
} from 'lucide-react';

interface Props {
    children: ReactNode;
    title?: string;
}

export default function CmsLayout({ children, title }: Props) {
    const { auth, flash } = usePage().props as unknown as { 
        auth?: { user?: { name: string; role: string; email: string } };
        flash?: { success?: string; error?: string };
    };

    return (
        <div className="min-h-screen bg-slate-100 flex font-sans antialiased text-slate-900">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 border-r border-slate-800 hidden md:flex">
                <div>
                    <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                        <Link href="/cms" className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                                N
                            </div>
                            <div>
                                <span className="font-serif font-black text-base text-white tracking-tight block">
                                    NEWSROOM CMS
                                </span>
                                <span className="text-[10px] text-blue-400 font-semibold uppercase tracking-wider block">
                                    Editorial Desk
                                </span>
                            </div>
                        </Link>
                    </div>

                    <div className="px-3 py-4 space-y-1">
                        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                            Core Navigation
                        </div>
                        <Link
                            href="/cms"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 hover:text-white transition"
                        >
                            <LayoutDashboard className="w-4 h-4 text-blue-400" />
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            href="/cms/articles"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 hover:text-white transition"
                        >
                            <FileText className="w-4 h-4 text-emerald-400" />
                            <span>Articles Queue</span>
                        </Link>
                        <Link
                            href="/cms/articles/create"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 hover:text-white transition"
                        >
                            <PlusCircle className="w-4 h-4 text-amber-400" />
                            <span>Compose Story</span>
                        </Link>
                        <Link
                            href="/cms/taxonomy"
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold hover:bg-slate-800 hover:text-white transition"
                        >
                            <Tags className="w-4 h-4 text-purple-400" />
                            <span>Taxonomy & Hubs</span>
                        </Link>
                    </div>

                    <div className="px-3 py-2 space-y-1 border-t border-slate-800/80">
                        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-blue-400" /> Machine & SEO
                        </div>
                        <a
                            href="/llms.txt"
                            target="_blank"
                            className="flex items-center justify-between px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        >
                            <span>llms.txt Index</span>
                            <ChevronRight className="w-3 h-3 text-slate-600" />
                        </a>
                        <a
                            href="/sitemaps/news.xml"
                            target="_blank"
                            className="flex items-center justify-between px-3 py-1.5 rounded text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        >
                            <span>Google News Sitemap</span>
                            <ChevronRight className="w-3 h-3 text-slate-600" />
                        </a>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-800 space-y-3">
                    <a
                        href="/"
                        target="_blank"
                        className="flex items-center justify-center gap-2 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition"
                    >
                        <Eye className="w-3.5 h-3.5" /> View Live Portal
                    </a>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs uppercase">
                                {auth?.user?.name.slice(0, 2)}
                            </div>
                            <div className="overflow-hidden">
                                <span className="block text-xs font-bold text-white truncate w-24">
                                    {auth?.user?.name}
                                </span>
                                <span className="block text-[10px] text-blue-400 uppercase font-semibold">
                                    {auth?.user?.role.replace('_', ' ')}
                                </span>
                            </div>
                        </div>

                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="p-1.5 text-slate-500 hover:text-rose-400 transition"
                            title="Log out"
                        >
                            <LogOut className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                <header className="bg-white border-b border-slate-200 py-3.5 px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-900 text-base">
                            {title || 'Editorial Dashboard'}
                        </span>
                        {auth?.user && (
                            <span className="bg-slate-100 text-slate-600 text-[10px] uppercase font-bold px-2 py-0.5 rounded border border-slate-200">
                                {auth.user.role.replace('_', ' ')} Mode
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/cms/articles/create"
                            className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition shadow-xs"
                        >
                            <PlusCircle className="w-3.5 h-3.5" /> New Article
                        </Link>
                        <a
                            href="/"
                            target="_blank"
                            className="text-xs text-slate-600 hover:text-slate-900 font-medium px-2 py-1 rounded hover:bg-slate-100 transition hidden sm:inline-flex items-center gap-1"
                        >
                            <Eye className="w-3 h-3" /> Live Site
                        </a>
                    </div>
                </header>

                {flash?.success && (
                    <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-medium flex items-center gap-2">
                        <Shield className="w-4 h-4 text-emerald-600" />
                        {flash.success}
                    </div>
                )}

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
