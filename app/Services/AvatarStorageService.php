<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AvatarStorageService
{
    /**
     * Store and optimize an uploaded avatar image locally.
     *
     * @return string The public URL of the stored avatar (e.g. /storage/avatars/avatar_xxx.webp)
     */
    public function store(UploadedFile $file, ?string $oldAvatarUrl = null): string
    {
        $disk = Storage::disk('public');
        $disk->makeDirectory('avatars');

        $baseName = 'avatar_' . date('Ymd_His') . '_' . Str::random(8);
        $targetDiskPath = 'avatars/' . $baseName . '.webp';
        $targetFullPath = $disk->path($targetDiskPath);
        $sourcePath = $file->getRealPath();
        $optimizedSuccessfully = false;

        $magickBinary = null;
        if (`which magick 2>/dev/null`) {
            $magickBinary = 'magick';
        } elseif (`which convert 2>/dev/null`) {
            $magickBinary = 'convert';
        }

        if ($magickBinary && $sourcePath && file_exists($sourcePath)) {
            $cmd = sprintf(
                '%s %s -strip -quality 85 -resize 600x600^ -gravity center -extent 600x600 %s',
                $magickBinary,
                escapeshellarg($sourcePath),
                escapeshellarg($targetFullPath)
            );

            $result = Process::run($cmd);
            if ($result->successful() && file_exists($targetFullPath) && filesize($targetFullPath) > 0) {
                $optimizedSuccessfully = true;
            }
        }

        if (! $optimizedSuccessfully) {
            $ext = $file->getClientOriginalExtension() ?: 'jpg';
            $targetFilename = $baseName . '.' . $ext;
            $targetDiskPath = 'avatars/' . $targetFilename;
            $disk->putFileAs('avatars', $file, $targetFilename);
        }

        // Delete old local avatar if it exists on disk
        $this->deleteOldAvatar($oldAvatarUrl);

        return $disk->url($targetDiskPath);
    }

    /**
     * Delete an existing local avatar if present.
     */
    public function deleteOldAvatar(?string $url): void
    {
        if (! $url) {
            return;
        }

        if (str_contains($url, '/storage/avatars/')) {
            $path = parse_url($url, PHP_URL_PATH) ?: $url;
            $filename = basename($path);
            if (str_starts_with($filename, 'avatar_')) {
                $diskPath = 'avatars/' . $filename;
                if (Storage::disk('public')->exists($diskPath)) {
                    Storage::disk('public')->delete($diskPath);
                }
            }
        }
    }
}
