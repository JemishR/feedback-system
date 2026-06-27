<?php

namespace App\Http\Controllers;

use App\Models\Board;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BoardController extends Controller
{
    /**
     * Display boards for a project.
     */
    public function index(Request $request, Project $project): Response
    {
        $this->authorizeProject($request, $project);

        $boards = $project->boards()
            ->withCount('posts')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('boards/index', [
            'project' => $project,
            'boards' => $boards,
        ]);
    }

    /**
     * Display the posts within a board.
     */
    public function show(Request $request, Project $project, Board $board): Response
    {
        $this->authorizeProject($request, $project);

        $sort = $request->get('sort', 'newest');
        $statusFilter = $request->get('status', null);

        $postsQuery = $board->posts()->with(['tags', 'board']);

        if ($statusFilter) {
            $postsQuery->where('status', $statusFilter);
        }

        $postsQuery = match ($sort) {
            'top' => $postsQuery->orderByDesc('vote_count'),
            'oldest' => $postsQuery->oldest(),
            default => $postsQuery->latest(),
        };

        $posts = $postsQuery->paginate(20);

        return Inertia::render('boards/show', [
            'project' => $project,
            'board' => $board,
            'posts' => $posts,
            'sort' => $sort,
            'statusFilter' => $statusFilter,
        ]);
    }

    /**
     * Store a newly created board.
     */
    public function store(Request $request, Project $project)
    {
        $this->authorizeProject($request, $project);

        $user = $request->user();
        $maxBoards = config('plans.free.max_boards', 3);
        if (!$user->subscribed('default') && !$user->onTrial() && $project->boards()->count() >= $maxBoards) {
            return back()->withErrors(['name' => "Free plan is limited to {$maxBoards} boards. Please upgrade to Pro in Settings -> Billing."]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_public' => 'sometimes|boolean',
        ]);

        $maxOrder = $project->boards()->max('sort_order') ?? -1;

        $project->boards()->create([
            ...$validated,
            'sort_order' => $maxOrder + 1,
        ]);

        return back()->with('success', 'Board created successfully!');
    }

    /**
     * Update the specified board.
     */
    public function update(Request $request, Project $project, Board $board)
    {
        $this->authorizeProject($request, $project);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string|max:1000',
            'is_public' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer|min:0',
        ]);

        $board->update($validated);

        return back()->with('success', 'Board updated successfully!');
    }

    /**
     * Remove the specified board.
     */
    public function destroy(Request $request, Project $project, Board $board)
    {
        $this->authorizeProject($request, $project);

        $board->delete();

        return back()->with('success', 'Board deleted successfully!');
    }

    private function authorizeProject(Request $request, Project $project): void
    {
        if ($project->user_id !== $request->user()->id) {
            abort(403);
        }
    }
}
