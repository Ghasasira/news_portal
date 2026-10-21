<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Reader;
use App\Models\SavedArticle;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

class ReaderSeparationTest extends TestCase
{
    use RefreshDatabase;

    protected Category $category;
    protected User $staffAuthor;
    protected Article $article;

    protected function setUp(): void
    {
        parent::setUp();

        $this->category = Category::create([
            'name' => 'Technology',
            'slug' => 'technology',
        ]);

        $this->staffAuthor = User::factory()->create([
            'role' => 'author',
            'email_verified_at' => now(),
        ]);

        $this->article = Article::create([
            'uuid' => Str::uuid()->toString(),
            'title' => 'Breakthrough Quantum Processor Tested',
            'slug' => 'breakthrough-quantum-processor-tested',
            'body' => 'Quantum computing reached a major milestone today.',
            'primary_category_id' => $this->category->id,
            'user_id' => $this->staffAuthor->id,
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    public function test_readers_table_supports_google_oauth_fields(): void
    {
        $reader = Reader::create([
            'name' => 'Amara K.',
            'email' => 'amara.k@gmail.com',
            'google_id' => 'google_oauth_123456789',
            'avatar_url' => 'https://lh3.googleusercontent.com/a/random-avatar',
            'email_verified_at' => now(),
            'is_active' => true,
        ]);

        $this->assertDatabaseHas('readers', [
            'email' => 'amara.k@gmail.com',
            'google_id' => 'google_oauth_123456789',
        ]);

        $this->assertTrue($reader->hasGoogleAuth());
        $this->assertNull($reader->password);
    }

    public function test_reader_guard_authenticates_reader_independently(): void
    {
        $reader = Reader::create([
            'name' => 'John Reader',
            'email' => 'john.reader@example.com',
            'password' => Hash::make('secret12345'),
            'email_verified_at' => now(),
        ]);

        Auth::guard('reader')->login($reader);

        $this->assertTrue(Auth::guard('reader')->check());
        $this->assertEquals($reader->id, Auth::guard('reader')->id());
        $this->assertFalse(Auth::guard('web')->check());
    }

    public function test_reader_cannot_access_editorial_cms(): void
    {
        $reader = Reader::create([
            'name' => 'Subscribed Reader',
            'email' => 'reader@example.com',
            'password' => Hash::make('secret12345'),
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($reader, 'reader')->get(route('cms.dashboard'));

        // Reader is not authenticated on the 'web' guard protecting CMS
        $response->assertRedirect(route('login'));
    }

    public function test_reader_can_bookmark_article_and_view_saved_articles(): void
    {
        $reader = Reader::create([
            'name' => 'Bookmark Collector',
            'email' => 'collector@example.com',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($reader, 'reader')
            ->post(route('articles.bookmark', $this->article));

        $response->assertRedirect();

        $this->assertDatabaseHas('saved_articles', [
            'reader_id' => $reader->id,
            'article_id' => $this->article->id,
        ]);

        $savedResponse = $this->actingAs($reader, 'reader')
            ->get(route('saved.articles'));

        $savedResponse->assertOk();
        $savedResponse->assertInertia(fn ($page) => $page
            ->component('public/saved')
            ->has('articles.data', 1)
        );
    }

    public function test_reader_can_post_comment_linked_to_reader_id(): void
    {
        $reader = Reader::create([
            'name' => 'Engaged Citizen',
            'email' => 'citizen@example.com',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($reader, 'reader')
            ->post(route('articles.comment', $this->article), [
                'content' => 'Fascinating implications for cryptography and global cybersecurity.',
            ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('comments', [
            'article_id' => $this->article->id,
            'reader_id' => $reader->id,
            'user_id' => null,
            'author_name' => 'Engaged Citizen',
            'content' => 'Fascinating implications for cryptography and global cybersecurity.',
        ]);
    }

    public function test_staff_user_and_reader_saved_articles_are_isolated(): void
    {
        $reader = Reader::create([
            'name' => 'Reader Alice',
            'email' => 'alice@example.com',
            'email_verified_at' => now(),
        ]);

        $staff = User::factory()->create([
            'role' => 'editor',
            'email_verified_at' => now(),
        ]);

        SavedArticle::create(['reader_id' => $reader->id, 'article_id' => $this->article->id]);
        SavedArticle::create(['user_id' => $staff->id, 'article_id' => $this->article->id]);

        $this->assertEquals(1, $reader->savedArticles()->count());
        $this->assertEquals(1, $staff->savedArticles()->count());
        $this->assertEquals($this->article->id, $reader->savedArticles()->first()->id);
        $this->assertEquals($this->article->id, $staff->savedArticles()->first()->id);
    }

    public function test_admin_can_view_readers_tab_in_cms(): void
    {
        $admin = User::factory()->create([
            'role' => 'super_admin',
            'email_verified_at' => now(),
        ]);

        $reader = Reader::create([
            'name' => 'Google User Bob',
            'email' => 'bob@gmail.com',
            'google_id' => 'g1234567',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin, 'web')
            ->get(route('cms.users.index', ['tab' => 'readers']));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('cms/users/index')
            ->where('activeTab', 'readers')
            ->has('readers.data', 1)
            ->where('stats.totalReaders', 1)
            ->where('stats.googleReaders', 1)
        );
    }

    public function test_admin_can_delete_reader_account(): void
    {
        $admin = User::factory()->create([
            'role' => 'chief_editor',
            'email_verified_at' => now(),
        ]);

        $reader = Reader::create([
            'name' => 'Spam Reader',
            'email' => 'spam@example.com',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin, 'web')
            ->delete(route('cms.readers.destroy', $reader));

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('readers', ['id' => $reader->id]);
    }

    public function test_guest_is_redirected_to_reader_login_when_accessing_saved_articles_or_bookmarking(): void
    {
        // Visiting /saved as guest redirects to /reader/login
        $savedResponse = $this->get(route('saved.articles'));
        $savedResponse->assertRedirect(route('reader.login'));

        // Attempting to bookmark as guest redirects to /reader/login
        $bookmarkResponse = $this->post(route('articles.bookmark', $this->article));
        $bookmarkResponse->assertRedirect(route('reader.login'));
    }

    public function test_guest_is_redirected_to_staff_login_when_accessing_cms(): void
    {
        $cmsResponse = $this->get(route('cms.dashboard'));
        $cmsResponse->assertRedirect(route('login'));
    }

    public function test_reader_login_portal_renders_reader_auth_page(): void
    {
        $response = $this->get(route('reader.login'));
        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('auth/reader-login')
            ->has('hasGoogleConfigured')
        );
    }

    public function test_reader_can_auto_onboard_and_login_via_reader_login_route(): void
    {
        $response = $this->post(route('reader.login.store'), [
            'email' => 'sarah.reader@example.com',
            'name' => 'Sarah Reader',
        ]);

        $response->assertRedirect(route('saved.articles'));
        $this->assertDatabaseHas('readers', [
            'email' => 'sarah.reader@example.com',
            'name' => 'Sarah Reader',
        ]);

        $this->assertTrue(Auth::guard('reader')->check());
        $this->assertEquals('sarah.reader@example.com', Auth::guard('reader')->user()->email);
        $this->assertFalse(Auth::guard('web')->check());
    }

    public function test_reader_can_logout_via_reader_logout_route(): void
    {
        $reader = Reader::create([
            'name' => 'Reader To Logout',
            'email' => 'logout.reader@example.com',
            'email_verified_at' => now(),
        ]);

        Auth::guard('reader')->login($reader);
        $this->assertTrue(Auth::guard('reader')->check());

        $response = $this->actingAs($reader, 'reader')->post(route('reader.logout'));
        $response->assertRedirect(route('home'));
        $this->assertFalse(Auth::guard('reader')->check());
    }

    public function test_google_redirect_in_dev_mode_authenticates_reader_demo(): void
    {
        // When GOOGLE_CLIENT_ID is not configured, redirects to demo reader session
        config(['services.google.client_id' => null]);

        $response = $this->get(route('auth.google.redirect'));
        $response->assertRedirect(route('saved.articles'));

        $this->assertTrue(Auth::guard('reader')->check());
        $this->assertEquals('reader.demo@gmail.com', Auth::guard('reader')->user()->email);
    }
}
