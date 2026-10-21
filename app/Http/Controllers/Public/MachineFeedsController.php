<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use App\Models\Topic;
use Illuminate\Http\Response;

class MachineFeedsController extends Controller
{
    public function feed(): Response
    {
        $articles = Article::published()
            ->with(['category', 'user'])
            ->latest('published_at')
            ->take(25)
            ->get();

        $appUrl = config('app.url', url('/'));
        $appName = config('app.name', 'NewsPortal');

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">' . PHP_EOL;
        $xml .= '  <channel>' . PHP_EOL;
        $xml .= '    <title>' . htmlspecialchars($appName) . '</title>' . PHP_EOL;
        $xml .= '    <link>' . htmlspecialchars($appUrl) . '</link>' . PHP_EOL;
        $xml .= '    <description>High-velocity news, investigative journalism, and analysis.</description>' . PHP_EOL;
        $xml .= '    <language>en-US</language>' . PHP_EOL;
        $xml .= '    <atom:link href="' . htmlspecialchars(url('/feed')) . '" rel="self" type="application/rss+xml" />' . PHP_EOL;

        foreach ($articles as $article) {
            $link = url("/{$article->category->slug}/{$article->slug}");
            $xml .= '    <item>' . PHP_EOL;
            $xml .= '      <title>' . htmlspecialchars($article->title) . '</title>' . PHP_EOL;
            $xml .= '      <link>' . htmlspecialchars($link) . '</link>' . PHP_EOL;
            $xml .= '      <guid isPermaLink="true">' . htmlspecialchars($link) . '</guid>' . PHP_EOL;
            $xml .= '      <description>' . htmlspecialchars($article->standfirst ?? '') . '</description>' . PHP_EOL;
            $xml .= '      <category>' . htmlspecialchars($article->category->name) . '</category>' . PHP_EOL;
            $xml .= '      <author>' . htmlspecialchars($article->user->email . ' (' . $article->user->name . ')') . '</author>' . PHP_EOL;
            $xml .= '      <pubDate>' . $article->published_at?->toRfc2822String() . '</pubDate>' . PHP_EOL;
            $xml .= '    </item>' . PHP_EOL;
        }

        $xml .= '  </channel>' . PHP_EOL;
        $xml .= '</rss>';

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=utf-8']);
    }

    public function newsSitemap(): Response
    {
        // Google News Sitemap: articles from the last 48 hours
        $articles = Article::published()
            ->where('published_at', '>=', now()->subHours(48))
            ->with(['category'])
            ->latest('published_at')
            ->get();

        $appName = config('app.name', 'NewsPortal');

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">' . PHP_EOL;

        foreach ($articles as $article) {
            $loc = url("/{$article->category->slug}/{$article->slug}");
            $xml .= '  <url>' . PHP_EOL;
            $xml .= '    <loc>' . htmlspecialchars($loc) . '</loc>' . PHP_EOL;
            $xml .= '    <news:news>' . PHP_EOL;
            $xml .= '      <news:publication>' . PHP_EOL;
            $xml .= '        <news:name>' . htmlspecialchars($appName) . '</news:name>' . PHP_EOL;
            $xml .= '        <news:language>en</news:language>' . PHP_EOL;
            $xml .= '      </news:publication>' . PHP_EOL;
            $xml .= '      <news:publication_date>' . $article->published_at?->toIso8601String() . '</news:publication_date>' . PHP_EOL;
            $xml .= '      <news:title>' . htmlspecialchars($article->title) . '</news:title>' . PHP_EOL;
            $xml .= '    </news:news>' . PHP_EOL;
            $xml .= '  </url>' . PHP_EOL;
        }

        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=utf-8']);
    }

    public function sitemap(): Response
    {
        $categories = Category::all();
        $topics = Topic::all();
        $articles = Article::published()->latest('published_at')->take(100)->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

        // Home
        $xml .= '  <url><loc>' . url('/') . '</loc><changefreq>always</changefreq><priority>1.0</priority></url>' . PHP_EOL;

        foreach ($categories as $cat) {
            $xml .= '  <url><loc>' . url("/{$cat->slug}") . '</loc><changefreq>hourly</changefreq><priority>0.8</priority></url>' . PHP_EOL;
        }

        foreach ($topics as $topic) {
            $xml .= '  <url><loc>' . url("/topic/{$topic->slug}") . '</loc><changefreq>daily</changefreq><priority>0.8</priority></url>' . PHP_EOL;
        }

        foreach ($articles as $article) {
            $xml .= '  <url><loc>' . url("/{$article->category->slug}/{$article->slug}") . '</loc><lastmod>' . $article->updated_at->toIso8601String() . '</lastmod><priority>0.9</priority></url>' . PHP_EOL;
        }

        $xml .= '</urlset>';

        return response($xml, 200, ['Content-Type' => 'application/xml; charset=utf-8']);
    }

    public function llms(): Response
    {
        $appName = config('app.name', 'NewsPortal');
        $appUrl = config('app.url', url('/'));

        $articles = Article::published()
            ->with(['category', 'aiMeta'])
            ->latest('published_at')
            ->take(10)
            ->get();

        $txt = "# {$appName} — Machine-Readable Intelligence Index (llms.txt)\n\n";
        $txt .= "> {$appName} provides authoritative, real-time investigative journalism and analysis across world politics, artificial intelligence, clean energy, and capital markets.\n\n";
        $txt .= "## Key Endpoints\n";
        $txt .= "- News Feed (RSS): {$appUrl}/feed\n";
        $txt .= "- Google News Sitemap: {$appUrl}/sitemaps/news.xml\n";
        $txt .= "- Full LLM Index: {$appUrl}/llms-full.txt\n\n";
        $txt .= "## Latest Canonical Articles (Markdown Mirrors Available)\n";

        foreach ($articles as $article) {
            $mdUrl = url("/{$article->category->slug}/{$article->slug}.md");
            $txt .= "- [{$article->title}]({$mdUrl}): {$article->standfirst}\n";
        }

        return response($txt, 200, ['Content-Type' => 'text/plain; charset=utf-8']);
    }

    public function llmsFull(): Response
    {
        $articles = Article::published()
            ->with(['category', 'user.authorProfile', 'aiMeta'])
            ->latest('published_at')
            ->take(15)
            ->get();

        $txt = "# Complete Machine Digest\n\n";
        foreach ($articles as $article) {
            $txt .= "## {$article->title}\n";
            $txt .= "- Author: {$article->user->name}\n";
            $txt .= "- Section: {$article->category->name}\n";
            $txt .= "- URL: " . url("/{$article->category->slug}/{$article->slug}") . "\n";
            if ($article->aiMeta?->tldr) {
                $txt .= "- TL;DR: {$article->aiMeta->tldr}\n";
            }
            if ($article->aiMeta?->key_facts) {
                $txt .= "- Key Takeaways:\n";
                foreach ($article->aiMeta->key_facts as $f) {
                    $txt .= "  * {$f}\n";
                }
            }
            $txt .= "\n";
        }

        return response($txt, 200, ['Content-Type' => 'text/plain; charset=utf-8']);
    }
}
