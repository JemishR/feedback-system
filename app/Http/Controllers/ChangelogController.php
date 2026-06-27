<?php

namespace App\Http\Controllers;

use App\Models\ChangelogEntry;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChangelogController extends Controller
{
    /**
     * Display all changelog entries for a project.
     */
    public function index(Request $request, Project $project): Response
    {
        $this->authorizeProject($request, $project);

        $entries = $project->changelogEntries()
            ->latest('created_at')
            ->paginate(20);

        return Inertia::render('changelog/index', [
            'project' => $project,
            'entries' => $entries,
            'types' => ChangelogEntry::TYPES,
            'typeColors' => ChangelogEntry::TYPE_COLORS,
        ]);
    }

    /**
     * Show the form for creating a new entry.
     */
    public function create(Request $request, Project $project): Response
    {
        $this->authorizeProject($request, $project);

        return Inertia::render('changelog/create', [
            'project' => $project,
            'types' => ChangelogEntry::TYPES,
        ]);
    }

    /**
     * Store a newly created changelog entry.
     */
    public function store(Request $request, Project $project)
    {
        $this->authorizeProject($request, $project);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'type' => 'required|string|in:' . implode(',', array_keys(ChangelogEntry::TYPES)),
            'is_published' => 'sometimes|boolean',
        ]);

        if (!empty($validated['is_published'])) {
            $validated['published_at'] = now();
        }

        $project->changelogEntries()->create($validated);

        return redirect()->route('projects.changelog.index', $project)
            ->with('success', 'Changelog entry created!');
    }

    /**
     * Update a changelog entry.
     */
    public function update(Request $request, Project $project, ChangelogEntry $changelog)
    {
        $this->authorizeProject($request, $project);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'type' => 'sometimes|string|in:' . implode(',', array_keys(ChangelogEntry::TYPES)),
            'is_published' => 'sometimes|boolean',
        ]);

        // Set published_at when publishing for the first time
        if (!empty($validated['is_published']) && !$changelog->is_published) {
            $validated['published_at'] = now();
        }

        $changelog->update($validated);

        return back()->with('success', 'Changelog entry updated!');
    }

    /**
     * Remove a changelog entry.
     */
    public function destroy(Request $request, Project $project, ChangelogEntry $changelog)
    {
        $this->authorizeProject($request, $project);

        $changelog->delete();

        return back()->with('success', 'Changelog entry deleted!');
    }

    private function authorizeProject(Request $request, Project $project): void
    {
        if ($project->user_id !== $request->user()->id) {
            abort(403);
        }
    }
}
