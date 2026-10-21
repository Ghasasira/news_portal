<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\MediaUpload;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CmsMediaController extends Controller
{
    /**
     * Get paginated media items for the Media Library.
     */
    public function index(Request $request): JsonResponse
    {
        $query = MediaUpload::with('user:id,name')->latest();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('original_name', 'like', "%{$search}%")
                  ->orWhere('alt_text', 'like', "%{$search}%")
                  ->orWhere('caption', 'like', "%{$search}%");
            });
        }

        $media = $query->paginate(24);

        return response()->json($media);
    }

    /**
     * Upload and optimize an image to modern lightweight WebP.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'image' => ['required', 'file', 'mimes:jpeg,png,jpg,webp,gif,avif', 'max:15360'],
            'alt_text' => ['nullable', 'string', 'max:255'],
            'caption' => ['nullable', 'string', 'max:255'],
        ]);

        $file = $request->file('image');
        $originalName = $file->getClientOriginalName();
        $originalSize = $file->getSize();

        // Target storage directory
        $storageDir = storage_path('app/public/media');
        if (!is_dir($storageDir)) {
            mkdir($storageDir, 0755, true);
        }

        $baseName = date('Ymd_His') . '_' . Str::random(8);
        $targetFilename = $baseName . '.webp';
        $targetDiskPath = 'media/' . $targetFilename;
        $targetFullPath = $storageDir . '/' . $targetFilename;

        $sourcePath = $file->getRealPath();

        // 1. Attempt ImageMagick optimization (compress to WebP with max 1920px bound, strip EXIF)
        $optimizedSuccessfully = false;
        $magickBinary = null;

        if (`which magick 2>/dev/null`) {
            $magickBinary = 'magick';
        } elseif (`which convert 2>/dev/null`) {
            $magickBinary = 'convert';
        }

        if ($magickBinary) {
            $cmd = sprintf(
                '%s %s -strip -quality 82 -resize 1920x1920\\> %s',
                $magickBinary,
                escapeshellarg($sourcePath),
                escapeshellarg($targetFullPath)
            );

            $result = Process::run($cmd);

            if ($result->successful() && file_exists($targetFullPath) && filesize($targetFullPath) > 0) {
                $optimizedSuccessfully = true;
            }
        }

        // 2. Fallback if CLI converter is unavailable or failed
        if (!$optimizedSuccessfully) {
            $extension = $file->getClientOriginalExtension() ?: 'jpg';
            $targetFilename = $baseName . '.' . $extension;
            $targetDiskPath = 'media/' . $targetFilename;
            $targetFullPath = $storageDir . '/' . $targetFilename;
            copy($sourcePath, $targetFullPath);
        }

        $optimizedSize = file_exists($targetFullPath) ? filesize($targetFullPath) : $originalSize;

        // Extract dimensions if available
        $width = null;
        $height = null;
        if (file_exists($targetFullPath)) {
            $imageInfo = @getimagesize($targetFullPath);
            if ($imageInfo) {
                $width = $imageInfo[0];
                $height = $imageInfo[1];
            }
        }

        $url = Storage::url($targetDiskPath);

        $media = MediaUpload::create([
            'user_id' => $request->user()?->id,
            'filename' => $targetFilename,
            'original_name' => $originalName,
            'disk_path' => $targetDiskPath,
            'url' => $url,
            'mime_type' => $optimizedSuccessfully ? 'image/webp' : ($file->getMimeType() ?: 'image/jpeg'),
            'original_size_bytes' => $originalSize,
            'optimized_size_bytes' => $optimizedSize,
            'width' => $width,
            'height' => $height,
            'alt_text' => $request->input('alt_text'),
            'caption' => $request->input('caption'),
        ]);

        return response()->json([
            'message' => 'Image uploaded and optimized successfully',
            'media' => $media,
        ], 201);
    }

    /**
     * Delete an uploaded image.
     */
    public function destroy(MediaUpload $media): JsonResponse
    {
        if (Storage::disk('public')->exists($media->disk_path)) {
            Storage::disk('public')->delete($media->disk_path);
        }

        $media->delete();

        return response()->json(['message' => 'Media item deleted successfully']);
    }
}
