<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Category;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NewsPortalTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_homepage_loads_successfully_with_news_data(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_article_page_loads_with_structured_data(): void
    {
        $article = Article::published()->firstOrFail();

        $response = $this->get("/{$article->category->slug}/{$article->slug}");

        $response->assertStatus(200);
    }

    public function test_article_markdown_mirror_returns_machine_readable_content(): void
    {
        $article = Article::published()->firstOrFail();

        $response = $this->get("/{$article->category->slug}/{$article->slug}.md");

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/markdown; charset=utf-8');
        $this->assertStringContainsString($article->title, $response->getContent());
    }

    public function test_category_page_loads_successfully(): void
    {
        $category = Category::whereNull('parent_id')->firstOrFail();

        $response = $this->get("/{$category->slug}");

        $response->assertStatus(200);
    }

    public function test_topic_hub_loads_successfully(): void
    {
        $topic = Topic::firstOrFail();

        $response = $this->get("/topic/{$topic->slug}");

        $response->assertStatus(200);
    }

    public function test_rss_feed_generates_valid_xml(): void
    {
        $response = $this->get('/feed');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/xml; charset=utf-8');
        $this->assertStringContainsString('<rss version="2.0"', $response->getContent());
    }

    public function test_news_sitemap_generates_valid_xml(): void
    {
        $response = $this->get('/sitemaps/news.xml');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/xml; charset=utf-8');
        $this->assertStringContainsString('<news:news>', $response->getContent());
    }

    public function test_llms_txt_endpoint_returns_aeo_index(): void
    {
        $response = $this->get('/llms.txt');

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/plain; charset=utf-8');
        $this->assertStringContainsString('llms.txt', $response->getContent());
    }

    public function test_newsletter_subscription_creates_record(): void
    {
        $response = $this->post('/newsletter/subscribe', [
            'email' => 'reader@example.com',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('newsletter_subscribers', [
            'email' => 'reader@example.com',
        ]);
    }

    public function test_cms_dashboard_redirects_unauthenticated_guests(): void
    {
        $response = $this->get('/cms');

        $response->assertRedirect('/login');
    }

    public function test_cms_dashboard_accessible_by_authenticated_editor(): void
    {
        $editor = User::where('role', 'chief_editor')->firstOrFail();

        $response = $this->actingAs($editor)->get('/cms');

        $response->assertStatus(200);
    }

    public function test_cms_can_create_new_article(): void
    {
        $editor = User::where('role', 'chief_editor')->firstOrFail();
        $category = Category::firstOrFail();

        $response = $this->actingAs($editor)->post('/cms/articles', [
            'title' => 'Breakthrough in Nuclear Fusion Power Generation',
            'standfirst' => 'Scientists achieve sustained net energy gain in experimental tokamak.',
            'body' => '<p>A major milestone was achieved today in magnetic confinement research.</p>',
            'primary_category_id' => $category->id,
            'content_type' => 'news',
            'status' => 'published',
            'hero_image_url' => 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80',
            'tldr' => 'Tokamak reactor achieves sustained net positive energy output.',
            'key_facts' => ['Net energy gain verified', '500MW thermal yield reached'],
            'faq_json' => [['question' => 'When will commercial reactors open?', 'answer' => 'Projected by 2035.']],
        ]);

        $response->assertRedirect('/cms/articles');
        $this->assertDatabaseHas('articles', [
            'title' => 'Breakthrough in Nuclear Fusion Power Generation',
            'status' => 'published',
        ]);
    }
}
