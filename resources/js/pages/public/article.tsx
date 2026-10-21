import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Article, Category } from '@/types/news';
import { 
    Clock, 
    Bookmark, 
    Share2, 
    Check, 
    Copy, 
    Twitter, 
    Linkedin, 
    FileText, 
    ChevronDown, 
    ChevronUp, 
    Sparkles, 
    MessageSquare,
    Send
} from 'lucide-react';

interface Props {
    article: Article;
    relatedArticles: Article[];
    isSaved: boolean;
    jsonLd: Record<string, any>;
    breadcrumbLd: Record<string, any>;
    faqLd: Record<string, any> | null;
    categories: Category[];
}

export default function ArticlePage({
    article,
    relatedArticles,
    isSaved: initialSaved,
    jsonLd,
    breadcrumbLd,
    faqLd,
    categories,
}: Props) {
    const [saved, setSaved] = useState(initialSaved);
    const [copied, setCopied] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [commentContent, setCommentContent] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');

    const handleCopy = () => {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleBookmark = () => {
        setSaved(!saved);
        router.post(`/articles/${article.id}/bookmark`, {}, { preserveScroll: true });
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        router.post(
            `/articles/${article.id}/comments`,
            {
                content: commentContent,
                author_name: commentAuthor || 'Reader',
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setCommentContent('');
                    setCommentAuthor('');
                },
            }
        );
    };

    const formattedDate = article.published_at 
        ? new Date(article.published_at).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        : '';

    return (
        <PublicLayout categories={categories}>
            <Head>
                <title>{`${article.title} | NEWSPORTAL`}</title>
                <meta name="description" content={article.standfirst || ''} />
                <link rel="canonical" href={`/${article.category?.slug}/${article.slug}`} />
                <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
                <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
                {faqLd && <script type="application/ld+json">{JSON.stringify(faqLd)}</script>}
            </Head>

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
                {/* 1. ARTICLE HEADER */}
                <header className="space-y-4 mb-8">
                    <div className="flex items-center gap-2">
                        <Link
                            href={`/${article.category?.slug}`}
                            className="px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider text-white inline-block"
                            style={{ backgroundColor: article.category?.accent_color || '#0066FF' }}
                        >
                            {article.category?.name}
                        </Link>
                        {article.is_breaking && (
                            <span className="bg-rose-600 text-white text-[10px] uppercase font-extrabold px-2 py-0.5 rounded">
                                Breaking
                            </span>
                        )}
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                            {article.content_type}
                        </span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-950 font-serif leading-tight">
                        {article.title}
                    </h1>

                    {article.standfirst && (
                        <p className="text-lg sm:text-xl text-slate-600 font-serif leading-relaxed italic">
                            {article.standfirst}
                        </p>
                    )}

                    {/* BYLINE & ACTIONS BAR */}
                    <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-slate-200 text-sm">
                        <div className="flex items-center gap-3">
                            {article.user?.author_profile?.avatar_url && (
                                <img
                                    src={article.user.author_profile.avatar_url}
                                    alt={article.user.name}
                                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                                />
                            )}
                            <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <Link 
                                        href={`/author/${article.user?.author_profile?.slug}`}
                                        className="hover:text-blue-600 transition"
                                    >
                                        {article.user?.name}
                                    </Link>
                                    {article.user?.author_profile?.is_verified && (
                                        <span className="text-blue-600 text-xs font-bold" title="Verified Journalist">✓</span>
                                    )}
                                </div>
                                <div className="text-xs text-slate-500 flex items-center gap-2">
                                    <span>{formattedDate}</span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {article.reading_time_minutes} min read
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Share & Bookmark buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={handleBookmark}
                                className={`p-2 rounded-full border transition flex items-center gap-1 text-xs font-semibold ${
                                    saved 
                                        ? 'bg-blue-50 border-blue-200 text-blue-600' 
                                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                                title={saved ? 'Remove Bookmark' : 'Bookmark Article'}
                            >
                                <Bookmark className="w-4 h-4 fill-current" />
                                <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleCopy}
                                className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                                title="Copy Article URL"
                            >
                                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                            </button>

                            <a
                                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
                                title="Share on X"
                            >
                                <Twitter className="w-4 h-4" />
                            </a>

                            <a
                                href={`/${article.category?.slug}/${article.slug}.md`}
                                target="_blank"
                                className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50 transition flex items-center gap-1 text-xs"
                                title="View Machine-Readable Markdown"
                            >
                                <FileText className="w-4 h-4 text-blue-600" />
                                <span className="hidden sm:inline font-mono">.md</span>
                            </a>
                        </div>
                    </div>
                </header>

                {/* 2. HERO IMAGE */}
                {article.hero_image_url && (
                    <figure className="mb-8">
                        <img
                            src={article.hero_image_url}
                            alt={article.title}
                            className="w-full aspect-[16/9] object-cover rounded-xl shadow-xs"
                        />
                        {article.hero_image_caption && (
                            <figcaption className="text-xs text-slate-500 mt-2 italic text-center">
                                {article.hero_image_caption}
                            </figcaption>
                        )}
                    </figure>
                )}

                {/* 3. AEO / GEO SUMMARY BOX (TL;DR & KEY FACTS) */}
                {(article.ai_meta?.tldr || (article.ai_meta?.key_facts && article.ai_meta.key_facts.length > 0)) && (
                    <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 mb-8">
                        <div className="flex items-center gap-2 text-blue-900 font-bold text-sm uppercase tracking-wider mb-2">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            Executive Takeaways & Key Facts
                        </div>
                        {article.ai_meta.tldr && (
                            <p className="text-sm font-semibold text-slate-800 mb-3 leading-relaxed">
                                {article.ai_meta.tldr}
                            </p>
                        )}
                        {article.ai_meta.key_facts && article.ai_meta.key_facts.length > 0 && (
                            <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 list-disc list-inside">
                                {article.ai_meta.key_facts.map((fact, idx) => (
                                    <li key={idx} className="leading-relaxed">{fact}</li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* 4. ARTICLE BODY */}
                <div 
                    className="prose prose-slate lg:prose-lg max-w-none prose-headings:font-serif prose-headings:font-bold prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-slate-50 prose-blockquote:p-4 prose-blockquote:rounded-r-lg prose-blockquote:italic leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: article.body }}
                />

                {/* 5. INTERACTIVE FAQ ACCORDION (AEO & FAQPage Schema) */}
                {article.ai_meta?.faq_json && article.ai_meta.faq_json.length > 0 && (
                    <section className="mt-12 pt-8 border-t border-slate-200">
                        <h2 className="text-xl font-bold font-serif text-slate-900 mb-4">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-3">
                            {article.ai_meta.faq_json.map((faq, idx) => (
                                <div key={idx} className="border border-slate-200 rounded-lg overflow-hidden bg-white">
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full text-left px-4 py-3 font-semibold text-sm sm:text-base text-slate-800 flex items-center justify-between hover:bg-slate-50 transition"
                                    >
                                        <span>{faq.question}</span>
                                        {openFaq === idx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                                    </button>
                                    {openFaq === idx && (
                                        <div className="px-4 pb-4 pt-1 text-sm text-slate-600 bg-slate-50/50 leading-relaxed border-t border-slate-100">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* 6. TOPIC & TAG CHIPS */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Tags:</span>
                    {article.topics?.map((topic) => (
                        <Link
                            key={topic.id}
                            href={`/topic/${topic.slug}`}
                            className="text-xs bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 px-3 py-1 rounded-full font-medium transition"
                        >
                            #{topic.name}
                        </Link>
                    ))}
                    {article.tags?.map((tag) => (
                        <Link
                            key={tag.id}
                            href={`/tag/${tag.slug}`}
                            className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-2.5 py-1 rounded-full transition"
                        >
                            #{tag.name}
                        </Link>
                    ))}
                </div>

                {/* 7. AUTHOR E-E-A-T CARD */}
                {article.user?.author_profile && (
                    <div className="mt-10 p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start gap-4">
                        {article.user.author_profile.avatar_url && (
                            <img
                                src={article.user.author_profile.avatar_url}
                                alt={article.user.name}
                                className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-white shadow-xs"
                            />
                        )}
                        <div className="space-y-1.5 flex-1">
                            <div className="flex items-center justify-between">
                                <Link
                                    href={`/author/${article.user.author_profile.slug}`}
                                    className="font-bold text-base text-slate-900 hover:text-blue-600 transition"
                                >
                                    {article.user.name}
                                </Link>
                                <span className="text-xs font-semibold text-slate-500">
                                    {article.user.author_profile.credentials}
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                                {article.user.author_profile.bio}
                            </p>
                            {article.user.author_profile.beat && (
                                <span className="text-xs text-blue-600 font-medium block">
                                    Beat: {article.user.author_profile.beat}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* 8. COMMENTS SECTION */}
                <section className="mt-12 pt-8 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            Community Discussion ({article.comments?.length || 0})
                        </h2>
                    </div>

                    {/* Submission Form */}
                    <form onSubmit={handleCommentSubmit} className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 space-y-3">
                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            rows={3}
                            placeholder="Share your analytical perspective or question..."
                            className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
                            required
                        />
                        <div className="flex items-center justify-between gap-3">
                            <input
                                type="text"
                                value={commentAuthor}
                                onChange={(e) => setCommentAuthor(e.target.value)}
                                placeholder="Your Name"
                                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 w-48 focus:outline-none"
                            />
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition"
                            >
                                <Send className="w-3.5 h-3.5" /> Post Comment
                            </button>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {article.comments && article.comments.length > 0 ? (
                            article.comments.map((comment) => (
                                <div key={comment.id} className="p-4 rounded-lg bg-white border border-slate-100 shadow-xs space-y-1">
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="font-bold text-slate-800">{comment.author_name}</span>
                                        <span className="text-slate-400">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {comment.content}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-slate-400 italic">No comments yet. Be the first to join the dialogue.</p>
                        )}
                    </div>
                </section>

                {/* 9. RELATED ARTICLES RAIL */}
                {relatedArticles.length > 0 && (
                    <section className="mt-16 pt-8 border-t border-slate-200">
                        <h2 className="text-xl font-bold font-serif text-slate-900 mb-6">
                            Related Coverage & Analysis
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {relatedArticles.map((rel) => (
                                <Link
                                    key={rel.id}
                                    href={`/${rel.category?.slug}/${rel.slug}`}
                                    className="group space-y-2 block"
                                >
                                    <div className="aspect-video rounded-lg overflow-hidden bg-slate-100">
                                        {rel.hero_image_url && (
                                            <img
                                                src={rel.hero_image_url}
                                                alt={rel.title}
                                                className="w-full h-full object-cover group-hover:scale-103 transition duration-300"
                                            />
                                        )}
                                    </div>
                                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                                        {rel.title}
                                    </h3>
                                    <p className="text-xs text-slate-500 line-clamp-2">
                                        {rel.standfirst}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </article>
        </PublicLayout>
    );
}
