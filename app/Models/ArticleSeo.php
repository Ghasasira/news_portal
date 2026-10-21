<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleSeo extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'meta_title',
        'meta_description',
        'canonical_url',
        'social_image_url',
        'focus_keyword',
        'score',
    ];

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }
}
