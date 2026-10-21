import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Article, Category, Topic } from '@/types/news';
import { Clock, Play, ArrowRight, TrendingUp, Sparkles, Flame, ChevronRight } from 'lucide-react';

interface Props {
    breakingNews: Article | null;
    leadStory: Article | null;
    trendingArticles: Article[];
    editorsPicks: Article[];
    latestArticles: Article[];
    categoryFeeds: Array<{
        category: Category;
        articles: Article[];
    }>;
    featuredTopics: Topic[];
    categories: Category[];
}

export default function Home({
    breakingNews,
    leadStory,
    trendingArticles,
    editorsPicks,
    latestArticles,
    categoryFeeds,
    featuredTopics,
    categories,
}: Props) {
    return (
        <PublicLayout categories={categories} breakingNews={breakingNews}>
            <Head title="NEWSPORTAL — Continuous Global Intelligence & Editorial Analysis" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-12">
                {/* 1. TOPIC STRIP */}
                {featuredTopics.length > 0 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 text-xs">
                        <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px] shrink-0 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-blue-600" /> Focus Hubs:
                        </span>
                        {featuredTopics.map((topic) => (
                            <Link
                                key={topic.id}
                                href={`/topic/${topic.slug}`}
                                className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 font-medium text-slate-700 transition shrink-0"
                            >
                                #{topic.name}
                            </Link>
                        ))}
                    </div>
                )}

                {/* 2. DESKTOP HERO GRID (2:1 SPLIT) */}
                <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Featured Lead Story (2 columns) */}
                    {leadStory && (
                        <div className="lg:col-span-2 flex flex-col justify-between group">
                            <Link 
                                href={`/${leadStory.category?.slug}/${leadStory.slug}`}
                                className="block relative overflow-hidden rounded-xl aspect-[16/10] bg-slate-100 mb-4 shadow-sm"
                            >
                                {leadStory.hero_image_url && (
                                    <img
                                        src={leadStory.hero_image_url}
                                        alt={leadStory.title}
                                        className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
                                    />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                                
                                <div className="absolute bottom-4 left-4 right-4 text-white">
                                    <span 
                                        className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider mb-2 text-white"
                                        style={{ backgroundColor: leadStory.category?.accent_color || '#0066FF' }}
                                    >
                                        {leadStory.category?.name}
                                    </span>
                                    <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight leading-snug font-serif">
                                        {leadStory.title}
                                    </h1>
                                </div>
                            </Link>

                            <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-4">
                                {leadStory.standfirst}
                            </p>

                            <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
                                <div className="flex items-center gap-2">
                                    {leadStory.user?.author_profile?.avatar_url && (
                                        <img 
                                            src={leadStory.user.author_profile.avatar_url} 
                                            alt={leadStory.user.name} 
                                            className="w-6 h-6 rounded-full object-cover"
                                        />
                                    )}
                                    <span className="font-semibold text-slate-800">{leadStory.user?.name}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {leadStory.reading_time_minutes} min read
                                    </span>
                                </div>

                                <Link 
                                    href={`/${leadStory.category?.slug}/${leadStory.slug}`}
                                    className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    Full Story <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* Trending Ranked List (1 column) */}
                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 flex flex-col justify-between">
                        <div>
                            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200">
                                <h2 className="font-bold text-slate-900 text-base uppercase tracking-wider flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-rose-600" />
                                    Trending Now
                                </h2>
                                <span className="text-[11px] font-medium text-slate-500">Live Ranking</span>
                            </div>

                            <div className="space-y-4">
                                {trendingArticles.map((article, idx) => (
                                    <Link
                                        key={article.id}
                                        href={`/${article.category?.slug}/${article.slug}`}
                                        className="group flex items-start gap-4 pb-4 border-b border-slate-200/60 last:border-none"
                                    >
                                        <span className="font-serif font-black text-2xl text-slate-300 group-hover:text-blue-600 transition shrink-0 w-8">
                                            {String(idx + 1).padStart(2, '0')}
                                        </span>
                                        <div className="space-y-1">
                                            <span 
                                                className="text-[10px] font-bold uppercase tracking-wider"
                                                style={{ color: article.category?.accent_color || '#0066FF' }}
                                            >
                                                {article.category?.name}
                                            </span>
                                            <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                                                {article.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-[11px] text-slate-400">
                                                <span>{article.reading_time_minutes} min read</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. EDITORS PICKS & LATEST EDITORIAL GRID */}
                <section className="pt-6">
                    <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
                        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-950 font-serif">
                            Editor's Picks & Investigations
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {editorsPicks.map((article) => (
                            <Link
                                key={article.id}
                                href={`/${article.category?.slug}/${article.slug}`}
                                className="group flex flex-col justify-between bg-white rounded-lg border border-slate-100 hover:border-slate-300 transition p-3 shadow-xs"
                            >
                                <div>
                                    <div className="overflow-hidden rounded-md aspect-video bg-slate-100 mb-3">
                                        {article.hero_image_url && (
                                            <img
                                                src={article.hero_image_url}
                                                alt={article.title}
                                                className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                                            />
                                        )}
                                    </div>
                                    <span 
                                        className="text-[10px] font-bold uppercase tracking-wider block mb-1"
                                        style={{ color: article.category?.accent_color || '#0066FF' }}
                                    >
                                        {article.category?.name}
                                    </span>
                                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug mb-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                        {article.standfirst}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 mt-3 border-t border-slate-100">
                                    <span>{article.user?.name}</span>
                                    <span>{article.reading_time_minutes}m</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* 4. MULTIMEDIA & VIDEO STREAM MODULE */}
                <section className="bg-slate-950 text-white rounded-2xl p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <span className="text-rose-500 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-1">
                                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Live & Multimedia
                            </span>
                            <h2 className="text-xl sm:text-2xl font-bold font-serif">Visual Journalism & Documentaries</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 relative aspect-video rounded-xl overflow-hidden bg-slate-900 group cursor-pointer">
                            <img
                                src="https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80"
                                alt="Feature Documentary"
                                className="w-full h-full object-cover opacity-80 group-hover:scale-102 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                                    <Play className="w-7 h-7 fill-white translate-x-0.5" />
                                </div>
                            </div>
                            <div className="absolute bottom-4 left-4 right-4">
                                <span className="bg-rose-600 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded">
                                    18:24 Deep Dive
                                </span>
                                <h3 className="text-base sm:text-xl font-bold mt-2">
                                    Inside Cadarache: Can Magnetic Confinement Fusion Stabilize the European Grid?
                                </h3>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
                                <span className="text-blue-400 text-xs font-semibold">▶ 04:30 Minutes</span>
                                <h4 className="text-sm font-bold text-slate-200 mt-1">
                                    How Tamper-Evident Silicon Telemetry Secures Model Compute
                                </h4>
                                <span className="text-xs text-slate-500 block mt-2">Technology Desk</span>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
                                <span className="text-blue-400 text-xs font-semibold">▶ 07:12 Minutes</span>
                                <h4 className="text-sm font-bold text-slate-200 mt-1">
                                    The Lunar Shackleton Crater: Mapping 100 Million Tons of Polar Ice
                                </h4>
                                <span className="text-xs text-slate-500 block mt-2">Science & Planetary Exploration</span>
                            </div>
                            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition">
                                <span className="text-blue-400 text-xs font-semibold">▶ 05:45 Minutes</span>
                                <h4 className="text-sm font-bold text-slate-200 mt-1">
                                    Autonomous Light Rail: How Pedestrianized Plazas Redefined Vienna
                                </h4>
                                <span className="text-xs text-slate-500 block mt-2">Urban Planning & Architecture</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. CATEGORY SECTIONS */}
                <div className="space-y-12">
                    {categoryFeeds.map(({ category, articles }) => articles.length > 0 && (
                        <section key={category.id} className="pt-2">
                            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div 
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: category.accent_color }}
                                    />
                                    <h2 className="text-xl font-bold tracking-tight text-slate-950 font-serif">
                                        {category.name}
                                    </h2>
                                </div>
                                <Link 
                                    href={`/${category.slug}`}
                                    className="text-xs font-semibold text-slate-600 hover:text-blue-600 flex items-center gap-1"
                                >
                                    See all {category.name} <ChevronRight className="w-3.5 h-3.5" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {articles.map((art) => (
                                    <Link
                                        key={art.id}
                                        href={`/${category.slug}/${art.slug}`}
                                        className="group space-y-3"
                                    >
                                        <div className="aspect-[16/10] overflow-hidden rounded-lg bg-slate-100">
                                            {art.hero_image_url && (
                                                <img
                                                    src={art.hero_image_url}
                                                    alt={art.title}
                                                    className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                                                />
                                            )}
                                        </div>
                                        <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                                            {art.title}
                                        </h3>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                            {art.standfirst}
                                        </p>
                                        <div className="text-[11px] text-slate-400">
                                            {art.user?.name} • {art.reading_time_minutes} min read
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
