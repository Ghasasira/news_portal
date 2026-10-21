<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\AuthorProfile;
use App\Models\Category;
use Inertia\Inertia;
use Inertia\Response;

class AuthorController extends Controller
{
    public function show(string $slug): Response
    {
        $authorProfile = AuthorProfile::where('slug', $slug)
            ->with(['user'])
            ->firstOrFail();

        $articles = $authorProfile->user->articles()
            ->published()
            ->with(['category'])
            ->latest('published_at')
            ->paginate(9);

        $allCategories = Category::whereNull('parent_id')->with('children')->orderBy('sort_order')->get();

        return Inertia::render('public/author', [
            'author' => $authorProfile,
            'articles' => $articles,
            'categories' => $allCategories,
        ]);
    }
}
