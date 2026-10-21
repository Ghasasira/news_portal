<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Topic;
use Inertia\Inertia;
use Inertia\Response;

class TopicController extends Controller
{
    public function show(string $slug): Response
    {
        $topic = Topic::where('slug', $slug)->firstOrFail();

        $articles = $topic->articles()
            ->published()
            ->with(['category', 'user.authorProfile'])
            ->latest('published_at')
            ->paginate(9);

        $allCategories = Category::whereNull('parent_id')->with('children')->orderBy('sort_order')->get();

        return Inertia::render('public/topic', [
            'topic' => $topic,
            'articles' => $articles,
            'categories' => $allCategories,
        ]);
    }
}
