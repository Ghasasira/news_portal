<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Reader extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'readers';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'google_id',
        'avatar_url',
        'email_verified_at',
        'password',
        'preferences',
        'is_active',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'preferences' => 'array',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Articles bookmarked/saved by this reader.
     */
    public function savedArticles(): BelongsToMany
    {
        return $this->belongsToMany(Article::class, 'saved_articles', 'reader_id', 'article_id')
            ->withTimestamps();
    }

    /**
     * Comments posted by this reader.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class, 'reader_id');
    }

    /**
     * Whether this reader authenticated via Google OAuth.
     */
    public function hasGoogleAuth(): bool
    {
        return ! empty($this->google_id);
    }
}
