<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Topic;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CmsTaxonomyController extends Controller
{
    public function index(): Response
    {
        $categories = Category::with(['children', 'parent'])->withCount('articles')->orderBy('sort_order')->get();
        $topics = Topic::withCount('articles')->latest()->get();

        return Inertia::render('cms/taxonomy/index', [
            'categories' => $categories,
            'topics' => $topics,
        ]);
    }

    public function storeCategory(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'parent_id' => 'nullable|exists:categories,id',
            'description' => 'nullable|string',
            'accent_color' => 'nullable|string|max:20',
        ]);

        Category::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'parent_id' => $validated['parent_id'] ?? null,
            'description' => $validated['description'] ?? null,
            'accent_color' => $validated['accent_color'] ?? '#0066FF',
        ]);

        return back()->with('success', 'Category created.');
    }

    public function storeTopic(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'is_featured' => 'boolean',
        ]);

        Topic::create([
            'name' => $validated['name'],
            'slug' => Str::slug($validated['name']),
            'description' => $validated['description'] ?? null,
            'is_featured' => $validated['is_featured'] ?? false,
        ]);

        return back()->with('success', 'Topic created.');
    }
}
