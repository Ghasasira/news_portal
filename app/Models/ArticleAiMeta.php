<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleAiMeta extends Model
{
    use HasFactory;

    protected $fillable = [
        'article_id',
        'tldr',
        'key_facts',
        'five_w_one_h',
        'faq_json',
        'aeo_score',
    ];

    protected function casts(): array
    {
        return [
            'key_facts' => 'array',
            'five_w_one_h' => 'array',
            'faq_json' => 'array',
        ];
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }
}
