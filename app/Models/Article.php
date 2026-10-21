<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Str;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'uuid',
        'title',
        'slug',
        'standfirst',
        'body',
        'content_type',
        'status',
        'primary_category_id',
        'user_id',
        'series_id',
        'series_order',
        'hero_image_url',
        'hero_image_caption',
        'reading_time_minutes',
        'view_count',
        'is_breaking',
        'is_featured',
        'is_trending',
        'is_editors_pick',
        'published_at',
        'scheduled_at',
    ];

    protected function casts(): array
    {
        return [
            'is_breaking' => 'boolean',
            'is_featured' => 'boolean',
            'is_trending' => 'boolean',
            'is_editors_pick' => 'boolean',
            'reading_time_minutes' => 'integer',
            'view_count' => 'integer',
            'series_order' => 'integer',
            'published_at' => 'datetime',
            'scheduled_at' => 'datetime',
        ];
    }

    protected static function booted(): void
    {
        static::creating(function (Article $article) {
            if (empty($article->uuid)) {
                $article->uuid = (string) Str::uuid();
            }
            if (empty($article->slug)) {
                $article->slug = Str::slug($article->title);
            }
            if (empty($article->reading_time_minutes) && !empty($article->body)) {
                $wordCount = str_word_count(strip_tags($article->body));
                $article->reading_time_minutes = max(1, (int) ceil($wordCount / 200));
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'primary_category_id');
    }

    public function topics(): BelongsToMany
    {
        return $this->belongsToMany(Topic::class, 'article_topic')
            ->withPivot('is_primary')
            ->withTimestamps();
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class, 'article_tag')->withTimestamps();
    }

    public function series(): BelongsTo
    {
        return $this->belongsTo(Series::class);
    }

    public function seo(): HasOne
    {
        return $this->hasOne(ArticleSeo::class);
    }

    public function aiMeta(): HasOne
    {
        return $this->hasOne(ArticleAiMeta::class);
    }

    public function revisions(): HasMany
    {
        return $this->hasMany(ArticleRevision::class)->latest();
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->where('status', 'approved')->latest();
    }

    public function savedByReaders(): BelongsToMany
    {
        return $this->belongsToMany(Reader::class, 'saved_articles', 'article_id', 'reader_id')
            ->withTimestamps();
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }

    public function scopeBreaking(Builder $query): Builder
    {
        return $query->published()->where('is_breaking', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->published()->where('is_featured', true);
    }

    public function scopeTrending(Builder $query): Builder
    {
        return $query->published()->where('is_trending', true);
    }

    public function scopeEditorsPick(Builder $query): Builder
    {
        return $query->published()->where('is_editors_pick', true);
    }
}
