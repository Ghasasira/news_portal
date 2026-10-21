<?php

namespace App\Console\Commands;

use App\Models\Article;
use App\Models\Category;
use App\Models\Topic;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class GenerateSitemapCommand extends Command
{
    protected $signature = 'sitemap:generate';
    protected $description = 'Generate physical sitemap.xml and news.xml files in the public directory';

    public function handle(): int
    {
        $appUrl = rtrim(config('app.url', url('/')), '/');
        $appName = config('app.name', 'NewsPortal');

        // 1. General Sitemap
        $categories = Category::all();
        $topics = Topic::all();
        $articles = Article::published()->latest('published_at')->take(500)->get();

        $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . PHP_EOL;

        // Home
        $xml .= '  <url>' . PHP_EOL;
        $xml .= '    <loc>' . $appUrl . '/</loc>' . PHP_EOL;
        $xml .= '    <changefreq>always</changefreq>' . PHP_EOL;
        $xml .= '    <priority>1.0</priority>' . PHP_EOL;
        $xml .= '  </url>' . PHP_EOL;

        foreach ($categories as $cat) {
            $xml .= '  <url>' . PHP_EOL;
            $xml .= '    <loc>' . $appUrl . '/' . $cat->slug . '</loc>' . PHP_EOL;
            $xml .= '    <changefreq>hourly</changefreq>' . PHP_EOL;
            $xml .= '    <priority>0.8</priority>' . PHP_EOL;
            $xml .= '  </url>' . PHP_EOL;
        }

        foreach ($topics as $topic) {
            $xml .= '  <url>' . PHP_EOL;
            $xml .= '    <loc>' . $appUrl . '/topic/' . $topic->slug . '</loc>' . PHP_EOL;
            $xml .= '    <changefreq>daily</changefreq>' . PHP_EOL;
            $xml .= '    <priority>0.8</priority>' . PHP_EOL;
            $xml .= '  </url>' . PHP_EOL;
        }

        foreach ($articles as $article) {
            $xml .= '  <url>' . PHP_EOL;
            $xml .= '    <loc>' . $appUrl . '/' . $article->category->slug . '/' . $article->slug . '</loc>' . PHP_EOL;
            $xml .= '    <lastmod>' . $article->updated_at->toIso8601String() . '</lastmod>' . PHP_EOL;
            $xml .= '    <priority>0.9</priority>' . PHP_EOL;
            $xml .= '  </url>' . PHP_EOL;
        }

        $xml .= '</urlset>';

        File::put(public_path('sitemap.xml'), $xml);
        $this->info('Successfully generated ' . public_path('sitemap.xml'));

        // 2. Google News Sitemap
        if (!File::isDirectory(public_path('sitemaps'))) {
            File::makeDirectory(public_path('sitemaps'), 0755, true);
        }

        $newsArticles = Article::published()
            ->where('published_at', '>=', now()->subHours(48))
            ->with(['category'])
            ->latest('published_at')
            ->get();

        $newsXml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
        $newsXml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">' . PHP_EOL;

        foreach ($newsArticles as $article) {
            $loc = $appUrl . '/' . $article->category->slug . '/' . $article->slug;
            $newsXml .= '  <url>' . PHP_EOL;
            $newsXml .= '    <loc>' . htmlspecialchars($loc) . '</loc>' . PHP_EOL;
            $newsXml .= '    <news:news>' . PHP_EOL;
            $newsXml .= '      <news:publication>' . PHP_EOL;
            $newsXml .= '        <news:name>' . htmlspecialchars($appName) . '</news:name>' . PHP_EOL;
            $newsXml .= '        <news:language>en</news:language>' . PHP_EOL;
            $newsXml .= '      </news:publication>' . PHP_EOL;
            $newsXml .= '      <news:publication_date>' . $article->published_at?->toIso8601String() . '</news:publication_date>' . PHP_EOL;
            $newsXml .= '      <news:title>' . htmlspecialchars($article->title) . '</news:title>' . PHP_EOL;
            $newsXml .= '    </news:news>' . PHP_EOL;
            $newsXml .= '  </url>' . PHP_EOL;
        }

        $newsXml .= '</urlset>';

        File::put(public_path('sitemaps/news.xml'), $newsXml);
        $this->info('Successfully generated ' . public_path('sitemaps/news.xml'));

        return Command::SUCCESS;
    }
}
