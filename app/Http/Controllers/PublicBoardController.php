<?php

namespace App\Http\Controllers;

use App\Models\ChangelogEntry;
use App\Models\Post;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PublicBoardController extends Controller
{
    public function index(string $projectSlug): Response
    {
        $project = Project::where('slug', $projectSlug)->where('is_public', true)->firstOrFail();

        $boards = $project->boards()->where('is_public', true)
            ->withCount('posts')->orderBy('sort_order')->get();

        $recentPosts = $project->posts()
            ->whereHas('board', fn($q) => $q->where('is_public', true))
            ->with('board')->latest()->take(10)->get();

        return Inertia::render('public/board', compact('project', 'boards', 'recentPosts'));
    }

    public function board(string $projectSlug, string $boardSlug): Response
    {
        $project = Project::where('slug', $projectSlug)->where('is_public', true)->firstOrFail();
        $board = $project->boards()->where('slug', $boardSlug)->where('is_public', true)->firstOrFail();

        $posts = $board->posts()->with('tags')
            ->orderByDesc('is_pinned')->orderByDesc('vote_count')->paginate(20);

        return Inertia::render('public/board-detail', [
            'project' => $project, 'board' => $board, 'posts' => $posts,
            'statuses' => Post::STATUSES, 'statusColors' => Post::STATUS_COLORS,
        ]);
    }

    public function post(string $projectSlug, int $postId): Response
    {
        $project = Project::where('slug', $projectSlug)->where('is_public', true)->firstOrFail();
        $post = $project->posts()->with(['board', 'tags', 'comments' => fn($q) => $q->oldest()])->findOrFail($postId);

        return Inertia::render('public/post', [
            'project' => $project, 'post' => $post,
            'statuses' => Post::STATUSES, 'statusColors' => Post::STATUS_COLORS,
        ]);
    }

    public function submitPost(Request $request, string $projectSlug)
    {
        $project = Project::where('slug', $projectSlug)->where('is_public', true)->firstOrFail();

        $validated = $request->validate([
            'board_id' => 'required|exists:boards,id',
            'author_name' => 'required|string|max:255',
            'author_email' => 'required|email|max:255',
            'title' => 'required|string|max:255',
            'body' => 'required|string|max:5000',
        ]);

        $board = $project->boards()->findOrFail($validated['board_id']);
        $post = $board->posts()->create([
            'author_name' => $validated['author_name'],
            'author_email' => $validated['author_email'],
            'title' => $validated['title'],
            'body' => $validated['body'],
            'user_id' => $request->user()?->id,
        ]);

        $post->votes()->create([
            'voter_email' => $validated['author_email'],
            'user_id' => $request->user()?->id,
            'ip_address' => $request->ip(),
        ]);
        $post->recalculateVoteCount();

        return back()->with('success', 'Feedback submitted! Thank you.');
    }

    public function vote(Request $request, string $projectSlug, int $postId)
    {
        $project = Project::where('slug', $projectSlug)->where('is_public', true)->firstOrFail();
        $post = $project->posts()->findOrFail($postId);

        $validated = $request->validate(['voter_email' => 'required|email|max:255']);

        if (strtolower($post->author_email) === strtolower($validated['voter_email'])) {
            return back()->withErrors(['voter_email' => 'You cannot vote on your own feedback.']);
        }

        $existing = $post->votes()->where('voter_email', $validated['voter_email'])->first();

        if ($existing) {
            if (!$request->has('confirm_remove')) {
                return back()->withErrors(['voter_email' => 'You have already voted on this post. Click Upvote again to confirm removing your vote.']);
            }

            $existing->delete();
            $post->recalculateVoteCount();
            return back()->with('success', 'Vote removed.');
        }

        // Production ready: Generate a signed URL for email verification
        $verificationUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
            'public.vote.verify',
            now()->addMinutes(30),
            ['projectSlug' => $project->slug, 'post' => $post->id, 'email' => $validated['voter_email']]
        );

        // In a real production app, we would send this via Mail::to($email)->send(new VoteVerificationMail($url))
        // For now, we will log it and return a message.
        \Illuminate\Support\Facades\Log::info("Vote Verification URL for {$validated['voter_email']}: {$verificationUrl}");

        return back()->with('success', 'Verification link sent! Please check your email to confirm your vote.');
    }

    public function verifyVote(Request $request, string $projectSlug, Post $post)
    {
        if (! $request->hasValidSignature()) {
            abort(401, 'Invalid or expired verification link.');
        }

        $email = $request->query('email');
        $existing = $post->votes()->where('voter_email', $email)->first();

        if (!$existing) {
            $post->votes()->create([
                'voter_email' => $email,
                'user_id' => null,
                'ip_address' => $request->ip(),
            ]);
            $post->recalculateVoteCount();
        }

        return redirect()->route('public.post', ['projectSlug' => $projectSlug, 'postId' => $post->id])
            ->with('success', 'Vote successfully verified and counted!');
    }

    public function comment(Request $request, string $projectSlug, int $postId)
    {
        $project = Project::where('slug', $projectSlug)
            ->where('is_public', true)
            ->firstOrFail();

        $post = $project->posts()->findOrFail($postId);

        $validated = $request->validate([
            'author_name' => 'required|string|max:255',
            'author_email' => 'required|email|max:255',
            'body' => 'required|string|max:5000',
        ]);

        // Prevent same email with different name
        $existingComment = $post->comments()
            ->where('author_email', $validated['author_email'])
            ->first();

        if (
            $existingComment &&
            strtolower(trim($existingComment->author_name)) !== strtolower(trim($validated['author_name']))
        ) {
            return back()->withErrors([
                'author_email' => 'This email is already associated with another name.'
            ], 'comment');
        }

        // Generate verification link
        $verificationUrl = \Illuminate\Support\Facades\URL::temporarySignedRoute(
            'public.comment.verify',
            now()->addMinutes(30),
            [
                'projectSlug' => $project->slug,
                'post' => $post->id,
                'author_name' => $validated['author_name'],
                'author_email' => $validated['author_email'],
                'body' => $validated['body'],
            ]
        );

        \Illuminate\Support\Facades\Log::info(
            "Comment Verification URL for {$validated['author_email']}: {$verificationUrl}"
        );

        return back()->with('success', 'Verification link sent! Please check your email to confirm your comment.');
    }

    public function verifyComment(Request $request, string $projectSlug, Post $post)
    {
        if (! $request->hasValidSignature()) {
            abort(401, 'Invalid or expired verification link.');
        }

        $authorEmail = $request->query('author_email');
        $authorName = $request->query('author_name');
        $body = $request->query('body');

        // Prevent duplicate comment creation
        $exists = $post->comments()
            ->where('author_email', $authorEmail)
            ->where('body', $body)
            ->exists();

        if (! $exists) {

            // Check same email different name again
            $existingComment = $post->comments()
                ->where('author_email', $authorEmail)
                ->first();

            if (
                $existingComment &&
                strtolower(trim($existingComment->author_name)) !== strtolower(trim($authorName))
            ) {
                return redirect()
                    ->route('public.post', [
                        'projectSlug' => $projectSlug,
                        'postId' => $post->id
                    ])
                    ->withErrors([
                        'author_email' => 'This email is already associated with another name.'
                    ], 'comment');
            }

            $post->comments()->create([
                'author_name' => $authorName,
                'author_email' => $authorEmail,
                'body' => $body,
                'user_id' => null,
                'is_admin_reply' => false,
            ]);

            $post->recalculateCommentCount();
        }

        return redirect()->route('public.post', [
            'projectSlug' => $projectSlug,
            'postId' => $post->id
        ])->with('success', 'Comment successfully verified and added!');
    }

    public function roadmap(string $projectSlug): Response
    {
        $project = Project::where('slug', $projectSlug)->where('is_public', true)->firstOrFail();

        $columns = [
            'planned' => $project->posts()->where('status', 'planned')->with('board')->orderByDesc('vote_count')->get(),
            'in_progress' => $project->posts()->where('status', 'in_progress')->with('board')->orderByDesc('vote_count')->get(),
            'completed' => $project->posts()->where('status', 'completed')->with('board')->latest()->take(20)->get(),
        ];

        return Inertia::render('public/roadmap', [
            'project' => $project, 'columns' => $columns, 'statusColors' => Post::STATUS_COLORS,
        ]);
    }

    public function changelog(string $projectSlug): Response
    {
        $project = Project::where('slug', $projectSlug)->where('is_public', true)->firstOrFail();

        $entries = $project->changelogEntries()->published()->latest('published_at')->paginate(10);

        return Inertia::render('public/changelog', [
            'project' => $project, 'entries' => $entries,
            'typeColors' => ChangelogEntry::TYPE_COLORS, 'types' => ChangelogEntry::TYPES,
        ]);
    }
}
