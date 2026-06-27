<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Post;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PostController extends Controller
{
    /**
     * Display all posts for a project (admin view).
     */
    public function index(Request $request, Project $project): Response
    {
        $this->authorizeProject($request, $project);

        $sort = $request->get('sort', 'newest');
        $statusFilter = $request->get('status', null);
        $boardFilter = $request->get('board', null);

        $postsQuery = $project->posts()->with(['board', 'tags']);

        if ($statusFilter) {
            $postsQuery->where('status', $statusFilter);
        }

        if ($boardFilter) {
            $postsQuery->where('board_id', $boardFilter);
        }

        $postsQuery = match ($sort) {
            'top' => $postsQuery->orderByDesc('vote_count'),
            'oldest' => $postsQuery->oldest(),
            default => $postsQuery->latest(),
        };

        $posts = $postsQuery->paginate(20);

        $boards = $project->boards()->get(['id', 'name']);

        return Inertia::render('posts/index', [
            'project' => $project,
            'posts' => $posts,
            'boards' => $boards,
            'sort' => $sort,
            'statusFilter' => $statusFilter,
            'boardFilter' => $boardFilter,
        ]);
    }

    /**
     * Display a specific post (admin view).
     */
    public function show(Request $request, Project $project, Post $post): Response
    {
        $this->authorizeProject($request, $project);

        $post->load(['board', 'tags', 'comments', 'votes']);

        $tags = $project->tags()->get();

        return Inertia::render('posts/show', [
            'project' => $project,
            'post' => $post,
            'allTags' => $tags,
            'statuses' => Post::STATUSES,
            'statusColors' => Post::STATUS_COLORS,
        ]);
    }

    /**
     * Update the status or other attributes of a post.
     */
    public function update(Request $request, Project $project, Post $post)
    {
        $this->authorizeProject($request, $project);

        $validated = $request->validate([
            'status' => 'sometimes|string|in:' . implode(',', array_keys(Post::STATUSES)),
            'is_pinned' => 'sometimes|boolean',
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
        ]);

        $post->update($validated);

        return back()->with('success', 'Post updated successfully!');
    }

    /**
     * Sync tags for a post.
     */
    public function syncTags(Request $request, Project $project, Post $post)
    {
        $this->authorizeProject($request, $project);

        $validated = $request->validate([
            'tag_ids' => 'array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $post->tags()->sync($validated['tag_ids'] ?? []);

        return back()->with('success', 'Tags updated!');
    }

    /**
     * Remove the specified post.
     */
    public function destroy(Request $request, Project $project, Post $post)
    {
        $this->authorizeProject($request, $project);

        $post->delete();

        return back()->with('success', 'Post deleted successfully!');
    }

    private function authorizeProject(Request $request, Project $project): void
    {
        if ($project->user_id !== $request->user()->id) {
            abort(403);
        }
    }
}
