<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\Tag;
use Illuminate\Http\Request;

class TagController extends Controller
{
    /**
     * Store a new tag for a project.
     */
    public function store(Request $request, Project $project)
    {
        $this->authorizeProject($request, $project);

        $validated = $request->validate([
            'name' => 'required|string|max:50',
            'color' => 'sometimes|string|max:7',
        ]);

        $project->tags()->create($validated);

        return back()->with('success', 'Tag created!');
    }

    /**
     * Update a tag.
     */
    public function update(Request $request, Project $project, Tag $tag)
    {
        $this->authorizeProject($request, $project);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:50',
            'color' => 'sometimes|string|max:7',
        ]);

        $tag->update($validated);

        return back()->with('success', 'Tag updated!');
    }

    /**
     * Remove a tag.
     */
    public function destroy(Request $request, Project $project, Tag $tag)
    {
        $this->authorizeProject($request, $project);

        $tag->delete();

        return back()->with('success', 'Tag deleted!');
    }

    private function authorizeProject(Request $request, Project $project): void
    {
        if ($project->user_id !== $request->user()->id) {
            abort(403);
        }
    }
}
