<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\AuthorProfile;
use App\Models\Category;
use App\Models\Comment;
use App\Models\Reader;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AuthorAndCommentsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed();
    }

    public function test_author_profile_page_loads_and_displays_latest_first(): void
    {
        $author = AuthorProfile::firstOrFail();
        $user = $author->user;

        // Ensure user has at least two articles with distinct published_at timestamps
        $category = Category::firstOrFail();
        $olderArticle = Article::create([
            'title' => 'Older Article by Author',
            'slug' => 'older-article-by-author',
            'standfirst' => 'Older standfirst text',
            'body' => 'Older body text',
            'content_type' => 'news',
            'status' => 'published',
            'published_at' => now()->subDays(5),
            'primary_category_id' => $category->id,
            'user_id' => $user->id,
            'reading_time_minutes' => 3,
        ]);

        $newerArticle = Article::create([
            'title' => 'Newer Article by Author',
            'slug' => 'newer-article-by-author',
            'standfirst' => 'Newer standfirst text',
            'body' => 'Newer body text',
            'content_type' => 'news',
            'status' => 'published',
            'published_at' => now()->subDay(),
            'primary_category_id' => $category->id,
            'user_id' => $user->id,
            'reading_time_minutes' => 4,
        ]);

        $response = $this->get("/author/{$author->slug}");

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('public/author')
            ->has('author')
            ->where('author.slug', $author->slug)
            ->where('author.user.name', $user->name)
            ->has('articles.data')
            // Verify newer article appears first
            ->where('articles.data.0.id', $newerArticle->id)
        );
    }

    public function test_author_profile_fallback_resolution_for_user_without_preexisting_slug(): void
    {
        $writer = User::create([
            'name' => 'Alice Wonder',
            'email' => 'alice.wonder@example.com',
            'role' => 'author',
            'password' => bcrypt('password'),
            'email_verified_at' => now(),
        ]);

        $response = $this->get('/author/alice-wonder');

        $response->assertStatus(200);
        $this->assertDatabaseHas('author_profiles', [
            'user_id' => $writer->id,
            'slug' => 'alice-wonder',
        ]);
    }

    public function test_guest_can_post_comment_on_article(): void
    {
        $article = Article::published()->firstOrFail();

        $response = $this->post("/articles/{$article->id}/comments", [
            'content' => 'This is a thoughtful comment on the news article.',
            'author_name' => 'Dr. Jane Doe',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('comments', [
            'article_id' => $article->id,
            'author_name' => 'Dr. Jane Doe',
            'content' => 'This is a thoughtful comment on the news article.',
            'status' => 'approved',
        ]);
    }

    public function test_authenticated_reader_comment_is_attributed_to_reader(): void
    {
        $article = Article::published()->firstOrFail();
        $reader = Reader::create([
            'name' => 'Robert Reader',
            'email' => 'robert.reader@example.com',
            'avatar_url' => 'https://example.com/avatar.jpg',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($reader, 'reader')
            ->post("/articles/{$article->id}/comments", [
                'content' => 'Insightful commentary from an active reader account.',
            ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('comments', [
            'article_id' => $article->id,
            'reader_id' => $reader->id,
            'author_name' => 'Robert Reader',
            'content' => 'Insightful commentary from an active reader account.',
        ]);
    }

    public function test_staff_can_delete_inappropriate_comment(): void
    {
        $article = Article::published()->firstOrFail();
        $comment = Comment::create([
            'article_id' => $article->id,
            'author_name' => 'Spammer',
            'content' => 'Unwelcome spam content',
            'status' => 'approved',
        ]);

        $editor = User::where('role', 'chief_editor')->firstOrFail();

        $response = $this->actingAs($editor, 'web')
            ->delete("/articles/{$article->id}/comments/{$comment->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('comments', [
            'id' => $comment->id,
        ]);
    }

    public function test_cms_user_management_saves_and_updates_avatar_url(): void
    {
        $admin = User::where('role', 'super_admin')->firstOrFail();

        // 1. Onboard staff with avatar_url
        $response = $this->actingAs($admin, 'web')
            ->post('/cms/users', [
                'name' => 'Clara Vance',
                'email' => 'clara.vance@newsportal.local',
                'role' => 'author',
                'password' => 'SecurePass123!',
                'password_confirmation' => 'SecurePass123!',
                'beat' => 'Global Climate',
                'bio' => 'Clara Vance is an investigative climate reporter.',
                'credentials' => 'Senior Climate Correspondent',
                'avatar_url' => 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
            ]);

        $response->assertRedirect();
        $createdUser = User::where('email', 'clara.vance@newsportal.local')->firstOrFail();
        $this->assertNotNull($createdUser->authorProfile);
        $this->assertEquals('https://images.unsplash.com/photo-1544005313-94ddf0286df2', $createdUser->authorProfile->avatar_url);

        // 2. Update staff avatar_url
        $updateResponse = $this->actingAs($admin, 'web')
            ->put("/cms/users/{$createdUser->id}", [
                'name' => 'Clara Vance',
                'email' => 'clara.vance@newsportal.local',
                'role' => 'author',
                'beat' => 'Global Climate & Energy Policy',
                'bio' => 'Updated bio.',
                'avatar_url' => 'https://images.unsplash.com/photo-new-avatar',
            ]);

        $updateResponse->assertRedirect();
        $createdUser->refresh();
        $this->assertEquals('https://images.unsplash.com/photo-new-avatar', $createdUser->authorProfile->avatar_url);
    }

    public function test_cms_can_upload_staff_avatar_file_and_store_locally(): void
    {
        Storage::fake('public');

        $admin = User::where('role', 'super_admin')->firstOrFail();

        // 1x1 transparent PNG byte stream (avoids requiring PHP GD extension in CLI)
        $pngBytes = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
        $tempPngPath1 = tempnam(sys_get_temp_dir(), 'test_avatar1_') . '.png';
        file_put_contents($tempPngPath1, $pngBytes);
        $fakeImage = new UploadedFile($tempPngPath1, 'staff_profile.png', 'image/png', null, true);

        // 1. Onboard staff with avatar file upload
        $response = $this->actingAs($admin, 'web')
            ->post('/cms/users', [
                'name' => 'Michael Chen',
                'email' => 'michael.chen@newsportal.local',
                'role' => 'author',
                'password' => 'SecurePass123!',
                'password_confirmation' => 'SecurePass123!',
                'beat' => 'Financial Markets',
                'bio' => 'Michael covers global commodities and markets.',
                'avatar' => $fakeImage,
            ]);

        $response->assertRedirect();
        $createdUser = User::where('email', 'michael.chen@newsportal.local')->firstOrFail();
        $this->assertNotNull($createdUser->authorProfile);
        $this->assertNotNull($createdUser->authorProfile->avatar_url);
        $this->assertStringContainsString('/storage/avatars/', $createdUser->authorProfile->avatar_url);

        // Verify stored file on disk
        $filename = basename(parse_url($createdUser->authorProfile->avatar_url, PHP_URL_PATH));
        Storage::disk('public')->assertExists('avatars/' . $filename);

        // 2. Update staff with replacement avatar file
        $tempPngPath2 = tempnam(sys_get_temp_dir(), 'test_avatar2_') . '.png';
        file_put_contents($tempPngPath2, $pngBytes);
        $newImage = new UploadedFile($tempPngPath2, 'updated_chen.png', 'image/png', null, true);

        $updateResponse = $this->actingAs($admin, 'web')
            ->put("/cms/users/{$createdUser->id}", [
                'name' => 'Michael Chen',
                'email' => 'michael.chen@newsportal.local',
                'role' => 'author',
                'beat' => 'Financial Markets & Macro',
                'avatar' => $newImage,
            ]);

        $updateResponse->assertRedirect();
        $createdUser->refresh();
        $newFilename = basename(parse_url($createdUser->authorProfile->avatar_url, PHP_URL_PATH));
        Storage::disk('public')->assertExists('avatars/' . $newFilename);
        // Previous avatar should have been cleaned up if it was custom uploaded
        $this->assertNotEquals($filename, $newFilename);
        Storage::disk('public')->assertMissing('avatars/' . $filename);

        @unlink($tempPngPath1);
        @unlink($tempPngPath2);
    }
}
