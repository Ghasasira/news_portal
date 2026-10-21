<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Topic;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $breakingNews = Article::breaking()
            ->with(['category', 'user.authorProfile'])
            ->latest('published_at')
            ->first();

        $leadStory = Article::featured()
            ->with(['category', 'user.authorProfile', 'topics', 'tags'])
            ->latest('published_at')
            ->first();

        // Fallback lead story if none is explicitly marked featured
        if (!$leadStory) {
            $leadStory = Article::published()
                ->with(['category', 'user.authorProfile', 'topics', 'tags'])
                ->latest('published_at')
                ->first();
        }

        $trendingArticles = Article::trending()
            ->with(['category', 'user.authorProfile'])
            ->orderByDesc('view_count')
            ->take(5)
            ->get();

        $editorsPicks = Article::editorsPick()
            ->with(['category', 'user.authorProfile'])
            ->latest('published_at')
            ->take(4)
            ->get();

        $latestArticles = Article::published()
            ->where('id', '!=', $leadStory?->id)
            ->with(['category', 'user.authorProfile'])
            ->latest('published_at')
            ->take(6)
            ->get();

        $categories = Category::whereNull('parent_id')
            ->with(['children'])
            ->orderBy('sort_order')
            ->get();

        // Load 3 articles for each major category
        $categoryFeeds = [];
        foreach ($categories->take(5) as $category) {
            $categoryFeeds[] = [
                'category' => $category,
                'articles' => Article::published()
                    ->where(function ($q) use ($category) {
                        $q->where('primary_category_id', $category->id)
                          ->orWhereIn('primary_category_id', $category->children->pluck('id'));
                    })
                    ->with(['user.authorProfile'])
                    ->latest('published_at')
                    ->take(3)
                    ->get(),
            ];
        }

        $featuredTopics = Topic::where('is_featured', true)
            ->withCount('articles')
            ->take(4)
            ->get();

        return Inertia::render('public/home', [
            'breakingNews' => $breakingNews,
            'leadStory' => $leadStory,
            'trendingArticles' => $trendingArticles,
            'editorsPicks' => $editorsPicks,
            'latestArticles' => $latestArticles,
            'categoryFeeds' => $categoryFeeds,
            'featuredTopics' => $featuredTopics,
            'categories' => $categories,
        ]);
    }
}
