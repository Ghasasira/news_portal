import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Article, Category, PaginatedData, Tag } from '@/types/news';
import { Tag as TagIcon, Clock } from 'lucide-react';

interface Props {
    tag: Tag;
    articles: PaginatedData<Article>;
    categories: Category[];
}

export default function TagPage({ tag, articles, categories }: Props) {
    return (
        <PublicLayout categories={categories}>
            <Head title={`#${tag.name} — Tagged Articles | NEWSPORTAL`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                <div className="border-b border-slate-200 pb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                        <TagIcon className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tag</span>
                        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-slate-900">
                            #{tag.name}
                        </h1>
                    </div>
                </div>

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
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                                {art.title}
                            </h3>
                            <p className="text-xs text-slate-500 line-clamp-2">
                                {art.standfirst}
                            </p>
                            <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                <span>{art.user?.name}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {art.reading_time_minutes}m
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </PublicLayout>
    );
}
