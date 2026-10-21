<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Tag;
use Inertia\Inertia;
use Inertia\Response;

class TagController extends Controller
{
    public function show(string $slug): Response
    {
        $tag = Tag::where('slug', $slug)->firstOrFail();

        $articles = $tag->articles()
            ->published()
            ->with(['category', 'user.authorProfile'])
            ->latest('published_at')
            ->paginate(9);

        $allCategories = Category::whereNull('parent_id')->with('children')->orderBy('sort_order')->get();

        return Inertia::render('public/tag', [
            'tag' => $tag,
            'articles' => $articles,
            'categories' => $allCategories,
        ]);
    }
}
