<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\AuthorProfile;
use App\Models\Category;
use App\Models\User;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AuthorController extends Controller
{
    public function show(string $slug): Response
    {
        $authorProfile = AuthorProfile::where('slug', $slug)
            ->with(['user'])
            ->first();

        if (! $authorProfile) {
            // Fallback resolution: attempt to match a User by name slug or numeric ID
            $user = User::all()->first(fn (User $u) => Str::slug($u->name) === $slug || (string) $u->id === $slug);

            if ($user) {
                $baseSlug = Str::slug($user->name) ?: 'author-'.$user->id;
                $authorProfile = $user->authorProfile()->firstOrCreate(
                    ['user_id' => $user->id],
                    [
                        'slug' => $baseSlug,
                        'beat' => 'News Desk',
                        'bio' => 'Journalist and contributing writer for NewsPortal.',
                        'is_verified' => true,
                    ]
                );
                $authorProfile->load('user');
            } else {
                abort(404, 'Author profile not found.');
            }
        }

        $articles = $authorProfile->user->articles()
            ->published()
            ->with(['category', 'user.authorProfile', 'topics', 'tags'])
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->paginate(12)
            ->withQueryString();

        $totalArticlesCount = $authorProfile->user->articles()->published()->count();
        $allCategories = Category::whereNull('parent_id')->with('children')->orderBy('sort_order')->get();

        return Inertia::render('public/author', [
            'author' => $authorProfile,
            'articles' => $articles,
            'totalArticlesCount' => $totalArticlesCount,
            'categories' => $allCategories,
        ]);
    }
}

