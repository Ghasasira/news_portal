import { useState, type ReactNode } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { toast } from 'sonner';
import { WeatherWidget } from '@/components/weather-widget';
import { SubscribeModal } from '@/components/subscribe-modal';
import { 
    Search, 
    Bookmark, 
    Sun, 
    Cloud, 
    Rss, 
    Bot, 
    Menu, 
    X, 
    ChevronRight, 
    ShieldAlert, 
    Flame,
    Home as HomeIcon,
    Compass,
    User as UserIcon,
    ArrowUpRight
} from 'lucide-react';
import { Category, Article } from '@/types/news';

interface Props {
    children: ReactNode;
    categories?: Category[];
    breakingNews?: Article | null;
}

export default function PublicLayout({ children, categories = [], breakingNews }: Props) {
    const { auth } = usePage().props as unknown as { auth?: { user?: { name: string; role: string } } };
    const [searchQuery, setSearchQuery] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [subscribeModalOpen, setSubscribeModalOpen] = useState(false);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get('/search', { q: searchQuery.trim() });
        }
    };

    const isStaff = auth?.user && ['super_admin', 'chief_editor', 'section_editor', 'author', 'contributor'].includes(auth.user.role);

    return (
        <div className="min-h-screen bg-[#FDFDFC] text-slate-900 flex flex-col font-sans antialiased selection:bg-blue-600 selection:text-white">
            {/* 1. TOP UTILITY BAR */}
            <div className="border-b border-slate-200 bg-slate-900 text-slate-300 text-xs py-2 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 text-slate-400">
                        <span className="font-medium text-slate-200">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <WeatherWidget />
                        <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-400">
                            <Flame className="w-3.5 h-3.5 text-rose-400" />
                            Frontier AI Summit
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3">
                            <a 
                                href="/feed" 
                                target="_blank" 
                                className="hover:text-white transition flex items-center gap-1 text-[11px]"
                                title="RSS 2.0 Feed"
                            >
                                <Rss className="w-3 h-3 text-amber-500" /> RSS
                            </a>
                            <a 
                                href="/llms.txt" 
                                target="_blank" 
                                className="hover:text-white transition flex items-center gap-1 text-[11px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-blue-400"
                                title="AEO/GEO Machine Endpoint"
                            >
                                <Bot className="w-3 h-3" /> llms.txt
                            </a>
                        </div>

                        {auth?.user ? (
                            <div className="flex items-center gap-3 pl-3 border-l border-slate-700">
                                <Link href="/saved" className="hover:text-white transition flex items-center gap-1">
                                    <Bookmark className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Saved</span>
                                </Link>
                                <Link href="/settings/profile" className="font-medium text-slate-200 hover:text-white transition">
                                    {auth.user.name}
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 pl-3 border-l border-slate-700">
                                <Link href="/saved" className="hover:text-white transition flex items-center gap-1">
                                    <Bookmark className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Saved</span>
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setSubscribeModalOpen(true)}
                                    className="bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-0.5 rounded font-medium transition cursor-pointer"
                                >
                                    Subscribe
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 2. MAIN HEADER */}
            <header className="border-b border-slate-200 bg-white sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <button 
                            type="button" 
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>

                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-black text-lg tracking-tighter shadow-sm group-hover:bg-blue-700 transition">
                                N
                            </div>
                            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 font-serif">
                                NEWSPORTAL
                            </span>
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md relative">
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search news, topics, authors..."
                            className="w-full bg-slate-100 border-none rounded-full pl-10 pr-4 py-2 text-sm focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
                    </form>

                    {/* Header CTAs */}
                    <div className="flex items-center gap-3">
                        <Link 
                            href="/search" 
                            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
                        >
                            <Search className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/saved"
                            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
                        >
                            <Bookmark className="w-3.5 h-3.5 text-blue-600" />
                            Bookmarks
                        </Link>
                    </div>
                </div>

                {/* 3. HORIZONTAL CATEGORY NAVIGATION BAR */}
                <nav className="border-t border-slate-100 bg-white overflow-x-auto scrollbar-none">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 py-2">
                        <Link 
                            href="/" 
                            className="px-3 py-1 text-xs sm:text-sm font-semibold rounded text-slate-800 hover:bg-slate-100 transition shrink-0"
                        >
                            Latest
                        </Link>
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/${cat.slug}`}
                                className="px-3 py-1 text-xs sm:text-sm font-medium rounded text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition shrink-0"
                            >
                                {cat.name}
                            </Link>
                        ))}
                    </div>
                </nav>

                {/* 4. BREAKING NEWS STRIP */}
                {breakingNews && (
                    <div className="bg-rose-600 text-white text-xs px-4 py-2 flex items-center gap-3">
                        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <span className="bg-white text-rose-700 font-extrabold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded shrink-0 flex items-center gap-1">
                                    <ShieldAlert className="w-3 h-3" /> BREAKING
                                </span>
                                <Link 
                                    href={`/${breakingNews.category?.slug}/${breakingNews.slug}`}
                                    className="font-medium hover:underline truncate"
                                >
                                    {breakingNews.title}
                                </Link>
                            </div>
                            <Link 
                                href={`/${breakingNews.category?.slug}/${breakingNews.slug}`}
                                className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-rose-100 hover:text-white shrink-0"
                            >
                                Read Story <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                )}
            </header>

            {/* Mobile Drawer Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 lg:hidden" onClick={() => setMobileMenuOpen(false)}>
                    <div className="w-4/5 max-w-sm bg-white h-full p-6 shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                            <span className="font-serif font-black text-xl text-slate-950">NEWSPORTAL</span>
                            <button onClick={() => setMobileMenuOpen(false)} className="p-1 text-slate-500">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="py-4 space-y-1">
                            <Link href="/" className="block px-3 py-2 text-sm font-semibold text-slate-900 rounded-md hover:bg-slate-100">
                                Latest News
                            </Link>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    href={`/${cat.slug}`}
                                    className="block px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-100"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                        </div>
                        <div className="pt-4 border-t border-slate-200 space-y-2">
                            <Link href="/saved" className="block px-3 py-2 text-sm font-medium text-slate-700 rounded-md hover:bg-slate-100">
                                Saved Bookmarks
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <main className="flex-1 pb-16 lg:pb-0">
                {children}
            </main>

            {/* FOOTER */}
            <footer className="bg-slate-950 text-slate-400 text-sm mt-16 border-t border-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
                        {/* Column 1: Brand & Bio */}
                        <div className="lg:col-span-2 space-y-4">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-black text-lg">
                                    N
                                </div>
                                <span className="text-2xl font-black tracking-tight text-white font-serif">NEWSPORTAL</span>
                            </div>
                            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
                                Independent, high-trust journalism delivering continuous analysis on global geopolitics, frontier computing, clean technologies, and financial markets.
                            </p>
                            <div className="pt-2 flex items-center gap-3 text-xs">
                                <a href="/feed" target="_blank" className="hover:text-white flex items-center gap-1">
                                    <Rss className="w-3.5 h-3.5 text-amber-500" /> RSS Feed
                                </a>
                                <span>•</span>
                                <a href="/sitemaps/news.xml" target="_blank" className="hover:text-white">
                                    News Sitemap
                                </a>
                                <span>•</span>
                                <a href="/llms.txt" target="_blank" className="text-blue-400 hover:text-blue-300">
                                    llms.txt (GEO Index)
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Sections */}
                        <div>
                            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Editorial Desks</h4>
                            <ul className="space-y-2.5 text-xs">
                                {categories.slice(0, 5).map((cat) => (
                                    <li key={cat.id}>
                                        <Link href={`/${cat.slug}`} className="hover:text-white transition">
                                            {cat.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Trust & Governance */}
                        <div>
                            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Trust & Ethics</h4>
                            <ul className="space-y-2.5 text-xs">
                                <li><a href="#" className="hover:text-white">Editorial Guidelines</a></li>
                                <li><a href="#" className="hover:text-white">Fact-Checking Policy</a></li>
                                <li><a href="#" className="hover:text-white">Corrections Policy</a></li>
                                <li><a href="#" className="hover:text-white">AI & AEO Ethics Code</a></li>
                                <li><a href="#" className="hover:text-white">Whistleblower Line</a></li>
                                <li className="pt-2 border-t border-slate-900">
                                    <Link 
                                        href="/cms" 
                                        className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1.5 transition"
                                    >
                                        <span>Newsroom CMS Login</span>
                                        <span className="text-[10px] bg-blue-900/50 text-blue-300 px-1.5 py-0.2 rounded font-mono">Staff</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Column 4: Newsletter Box */}
                        <div>
                            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Morning Dispatch</h4>
                            <p className="text-slate-400 text-xs mb-3">
                                Get our curated briefing on international security and frontier technology delivered daily.
                            </p>
                            <form 
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const form = e.currentTarget;
                                    const input = (form.elements.namedItem('email') as HTMLInputElement).value;
                                    router.post('/newsletter/subscribe', { email: input }, {
                                        preserveScroll: true,
                                        onSuccess: () => {
                                            toast.success('Thank you for subscribing to our morning brief!');
                                            form.reset();
                                        },
                                    });
                                }}
                                className="space-y-2"
                            >
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="your.email@example.com"
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-600"
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 rounded transition cursor-pointer"
                                >
                                    Join 140K+ Readers
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="pt-12 mt-12 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
                        <div>
                            © {new Date().getFullYear()} NewsPortal Inc. Built with Laravel 13, React 19 & Inertia SSR. All rights reserved.
                        </div>
                        <div className="flex items-center gap-4">
                            <a href="#" className="hover:text-slate-300">Privacy Notice</a>
                            <a href="#" className="hover:text-slate-300">Terms of Service</a>
                            <a href="/sitemap.xml" target="_blank" className="hover:text-slate-300">Sitemap</a>
                            <span className="text-slate-700">•</span>
                            <Link href="/cms" className="hover:text-slate-300 transition">
                                CMS Login
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Mobile Bottom Navigation Bar */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-slate-200 py-2 px-6 flex items-center justify-around text-slate-600">
                <Link href="/" className="flex flex-col items-center gap-0.5 text-[11px] font-medium hover:text-blue-600">
                    <HomeIcon className="w-5 h-5 text-blue-600" />
                    <span>Home</span>
                </Link>
                <Link href="/search" className="flex flex-col items-center gap-0.5 text-[11px] font-medium hover:text-blue-600">
                    <Compass className="w-5 h-5" />
                    <span>Discover</span>
                </Link>
                <Link href="/saved" className="flex flex-col items-center gap-0.5 text-[11px] font-medium hover:text-blue-600">
                    <Bookmark className="w-5 h-5" />
                    <span>Saved</span>
                </Link>
                <button
                    type="button"
                    onClick={() => setSubscribeModalOpen(true)}
                    className="flex flex-col items-center gap-0.5 text-[11px] font-medium text-blue-600 cursor-pointer"
                >
                    <UserIcon className="w-5 h-5 text-blue-600" />
                    <span>Subscribe</span>
                </button>
            </div>

            {/* Global Subscribe Modal */}
            <SubscribeModal 
                isOpen={subscribeModalOpen} 
                onClose={() => setSubscribeModalOpen(false)} 
            />
        </div>
    );
}
