import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Article, Category, PaginatedData } from '@/types/news';
import { Bookmark, Clock } from 'lucide-react';

interface Props {
    articles: PaginatedData<Article>;
    categories: Category[];
}

export default function SavedArticlesPage({ articles, categories }: Props) {
    return (
        <PublicLayout categories={categories}>
            <Head title="Saved Bookmarks | NEWSPORTAL" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                <div className="border-b border-slate-200 pb-6 flex items-center gap-3">
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

                {articles.data && articles.data.length > 0 ? (
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
                ) : (
                    <div className="text-center py-16 text-slate-500 space-y-3">
                        <Bookmark className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="font-semibold text-slate-800">Your reading list is empty.</p>
                        <p className="text-xs max-w-sm mx-auto">
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
