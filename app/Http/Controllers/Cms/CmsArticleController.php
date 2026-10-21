<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\ArticleAiMeta;
use App\Models\ArticleRevision;
use App\Models\ArticleSeo;
use App\Models\Category;
use App\Models\Tag;
use App\Models\Topic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CmsArticleController extends Controller
{
    public function index(Request $request): Response
    {
        $status = $request->query('status');
        $categoryId = $request->query('category');
        $search = $request->query('search');

        $query = Article::with(['category', 'user.authorProfile']);

        if ($status) {
            $query->where('status', $status);
        }
        if ($categoryId) {
            $query->where('primary_category_id', $categoryId);
        }
        if ($search) {
            $query->where('title', 'like', "%{$search}%");
        }

        $articles = $query->latest('updated_at')->paginate(12)->withQueryString();
        $categories = Category::all();

        return Inertia::render('cms/articles/index', [
            'articles' => $articles,
            'categories' => $categories,
            'filters' => [
                'status' => $status,
                'category' => $categoryId,
                'search' => $search,
            ],
        ]);
    }

    public function create(): Response
    {
        $categories = Category::whereNull('parent_id')->with('children')->get();
        $topics = Topic::all();
        $tags = Tag::all();

        return Inertia::render('cms/articles/form', [
            'article' => null,
            'categories' => $categories,
            'topics' => $topics,
            'tags' => $tags,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:articles,slug',
            'standfirst' => 'nullable|string',
            'body' => 'required|string',
            'primary_category_id' => 'required|exists:categories,id',
            'content_type' => 'required|string|in:news,opinion,analysis,explainer,liveblog,video',
            'status' => 'required|string|in:draft,in_review,approved,scheduled,published',
            'hero_image_url' => 'nullable|url',
            'hero_image_caption' => 'nullable|string',
            'is_breaking' => 'boolean',
            'is_featured' => 'boolean',
            'is_trending' => 'boolean',
            'is_editors_pick' => 'boolean',
            'scheduled_at' => 'nullable|date',
            // SEO & AI Meta
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:300',
            'focus_keyword' => 'nullable|string|max:100',
            'tldr' => 'nullable|string',
            'key_facts' => 'nullable|array',
            'faq_json' => 'nullable|array',
            'topics' => 'nullable|array',
            'tags' => 'nullable|array',
        ]);

        $user = $request->user();

        $slug = !empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['title']);
        $publishedAt = ($validated['status'] === 'published') ? now() : null;

        $wordCount = str_word_count(strip_tags($validated['body']));
        $readingTime = max(1, (int) ceil($wordCount / 200));

        $article = Article::create([
            'uuid' => (string) Str::uuid(),
            'title' => $validated['title'],
            'slug' => $slug,
            'standfirst' => $validated['standfirst'] ?? null,
            'body' => $validated['body'],
            'primary_category_id' => $validated['primary_category_id'],
            'user_id' => $user->id,
            'content_type' => $validated['content_type'],
            'status' => $validated['status'],
            'hero_image_url' => $validated['hero_image_url'] ?? null,
            'hero_image_caption' => $validated['hero_image_caption'] ?? null,
            'reading_time_minutes' => $readingTime,
            'is_breaking' => $validated['is_breaking'] ?? false,
            'is_featured' => $validated['is_featured'] ?? false,
            'is_trending' => $validated['is_trending'] ?? false,
            'is_editors_pick' => $validated['is_editors_pick'] ?? false,
            'published_at' => $publishedAt,
            'scheduled_at' => $validated['scheduled_at'] ?? null,
        ]);

        // Attach topics and tags
        if (!empty($validated['topics'])) {
            $article->topics()->sync($validated['topics']);
        }
        if (!empty($validated['tags'])) {
            $article->tags()->sync($validated['tags']);
        }

        // Create SEO record
        ArticleSeo::create([
            'article_id' => $article->id,
            'meta_title' => $validated['meta_title'] ?? ($article->title . ' | NewsPortal'),
            'meta_description' => $validated['meta_description'] ?? Str::limit($article->standfirst, 155),
            'focus_keyword' => $validated['focus_keyword'] ?? null,
            'score' => 90,
        ]);

        // Create AI / AEO record
        ArticleAiMeta::create([
            'article_id' => $article->id,
            'tldr' => $validated['tldr'] ?? null,
            'key_facts' => $validated['key_facts'] ?? [],
            'faq_json' => $validated['faq_json'] ?? [],
            'aeo_score' => 95,
        ]);

        return redirect()->route('cms.articles.index')->with('success', 'Article successfully created.');
    }

    public function edit(Article $article): Response
    {
        $article->load(['category', 'topics', 'tags', 'seo', 'aiMeta', 'revisions.user']);
        $categories = Category::whereNull('parent_id')->with('children')->get();
        $topics = Topic::all();
        $tags = Tag::all();

        return Inertia::render('cms/articles/form', [
            'article' => $article,
            'categories' => $categories,
            'topics' => $topics,
            'tags' => $tags,
        ]);
    }

    public function update(Article $article, Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => "nullable|string|max:255|unique:articles,slug,{$article->id}",
            'standfirst' => 'nullable|string',
            'body' => 'required|string',
            'primary_category_id' => 'required|exists:categories,id',
            'content_type' => 'required|string|in:news,opinion,analysis,explainer,liveblog,video',
            'status' => 'required|string|in:draft,in_review,approved,scheduled,published',
            'hero_image_url' => 'nullable|url',
            'hero_image_caption' => 'nullable|string',
            'is_breaking' => 'boolean',
            'is_featured' => 'boolean',
            'is_trending' => 'boolean',
            'is_editors_pick' => 'boolean',
            'scheduled_at' => 'nullable|date',
            'revision_note' => 'nullable|string',
            // SEO & AI Meta
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:300',
            'focus_keyword' => 'nullable|string|max:100',
            'tldr' => 'nullable|string',
            'key_facts' => 'nullable|array',
            'faq_json' => 'nullable|array',
            'topics' => 'nullable|array',
            'tags' => 'nullable|array',
        ]);

        $user = $request->user();

        // Save revision
        ArticleRevision::create([
            'article_id' => $article->id,
            'user_id' => $user->id,
            'title' => $article->title,
            'standfirst' => $article->standfirst,
            'body' => $article->body,
            'note' => $validated['revision_note'] ?? 'Editorial update',
        ]);

        $publishedAt = $article->published_at;
        if ($validated['status'] === 'published' && !$publishedAt) {
            $publishedAt = now();
        }

        $wordCount = str_word_count(strip_tags($validated['body']));
        $readingTime = max(1, (int) ceil($wordCount / 200));

        $article->update([
            'title' => $validated['title'],
            'slug' => !empty($validated['slug']) ? Str::slug($validated['slug']) : $article->slug,
            'standfirst' => $validated['standfirst'] ?? null,
            'body' => $validated['body'],
            'primary_category_id' => $validated['primary_category_id'],
            'content_type' => $validated['content_type'],
            'status' => $validated['status'],
            'hero_image_url' => $validated['hero_image_url'] ?? null,
            'hero_image_caption' => $validated['hero_image_caption'] ?? null,
            'reading_time_minutes' => $readingTime,
            'is_breaking' => $validated['is_breaking'] ?? false,
            'is_featured' => $validated['is_featured'] ?? false,
            'is_trending' => $validated['is_trending'] ?? false,
            'is_editors_pick' => $validated['is_editors_pick'] ?? false,
            'published_at' => $publishedAt,
            'scheduled_at' => $validated['scheduled_at'] ?? null,
        ]);

        if (isset($validated['topics'])) {
            $article->topics()->sync($validated['topics']);
        }
        if (isset($validated['tags'])) {
            $article->tags()->sync($validated['tags']);
        }

        ArticleSeo::updateOrCreate(
            ['article_id' => $article->id],
            [
                'meta_title' => $validated['meta_title'] ?? ($article->title . ' | NewsPortal'),
                'meta_description' => $validated['meta_description'] ?? Str::limit($article->standfirst, 155),
                'focus_keyword' => $validated['focus_keyword'] ?? null,
                'score' => 92,
            ]
        );

        ArticleAiMeta::updateOrCreate(
            ['article_id' => $article->id],
            [
                'tldr' => $validated['tldr'] ?? null,
                'key_facts' => $validated['key_facts'] ?? [],
                'faq_json' => $validated['faq_json'] ?? [],
                'aeo_score' => 96,
            ]
        );

        return redirect()->route('cms.articles.index')->with('success', 'Article updated.');
    }

    public function destroy(Article $article): RedirectResponse
    {
        $article->delete();
        return redirect()->route('cms.articles.index')->with('success', 'Article deleted.');
    }

    public function transition(Article $article, Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:draft,in_review,approved,published,archived',
        ]);

        $publishedAt = $article->published_at;
        if ($validated['status'] === 'published' && !$publishedAt) {
            $publishedAt = now();
        }

        $article->update([
            'status' => $validated['status'],
            'published_at' => $publishedAt,
        ]);

        return back()->with('success', "Article moved to {$validated['status']}.");
    }
}
