<?php

use App\Http\Controllers\Cms\CmsArticleController;
use App\Http\Controllers\Cms\CmsDashboardController;
use App\Http\Controllers\Cms\CmsTaxonomyController;
use App\Http\Controllers\Public\ArticleController;
use App\Http\Controllers\Public\AuthorController;
use App\Http\Controllers\Public\CategoryController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\MachineFeedsController;
use App\Http\Controllers\Public\ReaderActionController;
use App\Http\Controllers\Public\SearchController;
use App\Http\Controllers\Public\TagController;
use App\Http\Controllers\Public\TopicController;
use Illuminate\Support\Facades\Route;

// Public Portal Homepage
Route::get('/', HomeController::class)->name('home');

// Machine Feeds & AEO / GEO Discovery
Route::get('/feed', [MachineFeedsController::class, 'feed'])->name('feed');
Route::get('/sitemaps/news.xml', [MachineFeedsController::class, 'newsSitemap'])->name('sitemap.news');
Route::get('/sitemap.xml', [MachineFeedsController::class, 'sitemap'])->name('sitemap');
Route::get('/llms.txt', [MachineFeedsController::class, 'llms'])->name('llms.txt');
Route::get('/llms-full.txt', [MachineFeedsController::class, 'llmsFull'])->name('llms.full');

// Public Search
Route::get('/search', SearchController::class)->name('search');

// Public Taxonomies
Route::get('/topic/{slug}', [TopicController::class, 'show'])->name('topic.show');
Route::get('/tag/{slug}', [TagController::class, 'show'])->name('tag.show');
Route::get('/author/{slug}', [AuthorController::class, 'show'])->name('author.show');

// Reader Actions
Route::post('/newsletter/subscribe', [ReaderActionController::class, 'subscribeNewsletter'])->name('newsletter.subscribe');
Route::post('/articles/{article}/comments', [ReaderActionController::class, 'postComment'])->name('articles.comment');

// Authenticated Reader Actions
Route::middleware(['auth'])->group(function () {
    Route::get('/saved', [ReaderActionController::class, 'savedArticles'])->name('saved.articles');
    Route::post('/articles/{article}/bookmark', [ReaderActionController::class, 'toggleBookmark'])->name('articles.bookmark');
});

// Editorial CMS Routes
Route::middleware(['auth', 'verified'])->prefix('cms')->name('cms.')->group(function () {
    Route::get('/', CmsDashboardController::class)->name('dashboard');

    Route::resource('articles', CmsArticleController::class)->except(['show']);
    Route::post('articles/{article}/transition', [CmsArticleController::class, 'transition'])->name('articles.transition');

    Route::get('taxonomy', [CmsTaxonomyController::class, 'index'])->name('taxonomy.index');
    Route::post('taxonomy/categories', [CmsTaxonomyController::class, 'storeCategory'])->name('taxonomy.categories.store');
    Route::post('taxonomy/topics', [CmsTaxonomyController::class, 'storeTopic'])->name('taxonomy.topics.store');
});

// Existing default settings
Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

require __DIR__.'/settings.php';

// Public Articles & Categories (Must come last to prevent catching static routes)
Route::get('/{categorySlug}/{slug}.md', [ArticleController::class, 'markdown'])->name('article.markdown');
Route::get('/{categorySlug}/{slug}', [ArticleController::class, 'show'])->name('article.show');
Route::get('/{slug}', [CategoryController::class, 'show'])->name('category.show');
