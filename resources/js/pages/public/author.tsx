import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Article, AuthorProfile, Category, PaginatedData } from '@/types/news';
import { Clock, CheckCircle, Twitter, Linkedin, Github } from 'lucide-react';

interface Props {
    author: AuthorProfile;
    articles: PaginatedData<Article>;
    categories: Category[];
}

export default function AuthorPage({ author, articles, categories }: Props) {
    return (
        <PublicLayout categories={categories}>
            <Head title={`${author.user?.name} — Senior Journalist Profile | NEWSPORTAL`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
                {/* Author E-E-A-T Profile Card */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 sm:p-10 flex flex-col sm:flex-row items-start gap-6">
                    {author.avatar_url && (
                        <img
                            src={author.avatar_url}
                            alt={author.user?.name}
                            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-sm shrink-0"
                        />
                    )}
                    <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900">
                                {author.user?.name}
                            </h1>
                            {author.is_verified && (
                                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <CheckCircle className="w-3.5 h-3.5" /> Verified Staff
                                </span>
                            )}
                        </div>

                        {author.credentials && (
                            <p className="text-sm font-semibold text-slate-600">
                                {author.credentials}
                            </p>
                        )}

                        {author.bio && (
                            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
                                {author.bio}
                            </p>
                        )}

                        {author.beat && (
                            <div className="text-xs text-blue-600 font-medium pt-1">
                                <strong>Beats & Coverage:</strong> {author.beat}
                            </div>
                        )}

                        {/* Social Links */}
                        {author.social_links && (
                            <div className="flex items-center gap-3 pt-2">
                                {author.social_links.twitter && (
                                    <a href={author.social_links.twitter} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-500 transition">
                                        <Twitter className="w-4 h-4" />
                                    </a>
                                )}
                                {author.social_links.linkedin && (
                                    <a href={author.social_links.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-blue-700 transition">
                                        <Linkedin className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Published Articles */}
                <div>
                    <h2 className="text-xl font-bold font-serif text-slate-900 mb-6">
                        Published Journalism & Essays ({articles.total})
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {articles.data.map((art) => (
                            <Link
                                key={art.id}
                                href={`/${art.category?.slug}/${art.slug}`}
                                className="group space-y-2 block"
                            >
                                <div className="aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                                    {art.hero_image_url && (
                                        <img
                                            src={art.hero_image_url}
                                            alt={art.title}
                                            className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
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
                                <div className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {art.reading_time_minutes} min read
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
