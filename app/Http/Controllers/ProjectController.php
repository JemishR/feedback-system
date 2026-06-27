<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    /**
     * Display a listing of the user's projects.
     */
    public function index(Request $request): Response
    {
        $projects = $request->user()->projects()
            ->withCount(['boards', 'posts'])
            ->latest()
            ->get();

        return Inertia::render('projects/index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create(): Response
    {
        return Inertia::render('projects/create');
    }

    /**
     * Store a newly created project.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $maxProjects = config('plans.free.max_projects', 1);

        if (!$user->subscribed('default') && !$user->onTrial() && $user->projects()->count() >= $maxProjects) {
            return back()->withErrors(['name' => "Free plan is limited to {$maxProjects} project. Please upgrade to Pro in Settings -> Billing to create more projects."]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'accent_color' => 'sometimes|string|max:7',
        ]);

        $slug = Str::slug($validated['name']);

        // Ensure slug is unique
        $originalSlug = $slug;
        $counter = 1;
        while (Project::where('slug', $slug)->exists()) {
            $slug = $originalSlug . '-' . $counter++;
        }

        $project = $request->user()->projects()->create([
            'name' => $validated['name'],
            'slug' => $slug,
            'accent_color' => $validated['accent_color'] ?? '#6366f1',
        ]);

        // Create default boards
        $project->boards()->createMany([
            ['name' => 'Feature Requests', 'slug' => 'feature-requests', 'sort_order' => 0],
            ['name' => 'Bug Reports', 'slug' => 'bug-reports', 'sort_order' => 1],
            ['name' => 'General', 'slug' => 'general', 'sort_order' => 2],
        ]);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project created successfully!');
    }

    /**
     * Display the specified project dashboard.
     */
    public function show(Request $request, Project $project): Response
    {
        $this->authorizeProject($request, $project);

        $project->load(['boards' => function ($query) {
            $query->withCount('posts');
        }]);

        // Get aggregate stats
        $stats = [
            'total_posts' => $project->posts()->count(),
            'total_votes' => $project->posts()->sum('vote_count'),
            'pending_posts' => $project->posts()->where('status', 'pending')->count(),
            'in_progress_posts' => $project->posts()->where('status', 'in_progress')->count(),
            'completed_posts' => $project->posts()->where('status', 'completed')->count(),
        ];

        // Recent posts
        $recentPosts = $project->posts()
            ->with('board')
            ->latest()
            ->take(10)
            ->get();

        // Top voted posts
        $topPosts = $project->posts()
            ->with('board')
            ->orderByDesc('vote_count')
            ->take(5)
            ->get();

        return Inertia::render('projects/show', [
            'project' => $project,
            'stats' => $stats,
            'recentPosts' => $recentPosts,
            'topPosts' => $topPosts,
        ]);
    }

    /**
     * Update the specified project.
     */
    public function update(Request $request, Project $project)
    {
        $this->authorizeProject($request, $project);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'accent_color' => 'sometimes|string|max:7',
            'is_public' => 'sometimes|boolean',
        ]);

        $project->update($validated);

        return back()->with('success', 'Project updated successfully!');
    }

    /**
     * Remove the specified project.
     */
    public function destroy(Request $request, Project $project)
    {
        $this->authorizeProject($request, $project);

        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully!');
    }

    /**
     * Authorize that the current user owns this project.
     */
    private function authorizeProject(Request $request, Project $project): void
    {
        if ($project->user_id !== $request->user()->id) {
            abort(403);
        }
    }
}
