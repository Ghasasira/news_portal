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
    const { auth } = usePage().props as unknown as { 
        auth?: { 
            user?: { name: string; role: string };
            reader?: { name: string; email: string };
        } 
    };
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
    const isAuthenticated = Boolean(auth?.user || auth?.reader);

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
                                <Link href="/cms" className="font-medium text-slate-200 hover:text-white transition text-xs flex items-center gap-1.5">
                                    <span>{auth.user.name}</span>
                                    <span className="bg-blue-600/50 text-blue-200 text-[10px] px-1.5 py-0.2 rounded font-mono">CMS Staff</span>
                                </Link>
                            </div>
                        ) : auth?.reader ? (
                            <div className="flex items-center gap-3 pl-3 border-l border-slate-700">
                                <Link href="/saved" className="hover:text-white transition flex items-center gap-1">
                                    <Bookmark className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                                    <span className="hidden sm:inline">Saved</span>
                                </Link>
                                <span className="font-medium text-slate-200 text-xs">
                                    {auth.reader.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => router.post('/reader/logout')}
                                    className="text-slate-400 hover:text-white text-[11px] transition cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 pl-3 border-l border-slate-700">
                                <Link href="/reader/login" className="hover:text-white transition flex items-center gap-1">
                                    <Bookmark className="w-3.5 h-3.5" />
                                    <span className="hidden sm:inline">Saved</span>
                                </Link>
                                <Link
                                    href="/reader/login"
                                    className="text-slate-300 hover:text-white transition text-[11px]"
                                >
                                    Sign In
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
                            href={auth?.reader ? "/saved" : "/reader/login"}
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
                <div 
                    className="fixed inset-0 z-50 bg-slate-900/60 lg:hidden backdrop-blur-xs transition-opacity duration-200" 
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <div 
                        className="w-4/5 max-w-sm bg-white h-full p-6 shadow-2xl overflow-y-auto flex flex-col justify-between" 
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="space-y-6">
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                                <Link 
                                    href="/" 
                                    onClick={() => setMobileMenuOpen(false)} 
                                    className="flex items-center gap-2"
                                >
                                    <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-black text-base">
                                        N
                                    </div>
                                    <span className="font-serif font-black text-xl text-slate-950">NEWSPORTAL</span>
                                </Link>
                                <button 
                                    type="button"
                                    onClick={() => setMobileMenuOpen(false)} 
                                    className="p-1 text-slate-400 hover:text-slate-700 rounded-md transition cursor-pointer"
                                    aria-label="Close menu"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Mobile Search Bar */}
                            <form 
                                onSubmit={(e) => {
                                    handleSearch(e);
                                    setMobileMenuOpen(false);
                                }} 
                                className="relative"
                            >
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search stories, topics, authors..."
                                    className="w-full bg-slate-100 border-none rounded-xl pl-9 pr-4 py-2 text-xs focus:bg-white focus:ring-2 focus:ring-blue-600 outline-none transition"
                                />
                                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                            </form>

                            {/* Primary Navigation Items (moved from bottom nav bar) */}
                            <div className="space-y-1">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                                    Navigation
                                </span>
                                <Link 
                                    href="/" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-sm font-semibold text-slate-900 rounded-xl hover:bg-slate-100 transition"
                                >
                                    <HomeIcon className="w-4 h-4 text-blue-600" />
                                    <span>Home</span>
                                </Link>
                                <Link 
                                    href="/search" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100 transition"
                                >
                                    <Compass className="w-4 h-4 text-slate-500" />
                                    <span>Discover & Search</span>
                                </Link>
                                <Link 
                                    href={auth?.reader ? "/saved" : "/reader/login"} 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-3 py-2 text-sm font-medium text-slate-700 rounded-xl hover:bg-slate-100 transition"
                                >
                                    <span className="flex items-center gap-3">
                                        <Bookmark className="w-4 h-4 text-blue-600" />
                                        <span>Saved Stories</span>
                                    </span>
                                    {auth?.reader && (
                                        <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                                            Reader
                                        </span>
                                    )}
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setMobileMenuOpen(false);
                                        setSubscribeModalOpen(true);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50/70 hover:bg-blue-100/70 rounded-xl transition cursor-pointer text-left mt-1"
                                >
                                    <UserIcon className="w-4 h-4 text-blue-600" />
                                    <span>Subscribe to Morning Dispatch</span>
                                </button>
                            </div>

                            {/* News Sections & Desks */}
                            <div className="space-y-1 pt-3 border-t border-slate-100">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3">
                                    News Desks
                                </span>
                                <Link 
                                    href="/" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="block px-3 py-1.5 text-xs font-semibold text-slate-800 rounded-lg hover:bg-slate-100 transition"
                                >
                                    Latest Headlines
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.id}
                                        href={`/${cat.slug}`}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block px-3 py-1.5 text-xs font-medium text-slate-600 rounded-lg hover:text-slate-950 hover:bg-slate-100 transition"
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Drawer Bottom / User & Reader State */}
                        <div className="pt-6 border-t border-slate-200 mt-6 space-y-3">
                            {auth?.reader ? (
                                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 text-[11px]">Signed in as</span>
                                        <span className="text-[10px] font-mono uppercase bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded font-semibold">
                                            Reader
                                        </span>
                                    </div>
                                    <div className="font-semibold text-slate-900 text-xs truncate">
                                        {auth.reader.name}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMobileMenuOpen(false);
                                            router.post('/reader/logout');
                                        }}
                                        className="w-full text-center text-xs font-medium text-rose-600 hover:text-rose-700 py-1.5 rounded-lg border border-rose-200 bg-white transition cursor-pointer"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            ) : auth?.user ? (
                                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="text-slate-500 text-[11px]">Newsroom Staff</span>
                                        <span className="text-[10px] font-mono uppercase bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                                            {auth.user.role}
                                        </span>
                                    </div>
                                    <div className="font-semibold text-slate-900 text-xs truncate">
                                        {auth.user.name}
                                    </div>
                                    <Link
                                        href="/cms"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block text-center text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 py-1.5 rounded-lg transition"
                                    >
                                        Open Newsroom CMS
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <Link
                                        href="/reader/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="block text-center text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 py-2 rounded-xl transition"
                                    >
                                        Reader Sign In / Free Account
                                    </Link>
                                </div>
                            )}

                            {/* Machine & Feed Shortcuts */}
                            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 px-1">
                                <a 
                                    href="/feed" 
                                    target="_blank" 
                                    className="hover:text-slate-700 transition flex items-center gap-1"
                                >
                                    <Rss className="w-3 h-3 text-amber-500" /> RSS
                                </a>
                                <a 
                                    href="/llms.txt" 
                                    target="_blank" 
                                    className="hover:text-slate-700 transition flex items-center gap-1"
                                >
                                    <Bot className="w-3 h-3 text-blue-500" /> llms.txt
                                </a>
                                <Link 
                                    href="/cms" 
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="hover:text-slate-700 transition"
                                >
                                    CMS
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MAIN CONTENT AREA */}
            <main className="flex-1">
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

            {/* Global Subscribe Modal */}
            <SubscribeModal 
                isOpen={subscribeModalOpen} 
                onClose={() => setSubscribeModalOpen(false)} 
            />
        </div>
    );
}
