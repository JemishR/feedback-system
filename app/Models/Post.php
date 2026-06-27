<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    use HasFactory;

    protected $fillable = [
        'author_name',
        'author_email',
        'user_id',
        'title',
        'body',
        'status',
        'is_pinned',
    ];

    protected $casts = [
        'is_pinned' => 'boolean',
        'vote_count' => 'integer',
        'comment_count' => 'integer',
    ];

    /**
     * Valid status values.
     */
    public const STATUSES = [
        'pending' => 'Pending',
        'under_review' => 'Under Review',
        'planned' => 'Planned',
        'in_progress' => 'In Progress',
        'completed' => 'Completed',
        'closed' => 'Closed',
    ];

    /**
     * Status colors for the UI.
     */
    public const STATUS_COLORS = [
        'pending' => '#9ca3af',
        'under_review' => '#f59e0b',
        'planned' => '#6366f1',
        'in_progress' => '#3b82f6',
        'completed' => '#10b981',
        'closed' => '#ef4444',
    ];

    public function board(): BelongsTo
    {
        return $this->belongsTo(Board::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function votes(): HasMany
    {
        return $this->hasMany(Vote::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class)->latest();
    }

    public function tags(): BelongsToMany
    {
        return $this->belongsToMany(Tag::class);
    }

    /**
     * Check if a given email has voted on this post.
     */
    public function hasVotedBy(string $email): bool
    {
        return $this->votes()->where('voter_email', $email)->exists();
    }

    /**
     * Recalculate the denormalized vote count.
     */
    public function recalculateVoteCount(): void
    {
        $this->vote_count = $this->votes()->count();
        $this->save();
    }

    /**
     * Recalculate the denormalized comment count.
     */
    public function recalculateCommentCount(): void
    {
        $this->comment_count = $this->comments()->count();
        $this->save();
    }
}
