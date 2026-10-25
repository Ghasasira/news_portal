import { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import PublicLayout from '@/layouts/public-layout';
import AuthorAvatar from '@/components/ui/author-avatar';
import { Article, Category } from '@/types/news';
import { Auth } from '@/types/auth';
import { useBookmarks } from '@/hooks/use-bookmarks';
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
    Send,
    Trash2,
    LogIn
} from 'lucide-react';
import { SocialShareBar } from '@/components/social-share-bar';

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
    const { auth } = usePage<{ auth?: Auth }>().props;
    const { isSaved: localIsSaved, toggle: toggleBookmark } = useBookmarks(article);
    const [saved, setSaved] = useState(initialSaved || localIsSaved);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [commentContent, setCommentContent] = useState('');
    const [commentAuthor, setCommentAuthor] = useState('');
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    const currentActor = auth?.reader || auth?.user;
    const isStaff = Boolean(auth?.user && ['super_admin', 'chief_editor', 'section_editor'].includes(auth.user.role || ''));

    useEffect(() => {
        setSaved(initialSaved || localIsSaved);
    }, [initialSaved, localIsSaved]);

    const handleBookmark = () => {
        toggleBookmark(article);
        setSaved(!saved);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = commentContent.trim();
        if (!trimmed) {
            toast.error('Please enter a comment.');
            return;
        }
        if (trimmed.length < 3) {
            toast.error('Comment must be at least 3 characters.');
            return;
        }

        setIsSubmittingComment(true);
        router.post(
            `/articles/${article.id}/comments`,
            {
                content: trimmed,
                author_name: currentActor ? currentActor.name : (commentAuthor.trim() || 'Reader'),
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Your comment has been posted!');
                    setCommentContent('');
                    setCommentAuthor('');
                    setIsSubmittingComment(false);
                },
                onError: (errors) => {
                    toast.error((Object.values(errors)[0] as string) || 'Could not post comment.');
                    setIsSubmittingComment(false);
                },
            }
        );
    };

    const handleDeleteComment = (commentId: number) => {
        if (!confirm('Are you sure you want to remove this comment?')) return;
        router.delete(`/articles/${article.id}/comments/${commentId}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Comment removed.'),
            onError: () => toast.error('Failed to remove comment.'),
        });
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
                            <Link 
                                href={`/author/${article.user?.author_profile?.slug || (article.user?.name ? article.user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'staff')}`}
                                className="group shrink-0" 
                                title={`View all stories by ${article.user?.name || 'Author'}`}
                            >
                                <AuthorAvatar
                                    name={article.user?.name}
                                    avatarUrl={article.user?.author_profile?.avatar_url}
                                    size="lg"
                                    className="group-hover:ring-2 group-hover:ring-blue-600 transition"
                                />
                            </Link>
                            <div>
                                <div className="font-bold text-slate-900 flex items-center gap-1.5">
                                    <Link 
                                        href={`/author/${article.user?.author_profile?.slug || (article.user?.name ? article.user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'staff')}`}
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
                            <SocialShareBar title={article.title} />

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
                <div className="mt-10 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start gap-5 shadow-2xs">
                    <Link
                        href={`/author/${article.user?.author_profile?.slug || (article.user?.name ? article.user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'staff')}`}
                        className="group shrink-0"
                        title={`View all stories by ${article.user?.name || 'Author'}`}
                    >
                        <AuthorAvatar
                            name={article.user?.name}
                            avatarUrl={article.user?.author_profile?.avatar_url}
                            size="xl"
                            className="group-hover:ring-2 group-hover:ring-blue-600 transition shadow-sm"
                        />
                    </Link>
                    <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/author/${article.user?.author_profile?.slug || (article.user?.name ? article.user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'staff')}`}
                                    className="font-bold text-lg text-slate-900 hover:text-blue-600 transition font-serif"
                                >
                                    {article.user?.name}
                                </Link>
                                {article.user?.author_profile?.is_verified && (
                                    <span className="text-blue-700 bg-blue-50 border border-blue-200/60 text-xs font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                        ✓ Verified Staff
                                    </span>
                                )}
                            </div>
                            {article.user?.author_profile?.credentials && (
                                <span className="text-xs font-semibold text-slate-500">
                                    {article.user.author_profile.credentials}
                                </span>
                            )}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {article.user?.author_profile?.bio || 'Journalist and contributing writer for NewsPortal covering developing news, policy, and critical analysis.'}
                        </p>
                        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                            {article.user?.author_profile?.beat && (
                                <span className="text-xs text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md font-medium border border-blue-100">
                                    Beat: <strong>{article.user.author_profile.beat}</strong>
                                </span>
                            )}
                            <Link
                                href={`/author/${article.user?.author_profile?.slug || (article.user?.name ? article.user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'staff')}`}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition ml-auto"
                            >
                                View all stories by {article.user?.name} &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 8. SOCIAL ENGAGEMENT & SHARING */}
                <SocialShareBar 
                    title={article.title} 
                    variant="expanded" 
                    className="mt-8 mb-4" 
                />

                {/* 9. COMMENTS SECTION */}
                <section className="mt-12 pt-8 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold font-serif text-slate-900 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            Community Discussion ({article.comments?.length || 0})
                        </h2>
                    </div>

                    {/* Submission Form */}
                    <form onSubmit={handleCommentSubmit} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 mb-8 space-y-4">
                        {/* Logged in actor indicator or Guest notice */}
                        <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/60">
                            {currentActor ? (
                                <div className="flex items-center gap-2">
                                    <AuthorAvatar
                                        name={currentActor.name}
                                        avatarUrl={auth?.reader?.avatar_url || (auth?.user as any)?.author_profile?.avatar_url}
                                        size="xs"
                                    />
                                    <span className="text-slate-600">
                                        Commenting as <strong className="text-slate-900">{currentActor.name}</strong>
                                    </span>
                                    {auth?.user && (
                                        <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                            Editorial Staff
                                        </span>
                                    )}
                                    {auth?.reader && (
                                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                            Verified Reader
                                        </span>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center justify-between w-full">
                                    <span className="text-slate-500">
                                        Join the conversation as a guest, or{' '}
                                        <Link href="/reader/login" className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1">
                                            <LogIn className="w-3 h-3" /> sign in with your Reader account
                                        </Link>
                                    </span>
                                </div>
                            )}
                        </div>

                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            rows={3}
                            placeholder="Share your analytical perspective, question, or context..."
                            className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-blue-600 focus:outline-none transition leading-relaxed"
                            required
                        />

                        <div className="flex flex-wrap items-center justify-between gap-3">
                            {!currentActor && (
                                <input
                                    type="text"
                                    value={commentAuthor}
                                    onChange={(e) => setCommentAuthor(e.target.value)}
                                    placeholder="Your Name (Optional)"
                                    className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 w-52 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            )}
                            <div className="ml-auto">
                                <button
                                    type="submit"
                                    disabled={isSubmittingComment}
                                    className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition shadow-xs cursor-pointer disabled:opacity-50"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                                </button>
                            </div>
                        </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4">
                        {article.comments && article.comments.length > 0 ? (
                            article.comments.map((comment) => {
                                const canDelete = isStaff || (auth?.reader && comment.reader_id === auth.reader.id) || (auth?.user && comment.user_id === auth.user.id);
                                const commentAvatarUrl = comment.reader?.avatar_url || (comment.user as any)?.author_profile?.avatar_url;
                                const isStaffComment = Boolean(comment.user_id || comment.user);
                                const isVerifiedReaderComment = Boolean(comment.reader_id || comment.reader);

                                return (
                                    <div 
                                        key={comment.id} 
                                        className="p-4 sm:p-5 rounded-xl bg-white border border-slate-200/80 shadow-2xs space-y-2 hover:border-slate-300 transition"
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <AuthorAvatar
                                                    name={comment.author_name}
                                                    avatarUrl={commentAvatarUrl}
                                                    size="sm"
                                                />
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="font-bold text-xs sm:text-sm text-slate-900">
                                                        {comment.author_name}
                                                    </span>
                                                    {isStaffComment && (
                                                        <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-purple-200/60">
                                                            Staff
                                                        </span>
                                                    )}
                                                    {isVerifiedReaderComment && !isStaffComment && (
                                                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md border border-blue-200/60">
                                                            Verified Reader
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] text-slate-400">
                                                    {new Date(comment.created_at).toLocaleDateString(undefined, {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                                {canDelete && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        title="Delete comment"
                                                        className="text-slate-300 hover:text-rose-600 transition p-1 rounded-md cursor-pointer"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line pl-9">
                                            {comment.content}
                                        </p>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-8 text-center space-y-2">
                                <MessageSquare className="w-6 h-6 text-slate-400 mx-auto" />
                                <p className="text-xs font-semibold text-slate-700">No comments yet</p>
                                <p className="text-xs text-slate-400">Be the first to join the dialogue and share your perspective.</p>
                            </div>
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
