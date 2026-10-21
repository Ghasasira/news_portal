<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Inertia\Inertia;
use Inertia\Response;

class ArticleController extends Controller
{
    public function show(string $categorySlug, string $slug, Request $request): Response
    {
        $category = Category::where('slug', $categorySlug)->firstOrFail();

        $article = Article::published()
            ->where('slug', $slug)
            ->where(function ($q) use ($category) {
                $q->where('primary_category_id', $category->id)
                  ->orWhereIn('primary_category_id', $category->children->pluck('id'));
            })
            ->with([
                'category',
                'user.authorProfile',
                'topics',
                'tags',
                'seo',
                'aiMeta',
                'comments.user',
            ])
            ->firstOrFail();

        // Increment views
        $article->increment('view_count');

        // Related stories
        $relatedArticles = Article::published()
            ->where('id', '!=', $article->id)
            ->where(function ($q) use ($article) {
                $q->where('primary_category_id', $article->primary_category_id)
                  ->orWhereHas('tags', fn ($t) => $t->whereIn('tags.id', $article->tags->pluck('id')));
            })
            ->with(['category', 'user.authorProfile'])
            ->latest('published_at')
            ->take(3)
            ->get();

        // Check if saved by current reader (saved stories belong to readers)
        $isSaved = false;
        if ($reader = $request->user('reader')) {
            $isSaved = $reader->savedArticles()->where('article_id', $article->id)->exists();
        }

        // Schema.org NewsArticle JSON-LD
        $jsonLd = [
            '@context' => 'https://schema.org',
            '@type' => 'NewsArticle',
            'mainEntityOfPage' => [
                '@type' => 'WebPage',
                '@id' => url("/{$article->category->slug}/{$article->slug}"),
            ],
            'image' => array_values(array_filter([
                $article->hero_image_url
                    ? (str_starts_with($article->hero_image_url, 'http') ? $article->hero_image_url : url($article->hero_image_url))
                    : null,
            ])),
            'dateModified' => $article->updated_at->toIso8601String(),
            'author' => [
                '@type' => 'Person',
                'name' => $article->user->name,
                'url' => url("/author/{$article->user->authorProfile?->slug}"),
            ],
            'publisher' => [
                '@type' => 'NewsMediaOrganization',
                'name' => config('app.name', 'NewsPortal'),
                'logo' => [
                    '@type' => 'ImageObject',
                    'url' => url('/favicon.svg'),
                ],
            ],
            'articleSection' => $article->category->name,
            'keywords' => $article->tags->pluck('name')->toArray(),
        ];

        // BreadcrumbList JSON-LD
        $breadcrumbLd = [
            '@context' => 'https://schema.org',
            '@type' => 'BreadcrumbList',
            'itemListElement' => [
                ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => url('/')],
                ['@type' => 'ListItem', 'position' => 2, 'name' => $article->category->name, 'item' => url("/{$article->category->slug}")],
                ['@type' => 'ListItem', 'position' => 3, 'name' => $article->title],
            ],
        ];

        $faqLd = null;
        if ($article->aiMeta?->faq_json && count($article->aiMeta->faq_json) > 0) {
            $faqLd = [
                '@context' => 'https://schema.org',
                '@type' => 'FAQPage',
                'mainEntity' => array_map(fn ($item) => [
                    '@type' => 'Question',
                    'name' => $item['question'],
                    'acceptedAnswer' => [
                        '@type' => 'Answer',
                        'text' => $item['answer'],
                    ],
                ], $article->aiMeta->faq_json),
            ];
        }

        $allCategories = Category::whereNull('parent_id')->with('children')->orderBy('sort_order')->get();

        return Inertia::render('public/article', [
            'article' => $article,
            'relatedArticles' => $relatedArticles,
            'isSaved' => $isSaved,
            'jsonLd' => $jsonLd,
            'breadcrumbLd' => $breadcrumbLd,
            'faqLd' => $faqLd,
            'categories' => $allCategories,
        ]);
    }

    public function markdown(string $categorySlug, string $slug): HttpResponse
    {
        $category = Category::where('slug', $categorySlug)->firstOrFail();
        $article = Article::published()
            ->where('slug', $slug)
            ->where('primary_category_id', $category->id)
            ->with(['category', 'user.authorProfile', 'topics', 'tags', 'aiMeta'])
            ->firstOrFail();

        $content = "# {$article->title}\n\n";
        $content .= "**By**: [{$article->user->name}](" . url("/author/{$article->user->authorProfile?->slug}") . ")\n";
        $content .= "**Published**: {$article->published_at?->toFormattedDateString()}\n";
        $content .= "**Category**: {$article->category->name}\n";
        $content .= "**Canonical URL**: " . url("/{$article->category->slug}/{$article->slug}") . "\n\n";

        if ($article->standfirst) {
            $content .= "> {$article->standfirst}\n\n";
        }

        if ($article->aiMeta?->tldr) {
            $content .= "### TL;DR\n{$article->aiMeta->tldr}\n\n";
        }

        if ($article->aiMeta?->key_facts) {
            $content .= "### Key Facts\n";
            foreach ($article->aiMeta->key_facts as $fact) {
                $content .= "- {$fact}\n";
            }
            $content .= "\n";
        }

        $content .= "## Full Article\n\n" . strip_tags($article->body) . "\n\n";

        if ($article->aiMeta?->faq_json) {
            $content .= "## Frequently Asked Questions\n\n";
            foreach ($article->aiMeta->faq_json as $faq) {
                $content .= "### {$faq['question']}\n{$faq['answer']}\n\n";
            }
        }

        return response($content, 200, [
            'Content-Type' => 'text/markdown; charset=utf-8',
            'X-Robots-Tag' => 'all',
        ]);
    }
}
