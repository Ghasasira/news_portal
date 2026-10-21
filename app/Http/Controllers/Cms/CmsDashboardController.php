<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CmsDashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        if (! $user instanceof User || ! $user->canAccessCms()) {
            abort(403, 'Unauthorized access to Newsroom CMS.');
        }

        $stats = [
            'totalArticles' => Article::count(),
            'published' => Article::where('status', 'published')->count(),
            'inReview' => Article::where('status', 'in_review')->count(),
            'drafts' => Article::where('status', 'draft')->count(),
            'scheduled' => Article::where('status', 'scheduled')->count(),
            'totalViews' => (int) Article::sum('view_count'),
        ];

        $recentArticles = Article::with(['category', 'user.authorProfile'])
            ->latest('updated_at')
            ->take(8)
            ->get();

        $pendingReviews = Article::where('status', 'in_review')
            ->with(['category', 'user.authorProfile'])
            ->latest('updated_at')
            ->take(5)
            ->get();

        return Inertia::render('cms/dashboard', [
            'stats' => $stats,
            'recentArticles' => $recentArticles,
            'pendingReviews' => $pendingReviews,
            'userRole' => $user->role,
        ]);
    }
}
