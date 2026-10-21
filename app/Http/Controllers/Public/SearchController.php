<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $query = $request->input('q', '');
        $categoryId = $request->input('category');
        $contentType = $request->input('type');

        $articlesQuery = Article::published()
            ->with(['category', 'user.authorProfile']);

        if (!empty($query)) {
            $articlesQuery->where(function ($q) use ($query) {
                $q->where('title', 'like', "%{$query}%")
                  ->orWhere('standfirst', 'like', "%{$query}%")
                  ->orWhere('body', 'like', "%{$query}%");
            });
        }

        if ($categoryId) {
            $articlesQuery->where('primary_category_id', $categoryId);
        }

        if ($contentType) {
            $articlesQuery->where('content_type', $contentType);
        }

        $results = $articlesQuery->latest('published_at')->paginate(10)->withQueryString();

        $allCategories = Category::whereNull('parent_id')->with('children')->orderBy('sort_order')->get();

        return Inertia::render('public/search', [
            'query' => $query,
            'selectedCategory' => $categoryId,
            'selectedType' => $contentType,
            'results' => $results,
            'categories' => $allCategories,
        ]);
    }
}
