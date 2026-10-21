<?php

namespace Tests\Feature;

use App\Models\Article;
use App\Models\AuthorProfile;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Str;
use Tests\TestCase;

class CmsUserOnboardingTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_is_redirected_from_cms_users(): void
    {
        $response = $this->get(route('cms.users.index'));

        $response->assertRedirect(route('login'));
    }

    public function test_reader_cannot_access_cms_users(): void
    {
        $reader = User::factory()->create([
            'role' => 'reader',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($reader)->get(route('cms.users.index'));

        $response->assertForbidden();
    }

    public function test_regular_author_cannot_access_cms_users(): void
    {
        $author = User::factory()->create([
            'role' => 'author',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($author)->get(route('cms.users.index'));

        $response->assertForbidden();
    }

    public function test_admin_can_view_cms_users_directory(): void
    {
        $admin = User::factory()->create([
            'role' => 'super_admin',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin)->get(route('cms.users.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('cms/users/index')
            ->has('staffUsers.data')
            ->has('readers.data')
            ->has('stats')
            ->has('availableRoles')
        );
    }

    public function test_admin_can_onboard_new_reporter_with_author_profile(): void
    {
        $admin = User::factory()->create([
            'role' => 'chief_editor',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin)->post(route('cms.users.store'), [
            'name' => 'Elena Vance',
            'email' => 'elena.vance@newsportal.local',
            'role' => 'author',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
            'beat' => 'Geopolitics & Energy',
            'bio' => 'Senior international correspondent focusing on Eurasian energy policy.',
            'credentials' => 'Former Diplomatic Bureau Chief',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'name' => 'Elena Vance',
            'email' => 'elena.vance@newsportal.local',
            'role' => 'author',
        ]);

        $newUser = User::where('email', 'elena.vance@newsportal.local')->first();
        $this->assertNotNull($newUser->email_verified_at);
        $this->assertNotNull($newUser->authorProfile);
        $this->assertEquals('Geopolitics & Energy', $newUser->authorProfile->beat);
        $this->assertEquals('elena-vance', $newUser->authorProfile->slug);
    }

    public function test_onboarding_validates_duplicate_email(): void
    {
        $admin = User::factory()->create([
            'role' => 'super_admin',
            'email_verified_at' => now(),
        ]);

        $existingUser = User::factory()->create([
            'email' => 'duplicate@newsportal.local',
        ]);

        $response = $this->actingAs($admin)->post(route('cms.users.store'), [
            'name' => 'Clone User',
            'email' => 'duplicate@newsportal.local',
            'role' => 'author',
            'password' => 'SecurePass123!',
            'password_confirmation' => 'SecurePass123!',
        ]);

        $response->assertSessionHasErrors('email');
    }

    public function test_admin_can_update_user_role_and_beat(): void
    {
        $admin = User::factory()->create([
            'role' => 'super_admin',
            'email_verified_at' => now(),
        ]);

        $staff = User::factory()->create([
            'role' => 'contributor',
            'name' => 'Marcus Cole',
            'email' => 'marcus.cole@newsportal.local',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin)->put(route('cms.users.update', $staff), [
            'name' => 'Marcus Cole, Lead Editor',
            'email' => 'marcus.cole@newsportal.local',
            'role' => 'section_editor',
            'beat' => 'Technology & Science',
            'credentials' => 'Senior Tech Editor',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $staff->refresh();
        $this->assertEquals('Marcus Cole, Lead Editor', $staff->name);
        $this->assertEquals('section_editor', $staff->role);
        $this->assertEquals('Technology & Science', $staff->authorProfile->beat);
    }

    public function test_admin_cannot_delete_themselves(): void
    {
        $admin = User::factory()->create([
            'role' => 'super_admin',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin)->delete(route('cms.users.destroy', $admin));

        $response->assertSessionHasErrors('error');
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_admin_cannot_delete_author_with_published_articles(): void
    {
        $admin = User::factory()->create([
            'role' => 'super_admin',
            'email_verified_at' => now(),
        ]);

        $author = User::factory()->create([
            'role' => 'author',
            'email_verified_at' => now(),
        ]);

        $category = Category::create([
            'name' => 'Investigative',
            'slug' => 'investigative',
        ]);

        Article::create([
            'uuid' => Str::uuid()->toString(),
            'title' => 'Important Investigative Story',
            'slug' => 'important-investigative-story',
            'body' => 'Body text',
            'primary_category_id' => $category->id,
            'user_id' => $author->id,
            'status' => 'published',
            'published_at' => now(),
        ]);

        $response = $this->actingAs($admin)->delete(route('cms.users.destroy', $author));

        $response->assertSessionHasErrors('error');
        $this->assertDatabaseHas('users', ['id' => $author->id]);
    }

    public function test_admin_can_delete_user_without_articles(): void
    {
        $admin = User::factory()->create([
            'role' => 'super_admin',
            'email_verified_at' => now(),
        ]);

        $cleanUser = User::factory()->create([
            'role' => 'reader',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($admin)->delete(route('cms.users.destroy', $cleanUser));

        $response->assertRedirect();
        $response->assertSessionHas('success');
        $this->assertDatabaseMissing('users', ['id' => $cleanUser->id]);
    }
}
