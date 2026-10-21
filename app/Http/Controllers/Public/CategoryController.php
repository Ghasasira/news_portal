<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function show(string $slug, Request $request): Response
    {
        $category = Category::where('slug', $slug)
            ->with(['children', 'parent'])
            ->firstOrFail();

        $subcategoryId = $request->query('subcategory');
        $activeSubcategory = null;

        $articlesQuery = Article::published()
            ->with(['category', 'user.authorProfile']);

        if ($subcategoryId) {
            $activeSubcategory = Category::find($subcategoryId);
            $articlesQuery->where('primary_category_id', $subcategoryId);
        } else {
            $articlesQuery->where(function ($q) use ($category) {
                $q->where('primary_category_id', $category->id)
                  ->orWhereIn('primary_category_id', $category->children->pluck('id'));
            });
        }

        $articles = $articlesQuery->latest('published_at')->paginate(9)->withQueryString();

        $allCategories = Category::whereNull('parent_id')->with('children')->orderBy('sort_order')->get();

        return Inertia::render('public/category', [
            'category' => $category,
            'activeSubcategory' => $activeSubcategory,
            'articles' => $articles,
            'categories' => $allCategories,
        ]);
    }
}
