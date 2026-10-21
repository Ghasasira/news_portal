import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import PublicLayout from '@/layouts/public-layout';
import { Article, Category, PaginatedData, Topic } from '@/types/news';
import { Sparkles, Calendar, ChevronDown, ChevronUp, Clock } from 'lucide-react';

interface Props {
    topic: Topic;
    articles: PaginatedData<Article>;
    categories: Category[];
}

export default function TopicPage({ topic, articles, categories }: Props) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <PublicLayout categories={categories}>
            <Head title={`${topic.name} — Topic Hub & Real-Time Tracking | NEWSPORTAL`} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-12">
                {/* Header */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-8 sm:p-10 rounded-2xl shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-blue-600 text-white font-extrabold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> Topic Intelligence Hub
                        </span>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-tight">
                        {topic.name}
                    </h1>
                    {topic.description && (
                        <p className="text-slate-300 text-sm sm:text-base max-w-3xl mt-3 leading-relaxed">
                            {topic.description}
                        </p>
                    )}
                </div>

                {/* Interactive Timeline */}
                {topic.timeline_json && topic.timeline_json.length > 0 && (
                    <div className="border border-slate-200 bg-white rounded-2xl p-6 sm:p-8">
                        <h2 className="text-xl font-bold font-serif text-slate-900 mb-6 flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Chronological Event Timeline
                        </h2>
                        <div className="relative border-l-2 border-blue-600 ml-3 sm:ml-4 space-y-6">
                            {topic.timeline_json.map((item, idx) => (
                                <div key={idx} className="relative pl-6">
                                    <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-600" />
                                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
                                        {item.date}
                                    </span>
                                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                                        {item.title}
                                    </h3>
                                    <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* FAQ Section */}
                {topic.faq_json && topic.faq_json.length > 0 && (
                    <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-6 sm:p-8">
                        <h2 className="text-xl font-bold font-serif text-slate-900 mb-6">
                            Frequently Asked Questions
                        </h2>
                        <div className="space-y-3">
                            {topic.faq_json.map((faq, idx) => (
                                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                        className="w-full text-left px-4 py-3.5 font-semibold text-sm sm:text-base text-slate-800 flex items-center justify-between hover:bg-slate-50 transition"
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
                    </div>
                )}

                {/* Associated Articles */}
                <div>
                    <h2 className="text-xl font-bold font-serif text-slate-900 mb-6">
                        All Reporting on {topic.name} ({articles.total})
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
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                                    {art.title}
                                </h3>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
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
            </div>
        </PublicLayout>
    );
}
