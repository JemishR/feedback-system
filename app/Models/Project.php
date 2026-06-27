<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Str;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'logo_path',
        'accent_color',
        'custom_domain',
        'is_public',
    ];

    protected $casts = [
        'is_public' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::creating(function (Project $project) {
            if (empty($project->slug)) {
                $project->slug = Str::slug($project->name);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function boards(): HasMany
    {
        return $this->hasMany(Board::class)->orderBy('sort_order');
    }

    public function tags(): HasMany
    {
        return $this->hasMany(Tag::class);
    }

    public function changelogEntries(): HasMany
    {
        return $this->hasMany(ChangelogEntry::class)->latest('published_at');
    }

    public function teamMembers(): HasMany
    {
        return $this->hasMany(TeamMember::class);
    }

    public function posts(): HasManyThrough
    {
        return $this->hasManyThrough(Post::class, Board::class);
    }

    /**
     * Get total vote count across all posts in this project.
     */
    public function getTotalVotesAttribute(): int
    {
        return $this->posts()->sum('vote_count');
    }

    /**
     * Get total post count across all boards.
     */
    public function getTotalPostsAttribute(): int
    {
        return $this->posts()->count();
    }
}
