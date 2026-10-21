<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int|null $user_id
 * @property string $filename
 * @property string $original_name
 * @property string $disk_path
 * @property string $url
 * @property string $mime_type
 * @property int $original_size_bytes
 * @property int $optimized_size_bytes
 * @property int|null $width
 * @property int|null $height
 * @property string|null $alt_text
 * @property string|null $caption
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 */
class MediaUpload extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'filename',
        'original_name',
        'disk_path',
        'url',
        'mime_type',
        'original_size_bytes',
        'optimized_size_bytes',
        'width',
        'height',
        'alt_text',
        'caption',
    ];

    protected $appends = [
        'formatted_original_size',
        'formatted_optimized_size',
        'savings_percentage',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function getFormattedOriginalSizeAttribute(): string
    {
        return $this->formatBytes($this->original_size_bytes);
    }

    public function getFormattedOptimizedSizeAttribute(): string
    {
        return $this->formatBytes($this->optimized_size_bytes);
    }

    public function getSavingsPercentageAttribute(): int
    {
        if ($this->original_size_bytes <= 0) {
            return 0;
        }

        $saved = $this->original_size_bytes - $this->optimized_size_bytes;
        return max(0, (int) round(($saved / $this->original_size_bytes) * 100));
    }

    protected function formatBytes(int $bytes): string
    {
        if ($bytes >= 1048576) {
            return number_format($bytes / 1048576, 1) . ' MB';
        }
        if ($bytes >= 1024) {
            return number_format($bytes / 1024, 0) . ' KB';
        }
        return $bytes . ' B';
    }
}
