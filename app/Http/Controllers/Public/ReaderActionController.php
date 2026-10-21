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
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ReaderActionController extends Controller
{
    /**
     * Resolve the currently authenticated reader or staff user.
     */
    protected function resolveActor(Request $request): array
    {
        if ($reader = Auth::guard('reader')->user()) {
            return ['type' => 'reader', 'actor' => $reader];
        }

        if ($user = Auth::guard('web')->user()) {
            return ['type' => 'user', 'actor' => $user];
        }

        return ['type' => 'guest', 'actor' => null];
    }

    public function toggleBookmark(Article $article, Request $request): RedirectResponse
    {
        $reader = Auth::guard('reader')->user();

        if (! $reader) {
            return redirect()->route('reader.login');
        }

        $saved = SavedArticle::where('reader_id', $reader->id)->where('article_id', $article->id)->first();
        if ($saved) {
            $saved->delete();
        } else {
            SavedArticle::create(['reader_id' => $reader->id, 'article_id' => $article->id]);
        }

        return back();
    }

    public function savedArticles(Request $request): Response
    {
        $reader = Auth::guard('reader')->user();

        if (! $reader) {
            return redirect()->route('reader.login');
        }

        $saved = $reader->savedArticles()
            ->with(['category', 'user.authorProfile'])
            ->latest('published_at')
            ->paginate(12);

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
        $actorData = $this->resolveActor($request);
        $type = $actorData['type'];
        $actor = $actorData['actor'];

        $validated = $request->validate([
            'content' => 'required|string|min:3|max:1000',
            'author_name' => $actor ? 'nullable|string' : 'required|string|max:100',
        ]);

        Comment::create([
            'article_id' => $article->id,
            'reader_id' => $type === 'reader' ? $actor->id : null,
            'user_id' => $type === 'user' ? $actor->id : null,
            'author_name' => $actor ? $actor->name : $validated['author_name'],
            'content' => $validated['content'],
            'status' => 'approved',
        ]);

        return back()->with('success', 'Your comment has been posted.');
    }
}
