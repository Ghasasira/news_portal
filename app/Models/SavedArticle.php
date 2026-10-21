<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SavedArticle extends Model
{
    use HasFactory;

    protected $fillable = [
        'reader_id',
        'user_id',
        'article_id',
    ];

    public function reader(): BelongsTo
    {
        return $this->belongsTo(Reader::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }
}
