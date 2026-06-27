<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChangelogEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'body',
        'type',
        'published_at',
        'is_published',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    public const TYPES = [
        'feature' => 'New Feature',
        'improvement' => 'Improvement',
        'fix' => 'Bug Fix',
        'announcement' => 'Announcement',
    ];

    public const TYPE_COLORS = [
        'feature' => '#10b981',
        'improvement' => '#6366f1',
        'fix' => '#f59e0b',
        'announcement' => '#3b82f6',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    /**
     * Scope to only published entries.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true)->whereNotNull('published_at');
    }
}
