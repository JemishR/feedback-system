<?php

use App\Http\Controllers\BoardController;
use App\Http\Controllers\ChangelogController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\PublicBoardController;
use App\Http\Controllers\TagController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

/*
|--------------------------------------------------------------------------
| Authenticated Routes (Dashboard & Admin)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function (\Illuminate\Http\Request $request) {
        $user = $request->user();
        $isSubscribed = $user->subscribed('default');
        $subscription = $isSubscribed ? $user->subscription('default') : null;
        
        $projects = $user->projects()->withCount(['boards', 'posts'])->get();
        
        // Simple stats for charts
        $stats = [
            'total_feedback' => $user->projects()->withCount('posts')->get()->sum('posts_count'),
            'total_votes' => \App\Models\Vote::whereIn('post_id', function($q) use ($user) {
                $q->select('id')->from('posts')->whereIn('board_id', function($q) use ($user) {
                    $q->select('id')->from('boards')->whereIn('project_id', $user->projects()->pluck('id'));
                });
            })->count(),
            'recent_activity' => \App\Models\Post::whereIn('board_id', function($q) use ($user) {
                $q->select('id')->from('boards')->whereIn('project_id', $user->projects()->pluck('id'));
            })->with('board.project')->latest()->take(5)->get(),
            'daily_stats' => \App\Models\Post::whereIn('board_id', function($q) use ($user) {
                $q->select('id')->from('boards')->whereIn('project_id', $user->projects()->pluck('id'));
            })->where('created_at', '>=', now()->subDays(30))
                ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->mapWithKeys(fn($item) => [$item->date => $item->count])
                ->toArray(),
        ];

        return \Inertia\Inertia::render('dashboard', [
            'isSubscribed' => $isSubscribed,
            'onTrial' => $user->onTrial(),
            'trialEndsAt' => $user->trial_ends_at ? $user->trial_ends_at->toIso8601String() : null,
            'endsAt' => $subscription && $subscription->ends_at ? $subscription->ends_at->toIso8601String() : null,
            'onGracePeriod' => $subscription && $subscription->onGracePeriod(),
            'projects' => $projects,
            'stats' => $stats,
        ]);
    })->name('dashboard');

    // Projects
    Route::resource('projects', ProjectController::class);

    // Nested under projects
    Route::prefix('projects/{project}')->name('projects.')->group(function () {
        // Boards
        Route::resource('boards', BoardController::class)->except(['create', 'edit']);

        // Posts (admin management)
        Route::get('posts', [PostController::class, 'index'])->name('posts.index');
        Route::get('posts/{post}', [PostController::class, 'show'])->name('posts.show');
        Route::patch('posts/{post}', [PostController::class, 'update'])->name('posts.update');
        Route::delete('posts/{post}', [PostController::class, 'destroy'])->name('posts.destroy');
        Route::post('posts/{post}/tags', [PostController::class, 'syncTags'])->name('posts.syncTags');

        // Comments (admin)
        Route::post('posts/{post}/comments', [CommentController::class, 'store'])->name('posts.comments.store');
        Route::delete('posts/{post}/comments/{comment}', [CommentController::class, 'destroy'])->name('posts.comments.destroy');

        // Tags
        Route::resource('tags', TagController::class)->only(['store', 'update', 'destroy']);

        // Changelog
        Route::resource('changelog', ChangelogController::class)->except(['edit']);
    });
});

/*
|--------------------------------------------------------------------------
| Public Routes (No auth required)
|--------------------------------------------------------------------------
*/
Route::prefix('p/{projectSlug}')->name('public.')->group(function () {
    Route::get('/', [PublicBoardController::class, 'index'])->name('index');
    Route::get('/board/{boardSlug}', [PublicBoardController::class, 'board'])->name('board');
    Route::get('/post/{postId}', [PublicBoardController::class, 'post'])->name('post');
    Route::post('/submit', [PublicBoardController::class, 'submitPost'])->name('submit');
    Route::post('/post/{postId}/vote', [PublicBoardController::class, 'vote'])->name('vote');
    Route::get('/post/{post}/verify-vote', [PublicBoardController::class, 'verifyVote'])->name('vote.verify');
    Route::post('/post/{postId}/comment', [PublicBoardController::class, 'comment'])->name('comment');
    Route::get('/post/{post}/verify-comment',[PublicBoardController::class, 'verifyComment'])->name('comment.verify');
    Route::get('/roadmap', [PublicBoardController::class, 'roadmap'])->name('roadmap');
    Route::get('/changelog', [PublicBoardController::class, 'changelog'])->name('changelog');
});

require __DIR__.'/settings.php';
