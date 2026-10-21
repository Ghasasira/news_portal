<?php

namespace Tests\Feature;

use App\Models\MediaUpload;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class MediaUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_guests_cannot_upload_media(): void
    {
        Storage::fake('public');

        $jpgBytes = base64_decode('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=');
        $file = UploadedFile::fake()->createWithContent('headline_photo.jpg', $jpgBytes);

        $response = $this->postJson('/cms/media/upload', [
            'image' => $file,
        ]);

        $response->assertUnauthorized();
    }

    public function test_authenticated_editor_can_upload_and_optimize_image(): void
    {
        Storage::fake('public');

        $editor = User::factory()->create([
            'role' => 'chief_editor',
            'email_verified_at' => now(),
        ]);

        $jpgBytes = base64_decode('/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=');
        $file = UploadedFile::fake()->createWithContent('geneva_treaty_signing.jpg', $jpgBytes);

        $response = $this->actingAs($editor)->postJson('/cms/media/upload', [
            'image' => $file,
            'caption' => 'Delegates signing the framework in Geneva',
            'alt_text' => 'Geneva Treaty Hall',
        ]);

        $response->assertStatus(201);
        $response->assertJsonStructure([
            'message',
            'media' => [
                'id',
                'url',
                'filename',
                'original_name',
                'original_size_bytes',
                'optimized_size_bytes',
                'savings_percentage',
                'caption',
                'alt_text',
            ],
        ]);

        $this->assertDatabaseHas('media_uploads', [
            'original_name' => 'geneva_treaty_signing.jpg',
            'caption' => 'Delegates signing the framework in Geneva',
            'alt_text' => 'Geneva Treaty Hall',
            'user_id' => $editor->id,
        ]);
    }

    public function test_editor_can_list_media_in_library(): void
    {
        $editor = User::factory()->create([
            'role' => 'chief_editor',
            'email_verified_at' => now(),
        ]);

        MediaUpload::create([
            'user_id' => $editor->id,
            'filename' => 'photo_1.webp',
            'original_name' => 'photo_1.jpg',
            'disk_path' => 'media/photo_1.webp',
            'url' => '/storage/media/photo_1.webp',
            'mime_type' => 'image/webp',
            'original_size_bytes' => 2048000,
            'optimized_size_bytes' => 240000,
            'caption' => 'Economic forum in Davos',
        ]);

        $response = $this->actingAs($editor)->getJson('/cms/media');

        $response->assertOk();
        $response->assertJsonFragment([
            'original_name' => 'photo_1.jpg',
            'caption' => 'Economic forum in Davos',
        ]);
    }

    public function test_editor_can_search_media_in_library(): void
    {
        $editor = User::factory()->create([
            'role' => 'chief_editor',
            'email_verified_at' => now(),
        ]);

        MediaUpload::create([
            'user_id' => $editor->id,
            'filename' => 'tokamak.webp',
            'original_name' => 'nuclear_tokamak_reactor.jpg',
            'disk_path' => 'media/tokamak.webp',
            'url' => '/storage/media/tokamak.webp',
            'mime_type' => 'image/webp',
            'original_size_bytes' => 1500000,
            'optimized_size_bytes' => 180000,
            'caption' => 'Tokamak fusion facility',
        ]);

        MediaUpload::create([
            'user_id' => $editor->id,
            'filename' => 'davos.webp',
            'original_name' => 'davos_summit.jpg',
            'disk_path' => 'media/davos.webp',
            'url' => '/storage/media/davos.webp',
            'mime_type' => 'image/webp',
            'original_size_bytes' => 1200000,
            'optimized_size_bytes' => 160000,
            'caption' => 'Davos forum',
        ]);

        $response = $this->actingAs($editor)->getJson('/cms/media?search=tokamak');

        $response->assertOk();
        $response->assertJsonFragment(['original_name' => 'nuclear_tokamak_reactor.jpg']);
        $response->assertJsonMissing(['original_name' => 'davos_summit.jpg']);
    }

    public function test_editor_can_delete_media(): void
    {
        Storage::fake('public');

        $editor = User::factory()->create([
            'role' => 'chief_editor',
            'email_verified_at' => now(),
        ]);

        $media = MediaUpload::create([
            'user_id' => $editor->id,
            'filename' => 'photo_to_delete.webp',
            'original_name' => 'photo_to_delete.jpg',
            'disk_path' => 'media/photo_to_delete.webp',
            'url' => '/storage/media/photo_to_delete.webp',
            'mime_type' => 'image/webp',
            'original_size_bytes' => 1000000,
            'optimized_size_bytes' => 150000,
        ]);

        Storage::disk('public')->put('media/photo_to_delete.webp', 'dummy content');

        $response = $this->actingAs($editor)->deleteJson("/cms/media/{$media->id}");

        $response->assertOk();
        $this->assertDatabaseMissing('media_uploads', ['id' => $media->id]);
        Storage::disk('public')->assertMissing('media/photo_to_delete.webp');
    }
}
