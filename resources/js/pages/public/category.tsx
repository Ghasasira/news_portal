import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Article, Category, PaginatedData } from '@/types/news';
import { Clock } from 'lucide-react';

interface Props {
    category: Category;
    activeSubcategory: Category | null;
    articles: PaginatedData<Article>;
    categories: Category[];
}

export default function CategoryPage({ category, activeSubcategory, articles, categories }: Props) {
    return (
        <PublicLayout categories={categories}>
            <Head title={`${category.name} — Latest Reporting & Analysis | NEWSPORTAL`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
                {/* Header Banner */}
                <div className="border-b border-slate-200 pb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <span 
                            className="w-3.5 h-3.5 rounded-full"
                            style={{ backgroundColor: category.accent_color }}
                        />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                            Editorial Section
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold font-serif text-slate-950">
                        {category.name}
                    </h1>
                    {category.description && (
                        <p className="text-sm sm:text-base text-slate-600 max-w-2xl mt-2 leading-relaxed">
                            {category.description}
                        </p>
                    )}

                    {/* Subcategories Filter Pills */}
                    {category.children && category.children.length > 0 && (
                        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 scrollbar-none">
                            <Link
                                href={`/${category.slug}`}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition ${
                                    !activeSubcategory
                                        ? 'bg-slate-900 text-white'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                All {category.name}
                            </Link>
                            {category.children.map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={`/${category.slug}?subcategory=${sub.id}`}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition shrink-0 ${
                                        activeSubcategory?.id === sub.id
                                            ? 'bg-slate-900 text-white'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                >
                                    {sub.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                {/* Articles Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {articles.data.map((article) => (
                        <Link
                            key={article.id}
                            href={`/${category.slug}/${article.slug}`}
                            className="group flex flex-col justify-between space-y-3"
                        >
                            <div className="aspect-[16/10] overflow-hidden rounded-xl bg-slate-100">
                                {article.hero_image_url && (
                                    <img
                                        src={article.hero_image_url}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                                    />
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                                    {article.content_type}
                                </span>
                                <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                                    {article.title}
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
                                    {article.standfirst}
                                </p>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
                                <span>{article.user?.name}</span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {article.reading_time_minutes} min
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {articles.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1 pt-8 border-t border-slate-200">
                        {articles.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url || '#'}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 text-xs rounded-md font-medium ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : link.url
                                        ? 'text-slate-600 hover:bg-slate-100'
                                        : 'text-slate-300 pointer-events-none'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </PublicLayout>
    );
}
