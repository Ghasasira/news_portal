import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import CmsLayout from '@/layouts/cms-layout';
import { Category, Topic } from '@/types/news';
import { PlusCircle, Layers, Sparkles } from 'lucide-react';

interface Props {
    categories: Category[];
    topics: Topic[];
}

export default function CmsTaxonomyIndex({ categories, topics }: Props) {
    const categoryForm = useForm({
        name: '',
        parent_id: '',
        description: '',
        accent_color: '#0066FF',
    });

    const topicForm = useForm({
        name: '',
        description: '',
        is_featured: false,
    });

    const handleCategorySubmit = (e: React.FormEvent) => {
        e.preventDefault();
        categoryForm.post('/cms/taxonomy/categories', {
            onSuccess: () => categoryForm.reset(),
        });
    };

    const handleTopicSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        topicForm.post('/cms/taxonomy/topics', {
            onSuccess: () => topicForm.reset(),
        });
    };

    return (
        <CmsLayout title="Taxonomy, Desks & Intelligence Hubs">
            <Head title="Taxonomy & Hubs | NEWSPORTAL CMS" />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* 1. CATEGORIES MANAGEMENT */}
                <div className="space-y-6">
                    {/* Add Category Form */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <Layers className="w-5 h-5 text-blue-600" />
                            <h2 className="text-base font-bold text-slate-900">Add Editorial Category</h2>
                        </div>

                        <form onSubmit={handleCategorySubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Category Name *
                                </label>
                                <input
                                    type="text"
                                    value={categoryForm.data.name}
                                    onChange={(e) => categoryForm.setData('name', e.target.value)}
                                    placeholder="e.g. Geopolitics or Artificial Intelligence"
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-blue-600"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                                        Parent Category (optional)
                                    </label>
                                    <select
                                        value={categoryForm.data.parent_id}
                                        onChange={(e) => categoryForm.setData('parent_id', e.target.value)}
                                        className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2 focus:outline-none"
                                    >
                                        <option value="">None (Top Level)</option>
                                        {categories.filter(c => !c.parent_id).map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                                        Accent Color
                                    </label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="color"
                                            value={categoryForm.data.accent_color}
                                            onChange={(e) => categoryForm.setData('accent_color', e.target.value)}
                                            className="h-8 w-12 border-none rounded cursor-pointer"
                                        />
                                        <span className="text-xs font-mono text-slate-500">{categoryForm.data.accent_color}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={categoryForm.data.description}
                                    onChange={(e) => categoryForm.setData('description', e.target.value)}
                                    rows={2}
                                    placeholder="Editorial desk remit..."
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:outline-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={categoryForm.processing}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs py-2 rounded-lg transition"
                            >
                                Save Category
                            </button>
                        </form>
                    </div>

                    {/* Categories Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                        <div className="p-4 border-b border-slate-200">
                            <h3 className="font-bold text-sm text-slate-900">Current Categories & Desks</h3>
                        </div>
                        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                            {categories.map((c) => (
                                <div key={c.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition">
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className="w-3 h-3 rounded-full shrink-0"
                                            style={{ backgroundColor: c.accent_color }}
                                        />
                                        <div>
                                            <span className="font-bold text-slate-900">{c.name}</span>
                                            {c.parent && (
                                                <span className="text-slate-400 text-[10px] block">
                                                    Subcategory of {c.parent.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono text-[10px]">
                                        {c.articles_count ?? 0} stories
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. TOPICS MANAGEMENT */}
                <div className="space-y-6">
                    {/* Add Topic Form */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                        <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                            <Sparkles className="w-5 h-5 text-purple-600" />
                            <h2 className="text-base font-bold text-slate-900">Create Intelligence Topic Hub</h2>
                        </div>

                        <form onSubmit={handleTopicSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Topic Hub Title *
                                </label>
                                <input
                                    type="text"
                                    value={topicForm.data.name}
                                    onChange={(e) => topicForm.setData('name', e.target.value)}
                                    placeholder="e.g. 2026 Global AI Accord"
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-1 focus:ring-purple-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">
                                    Topic Overview / Scope
                                </label>
                                <textarea
                                    value={topicForm.data.description}
                                    onChange={(e) => topicForm.setData('description', e.target.value)}
                                    rows={3}
                                    placeholder="Explain the background and ongoing tracking for this topic..."
                                    className="w-full text-xs border border-slate-300 rounded-lg p-2 focus:outline-none"
                                />
                            </div>

                            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer pt-1">
                                <input
                                    type="checkbox"
                                    checked={topicForm.data.is_featured}
                                    onChange={(e) => topicForm.setData('is_featured', e.target.checked)}
                                    className="rounded text-purple-600"
                                />
                                <span>Promote on Homepage Focus Hub Ribbon</span>
                            </label>

                            <button
                                type="submit"
                                disabled={topicForm.processing}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs py-2 rounded-lg transition"
                            >
                                Save Topic Hub
                            </button>
                        </form>
                    </div>

                    {/* Topics Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                        <div className="p-4 border-b border-slate-200">
                            <h3 className="font-bold text-sm text-slate-900">Current Ongoing Topic Hubs</h3>
                        </div>
                        <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
                            {topics.map((t) => (
                                <div key={t.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-slate-50 transition">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-slate-900">#{t.name}</span>
                                            {t.is_featured && (
                                                <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.2 rounded">
                                                    Featured
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-slate-400 text-[10px] line-clamp-1 mt-0.5">
                                            {t.description}
                                        </span>
                                    </div>
                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono text-[10px] shrink-0">
                                        {t.articles_count ?? 0} stories
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </CmsLayout>
    );
}
