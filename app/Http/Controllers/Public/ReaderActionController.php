<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Comment;
use App\Models\NewsletterSubscriber;
use App\Models\SavedArticle;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReaderActionController extends Controller
{
    public function toggleBookmark(Article $article, Request $request): RedirectResponse
    {
        $user = $request->user();
        if (!$user) {
            return redirect()->route('login');
        }

        $saved = SavedArticle::where('user_id', $user->id)->where('article_id', $article->id)->first();
        if ($saved) {
            $saved->delete();
        } else {
            SavedArticle::create(['user_id' => $user->id, 'article_id' => $article->id]);
        }

        return back();
    }

    public function savedArticles(Request $request): Response
    {
        $user = $request->user();

        $saved = $user ? $user->savedArticles()
            ->with(['category', 'user.authorProfile'])
            ->latest('published_at')
            ->paginate(12) : collect();

        $allCategories = Category::whereNull('parent_id')->with('children')->orderBy('sort_order')->get();

        return Inertia::render('public/saved', [
            'articles' => $saved,
            'categories' => $allCategories,
        ]);
    }

    public function subscribeNewsletter(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => 'required|email|max:255',
        ]);

        NewsletterSubscriber::firstOrCreate(
            ['email' => $validated['email']],
            ['is_active' => true]
        );

        return back()->with('success', 'Thank you for subscribing to our morning brief!');
    }

    public function postComment(Article $article, Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'content' => 'required|string|min:3|max:1000',
            'author_name' => $user ? 'nullable|string' : 'required|string|max:100',
        ]);

        Comment::create([
            'article_id' => $article->id,
            'user_id' => $user?->id,
            'author_name' => $user ? $user->name : $validated['author_name'],
            'content' => $validated['content'],
            'status' => 'approved',
        ]);

        return back()->with('success', 'Your comment has been posted.');
    }
}
