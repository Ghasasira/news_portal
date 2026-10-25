import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import AuthorAvatar from '@/components/ui/author-avatar';
import { Article, AuthorProfile, Category, PaginatedData } from '@/types/news';
import { 
    Clock, 
    CheckCircle, 
    Twitter, 
    Linkedin, 
    Github, 
    Compass, 
    Newspaper, 
    Calendar,
    ArrowUpDown
} from 'lucide-react';

interface Props {
    author: AuthorProfile;
    articles: PaginatedData<Article>;
    totalArticlesCount?: number;
    categories: Category[];
}

export default function AuthorPage({ author, articles, totalArticlesCount, categories }: Props) {
    const authorName = author.user?.name || 'Journalist';
    const totalCount = totalArticlesCount ?? articles.total;

    return (
        <PublicLayout categories={categories}>
            <Head title={`${authorName} — Journalist Profile & Stories | NEWSPORTAL`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-12">
                {/* Author Profile Header Card */}
                <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-10 shadow-xs">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                        {/* Avatar */}
                        <div className="relative">
                            <AuthorAvatar
                                name={authorName}
                                avatarUrl={author.avatar_url}
                                size="xl"
                                className="ring-4 ring-white shadow-md"
                            />
                            {author.is_verified && (
                                <span 
                                    className="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-1.5 shadow-sm border-2 border-white"
                                    title="Verified Staff Journalist"
                                >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                </span>
                            )}
                        </div>

                        {/* Author Info */}
                        <div className="space-y-3 flex-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                                <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900 tracking-tight">
                                    {authorName}
                                </h1>
                                {author.is_verified && (
                                    <span className="bg-blue-50 text-blue-700 border border-blue-200/60 text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                                        <CheckCircle className="w-3.5 h-3.5 text-blue-600" /> Verified Newsroom Staff
                                    </span>
                                )}
                            </div>

                            {author.credentials && (
                                <p className="text-sm font-semibold text-slate-700">
                                    {author.credentials}
                                </p>
                            )}

                            {author.bio ? (
                                <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
                                    {author.bio}
                                </p>
                            ) : (
                                <p className="text-sm text-slate-400 italic">
                                    Contributing reporter and analyst for NewsPortal covering breaking developments and in-depth investigations.
                                </p>
                            )}

                            {/* Meta Badges & Social Links */}
                            <div className="flex flex-wrap items-center gap-4 pt-2">
                                {author.beat && (
                                    <div className="inline-flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50/80 px-2.5 py-1 rounded-md border border-blue-100 font-medium">
                                        <Compass className="w-3.5 h-3.5 text-blue-600" />
                                        <span>Beat: <strong>{author.beat}</strong></span>
                                    </div>
                                )}

                                <div className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md font-medium">
                                    <Newspaper className="w-3.5 h-3.5 text-slate-500" />
                                    <span><strong>{totalCount}</strong> published {totalCount === 1 ? 'story' : 'stories'}</span>
                                </div>

                                {author.social_links && (
                                    <div className="flex items-center gap-2 pl-1 border-l border-slate-200">
                                        {author.social_links.twitter && (
                                            <a
                                                href={author.social_links.twitter}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-slate-400 hover:text-slate-900 p-1 rounded-md hover:bg-slate-100 transition"
                                                title="X / Twitter"
                                            >
                                                <Twitter className="w-4 h-4" />
                                            </a>
                                        )}
                                        {author.social_links.linkedin && (
                                            <a
                                                href={author.social_links.linkedin}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-slate-400 hover:text-blue-700 p-1 rounded-md hover:bg-slate-100 transition"
                                                title="LinkedIn"
                                            >
                                                <Linkedin className="w-4 h-4" />
                                            </a>
                                        )}
                                        {author.social_links.github && (
                                            <a
                                                href={author.social_links.github}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-slate-400 hover:text-slate-900 p-1 rounded-md hover:bg-slate-100 transition"
                                                title="GitHub"
                                            >
                                                <Github className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Published Articles Section */}
                <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold font-serif text-slate-900">
                                Published Journalism & Stories
                            </h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Complete catalog of reporting and essays by {authorName}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-slate-100/80 px-3 py-1.5 rounded-lg border border-slate-200/60 w-fit">
                            <ArrowUpDown className="w-3.5 h-3.5 text-blue-600" />
                            <span>Sorted: <strong>Latest First</strong></span>
                        </div>
                    </div>

                    {articles.data.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {articles.data.map((art) => (
                                <Link
                                    key={art.id}
                                    href={`/${art.category?.slug}/${art.slug}`}
                                    className="group flex flex-col bg-white border border-slate-200/80 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition duration-200"
                                >
                                    <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                                        {art.hero_image_url ? (
                                            <img
                                                src={art.hero_image_url}
                                                alt={art.title}
                                                className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400 text-xs font-mono">
                                                NEWSPORTAL
                                            </div>
                                        )}
                                        {art.category && (
                                            <span 
                                                className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white px-2 py-0.5 rounded-md shadow-xs"
                                                style={{ backgroundColor: art.category.accent_color || '#0066FF' }}
                                            >
                                                {art.category.name}
                                            </span>
                                        )}
                                    </div>

                                    <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                                        <div className="space-y-2">
                                            <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                                                {art.title}
                                            </h3>
                                            {art.standfirst && (
                                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                    {art.standfirst}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-100">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3 text-slate-400" />
                                                {art.published_at ? new Date(art.published_at).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                }) : 'Recent'}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3 text-slate-400" /> {art.reading_time_minutes} min read
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-12 text-center space-y-3">
                            <Newspaper className="w-8 h-8 text-slate-400 mx-auto" />
                            <h3 className="text-base font-semibold text-slate-700">No Published Stories Yet</h3>
                            <p className="text-xs text-slate-500 max-w-md mx-auto">
                                Stories by {authorName} are currently in editorial review and will appear here once published.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {articles.links && articles.links.length > 3 && (
                        <div className="flex items-center justify-center gap-1.5 pt-8 border-t border-slate-200">
                            {articles.links.map((link, idx) => (
                                <Link
                                    key={idx}
                                    href={link.url || '#'}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                                        link.active
                                            ? 'bg-blue-600 text-white font-bold shadow-xs'
                                            : link.url
                                            ? 'text-slate-700 hover:bg-slate-100'
                                            : 'text-slate-300 pointer-events-none'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
}
