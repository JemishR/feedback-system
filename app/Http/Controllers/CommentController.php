<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Project;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    /**
     * Store a new admin comment/reply on a post.
     */
    public function store(Request $request, Project $project, Post $post)
    {
        $this->authorizeProject($request, $project);

        $validated = $request->validate([
            'body' => 'required|string|max:5000',
        ]);

        $post->comments()->create([
            'author_name' => $request->user()->name,
            'author_email' => $request->user()->email,
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
            'is_admin_reply' => true,
        ]);

        $post->recalculateCommentCount();

        return back()->with('success', 'Comment added!');
    }

    /**
     * Remove a comment.
     */
    public function destroy(Request $request, Project $project, Post $post, Comment $comment)
    {
        $this->authorizeProject($request, $project);

        $comment->delete();
        $post->recalculateCommentCount();

        return back()->with('success', 'Comment deleted!');
    }

    private function authorizeProject(Request $request, Project $project): void
    {
        if ($project->user_id !== $request->user()->id) {
            abort(403);
        }
    }
}
