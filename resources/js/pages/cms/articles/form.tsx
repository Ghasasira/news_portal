import { useState, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import CmsLayout from '@/layouts/cms-layout';
import { Article, Category, Tag, Topic } from '@/types/news';
import { 
    Save, 
    Sparkles, 
    Plus, 
    Trash2, 
    CheckCircle2, 
    AlertCircle, 
    Eye, 
    Image, 
    FileText, 
    Layers,
    Clock,
    HelpCircle,
    UploadCloud
} from 'lucide-react';
import { RichTextEditor } from '@/components/cms/rich-text-editor';
import { MediaLibraryModal } from '@/components/cms/media-library-modal';

interface Props {
    article: Article | null;
    categories: Category[];
    topics: Topic[];
    tags: Tag[];
}

export default function CmsArticleForm({ article, categories, topics, tags }: Props) {
    const isEdit = Boolean(article);
    const [heroMediaModalOpen, setHeroMediaModalOpen] = useState(false);

    const { data, setData, post, put, processing, errors } = useForm({
        title: article?.title || '',
        slug: article?.slug || '',
        standfirst: article?.standfirst || '',
        body: article?.body || '',
        primary_category_id: article?.primary_category_id || (categories[0]?.id || 1),
        content_type: article?.content_type || 'news',
        status: article?.status || 'draft',
        hero_image_url: article?.hero_image_url || '',
        hero_image_caption: article?.hero_image_caption || '',
        is_breaking: article?.is_breaking || false,
        is_featured: article?.is_featured || false,
        is_trending: article?.is_trending || false,
        is_editors_pick: article?.is_editors_pick || false,
        scheduled_at: article?.scheduled_at ? article.scheduled_at.slice(0, 16) : '',
        meta_title: article?.seo?.meta_title || '',
        meta_description: article?.seo?.meta_description || '',
        focus_keyword: article?.seo?.focus_keyword || '',
        tldr: article?.ai_meta?.tldr || '',
        key_facts: (Array.isArray(article?.ai_meta?.key_facts) && article.ai_meta.key_facts.length > 0)
            ? article.ai_meta.key_facts.map(f => (f != null ? String(f) : ''))
            : [''],
        faq_json: (Array.isArray(article?.ai_meta?.faq_json) && article.ai_meta.faq_json.length > 0)
            ? article.ai_meta.faq_json.map(item => ({
                question: item?.question != null ? String(item.question) : '',
                answer: item?.answer != null ? String(item.answer) : '',
            }))
            : [{ question: '', answer: '' }],
        topics: article?.topics ? article.topics.map(t => t.id) : [],
        tags: article?.tags ? article.tags.map(t => t.id) : [],
        revision_note: '',
    });

    // Real-time AEO & SEO Scorecard
    const aeoScore = useMemo(() => {
        let score = 0;
        if ((data.title || '').trim().length > 15) score += 15;
        if ((data.standfirst || '').trim().length > 30) score += 15;
        if ((data.body || '').trim().length > 200) score += 20;
        if ((data.tldr || '').trim().length > 20) score += 20;
        const validFacts = (data.key_facts || []).filter(f => typeof f === 'string' && f.trim().length > 5);
        if (validFacts.length >= 3) score += 15;
        const validFaqs = (data.faq_json || []).filter(f => f && typeof f.question === 'string' && typeof f.answer === 'string' && f.question.trim().length > 0 && f.answer.trim().length > 0);
        if (validFaqs.length >= 1) score += 15;
        return Math.min(100, score);
    }, [data.title, data.standfirst, data.body, data.tldr, data.key_facts, data.faq_json]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/cms/articles/${article!.id}`);
        } else {
            post('/cms/articles');
        }
    };

    const addKeyFact = () => {
        setData('key_facts', [...data.key_facts, '']);
    };

    const removeKeyFact = (index: number) => {
        setData('key_facts', data.key_facts.filter((_, i) => i !== index));
    };

    const updateKeyFact = (index: number, val: string) => {
        const next = [...data.key_facts];
        next[index] = val;
        setData('key_facts', next);
    };

    const addFaq = () => {
        setData('faq_json', [...data.faq_json, { question: '', answer: '' }]);
    };

    const removeFaq = (index: number) => {
        setData('faq_json', data.faq_json.filter((_, i) => i !== index));
    };

    const updateFaq = (index: number, field: 'question' | 'answer', val: string) => {
        const next = [...data.faq_json];
        next[index] = { ...next[index], [field]: val };
        setData('faq_json', next);
    };

    return (
        <CmsLayout title={isEdit ? `Edit: ${article?.title}` : 'Compose News Story'}>
            <Head title={`${isEdit ? 'Edit Story' : 'New Story'} | NEWSPORTAL CMS`} />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* LEFT & CENTER: MAIN EDITORIAL CONTENT (2 columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title & Slug */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    Headline / Title *
                                </label>
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    placeholder="Enter authoritative headline..."
                                    className="w-full text-lg sm:text-xl font-bold font-serif border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                                    required
                                />
                                {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                                        URL Slug (optional override)
                                    </label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="auto-generated-from-title"
                                        className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-none"
                                    />
                                    {errors.slug && <p className="text-xs text-rose-600 mt-1">{errors.slug}</p>}
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1">
                                        Content Format
                                    </label>
                                    <select
                                        value={data.content_type}
                                        onChange={(e) => setData('content_type', e.target.value as any)}
                                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 focus:bg-white focus:outline-none"
                                    >
                                        <option value="news">News Report</option>
                                        <option value="opinion">Editorial / Opinion</option>
                                        <option value="analysis">Deep Analysis</option>
                                        <option value="explainer">Explainer</option>
                                        <option value="liveblog">Live Blog</option>
                                        <option value="video">Video Documentary</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                                    Standfirst (Lead Summary / Excerpt)
                                </label>
                                <textarea
                                    value={data.standfirst}
                                    onChange={(e) => setData('standfirst', e.target.value)}
                                    rows={3}
                                    placeholder="A concise, high-impact 1-2 sentence lead summary..."
                                    className="w-full text-sm font-serif border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none leading-relaxed"
                                />
                            </div>
                        </div>

                        {/* Article Body */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between pb-1">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    Article Story & Editorial Body *
                                </label>
                                <span className="text-[11px] text-slate-500 font-medium">
                                    Rich text formatting with visual & HTML modes
                                </span>
                            </div>
                            <RichTextEditor
                                value={data.body}
                                onChange={(val) => setData('body', val)}
                                error={errors.body}
                                placeholder="Compose the narrative story. Use bold, headings, blockquotes, lists, links, and inline images..."
                            />
                        </div>

                        {/* AEO & GEO INTELLIGENCE STUDIO */}
                        <div className="bg-white p-6 rounded-2xl border border-blue-200 shadow-xs space-y-6">
                            <div className="flex items-center justify-between pb-3 border-b border-blue-100">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <h3 className="font-bold text-sm sm:text-base text-slate-900">
                                            AEO & GEO Answer-Engine Optimization
                                        </h3>
                                        <p className="text-xs text-slate-500">
                                            Structure your article for direct synthesis by generative AI assistants and search answer engines.
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Readiness Score</span>
                                    <span className={`text-xl font-black ${
                                        aeoScore >= 80 ? 'text-emerald-600' : aeoScore >= 50 ? 'text-amber-600' : 'text-slate-400'
                                    }`}>
                                        {aeoScore}%
                                    </span>
                                </div>
                            </div>

                            {/* TL;DR */}
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    AEO Executive TL;DR (30-50 Words)
                                </label>
                                <textarea
                                    value={data.tldr}
                                    onChange={(e) => setData('tldr', e.target.value)}
                                    rows={2}
                                    placeholder="Direct factual answer to the core question of the story..."
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                />
                            </div>

                            {/* Key Facts */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-700">
                                        Key Takeaways & Bullet Facts ({data.key_facts.length})
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addKeyFact}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add Fact
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {data.key_facts.map((fact, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={fact || ''}
                                                onChange={(e) => updateKeyFact(idx, e.target.value)}
                                                placeholder={`Key fact point #${idx + 1}`}
                                                className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:outline-none"
                                            />
                                            {data.key_facts.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeKeyFact(idx)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* FAQ Generator */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-xs font-bold text-slate-700">
                                        FAQ Schema Q&A Pairs ({data.faq_json.length})
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addFaq}
                                        className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add Q&A
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {data.faq_json.map((faq, idx) => (
                                        <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2 relative">
                                            <input
                                                type="text"
                                                value={faq?.question || ''}
                                                onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                                                placeholder="Question (e.g. When will the treaty take effect?)"
                                                className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg p-2 focus:outline-none"
                                            />
                                            <textarea
                                                value={faq?.answer || ''}
                                                onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                                                rows={2}
                                                placeholder="Concise, verified answer..."
                                                className="w-full text-xs bg-white border border-slate-300 rounded-lg p-2 focus:outline-none"
                                            />
                                            {data.faq_json.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeFaq(idx)}
                                                    className="text-rose-500 text-xs flex items-center gap-1 pt-1"
                                                >
                                                    <Trash2 className="w-3 h-3" /> Remove Q&A
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Revision Note (if editing) */}
                        {isEdit && (
                            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                                <label className="block text-xs font-bold text-slate-700">
                                    Revision Audit Note (Explain what was updated)
                                </label>
                                <input
                                    type="text"
                                    value={data.revision_note}
                                    onChange={(e) => setData('revision_note', e.target.value)}
                                    placeholder="e.g. Corrected compute metrics; added Geneva signing photo..."
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none"
                                />
                            </div>
                        )}
                    </div>

                    {/* RIGHT SIDEBAR: PUBLISHING, TAXONOMY & METADATA (1 column) */}
                    <div className="space-y-6">
                        {/* 1. PUBLISHING STATUS CARD */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
                                <span>Publishing Workflow</span>
                                <span className="font-mono text-[10px] text-blue-600">STATE CONTROL</span>
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Workflow Status
                                </label>
                                <select
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as any)}
                                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:outline-none"
                                >
                                    <option value="draft">Draft (Work in progress)</option>
                                    <option value="in_review">In Review (Awaiting Editor Approval)</option>
                                    <option value="approved">Approved</option>
                                    <option value="scheduled">Scheduled for Auto-Publish</option>
                                    <option value="published">Published Live</option>
                                </select>
                            </div>

                            {data.status === 'scheduled' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                                        Scheduled Date & Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={data.scheduled_at}
                                        onChange={(e) => setData('scheduled_at', e.target.value)}
                                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2"
                                    />
                                </div>
                            )}

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    {isEdit ? 'Save Changes & Update Revision' : 'Create & Save Article'}
                                </button>
                            </div>
                        </div>

                        {/* 2. TAXONOMY & HUB MAPPING */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                                Taxonomy & Classification
                            </h3>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Primary Section / Category *
                                </label>
                                <select
                                    value={data.primary_category_id}
                                    onChange={(e) => setData('primary_category_id', Number(e.target.value))}
                                    className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 focus:bg-white focus:outline-none font-medium"
                                >
                                    {categories.map((c) => (
                                        <option key={c.id} value={c.id}>
                                            {c.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                                    Topic Hub Association
                                </label>
                                <div className="space-y-1.5 max-h-36 overflow-y-auto border border-slate-200 rounded-lg p-2 text-xs">
                                    {topics.map((t) => (
                                        <label key={t.id} className="flex items-center gap-2 text-slate-700 cursor-pointer hover:bg-slate-50 p-1 rounded">
                                            <input
                                                type="checkbox"
                                                checked={data.topics.includes(t.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setData('topics', [...data.topics, t.id]);
                                                    } else {
                                                        setData('topics', data.topics.filter(id => id !== t.id));
                                                    }
                                                }}
                                                className="rounded text-blue-600"
                                            />
                                            <span>#{t.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* 3. HERO MEDIA */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                                    <Image className="w-4 h-4 text-blue-600" />
                                    Hero Photography
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setHeroMediaModalOpen(true)}
                                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition"
                                >
                                    <UploadCloud className="w-3.5 h-3.5" />
                                    <span>Upload / Library</span>
                                </button>
                            </div>

                            {data.hero_image_url ? (
                                <div className="space-y-2">
                                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border border-slate-200 group">
                                        <img src={data.hero_image_url} alt="Hero Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setHeroMediaModalOpen(true)}
                                                className="px-3 py-1.5 bg-white text-slate-900 rounded-lg text-xs font-bold shadow-xs hover:bg-slate-100 transition"
                                            >
                                                Change Image
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setData('hero_image_url', '')}
                                                className="px-3 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-rose-700 transition"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-mono block truncate" title={data.hero_image_url}>
                                        {data.hero_image_url}
                                    </span>
                                </div>
                            ) : (
                                <div
                                    onClick={() => setHeroMediaModalOpen(true)}
                                    className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-5 text-center cursor-pointer bg-slate-50 hover:bg-blue-50/40 transition group"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center mx-auto mb-2 group-hover:scale-105 transition shadow-2xs">
                                        <UploadCloud className="w-5 h-5" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-800 block">
                                        Upload or Select Lead Image
                                    </span>
                                    <span className="text-[11px] text-slate-500 mt-0.5 block">
                                        Auto-compressed to lightweight WebP
                                    </span>
                                </div>
                            )}

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Photo Caption & Attribution
                                </label>
                                <input
                                    type="text"
                                    value={data.hero_image_caption}
                                    onChange={(e) => setData('hero_image_caption', e.target.value)}
                                    placeholder="Photo: Reuters / Jane Doe"
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                                    Or paste external CDN / Unsplash URL:
                                </label>
                                <input
                                    type="url"
                                    value={data.hero_image_url}
                                    onChange={(e) => setData('hero_image_url', e.target.value)}
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full text-xs border border-slate-200 bg-slate-50 rounded-lg p-1.5 focus:bg-white focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* 4. EDITORIAL FLAGS */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 pb-2 border-b border-slate-100">
                                Placement & Flags
                            </h3>

                            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_breaking}
                                    onChange={(e) => setData('is_breaking', e.target.checked)}
                                    className="rounded text-rose-600"
                                />
                                <span className="text-rose-600 font-bold">Breaking News Banner</span>
                            </label>

                            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_featured}
                                    onChange={(e) => setData('is_featured', e.target.checked)}
                                    className="rounded text-blue-600"
                                />
                                <span>Homepage Visual Hero (Lead Story)</span>
                            </label>

                            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_trending}
                                    onChange={(e) => setData('is_trending', e.target.checked)}
                                    className="rounded text-blue-600"
                                />
                                <span>Trending Ranked Rail</span>
                            </label>

                            <label className="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_editors_pick}
                                    onChange={(e) => setData('is_editors_pick', e.target.checked)}
                                    className="rounded text-blue-600"
                                />
                                <span>Editor's Pick Badge</span>
                            </label>
                        </div>
                    </div>
                </div>
            </form>

            {/* Hero Media Library Modal */}
            <MediaLibraryModal
                isOpen={heroMediaModalOpen}
                onClose={() => setHeroMediaModalOpen(false)}
                onSelect={(media) => {
                    setData((prev) => ({
                        ...prev,
                        hero_image_url: media.url,
                        hero_image_caption: media.caption || prev.hero_image_caption,
                    }));
                }}
                title="Select Hero Photography"
            />
        </CmsLayout>
    );
}
