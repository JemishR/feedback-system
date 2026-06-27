<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckSubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && !$user->subscribed('default') && !$user->onTrial()) {
            $maxProjects = config('plans.free.max_projects', 1);
            $maxBoards = config('plans.free.max_boards', 3);
            
            $exceeded = $user->projects()->count() > $maxProjects;

            if (!$exceeded) {
                foreach ($user->projects as $project) {
                    if ($project->boards()->count() > $maxBoards) {
                        $exceeded = true;
                        break;
                    }
                }
            }

            if ($exceeded) {
                if ($request->is('projects*') && !$request->is('settings/billing*')) {
                    return redirect()->route('billing.edit')->with('error', 'You have exceeded the Free Plan limits (1 project, 3 boards). Please upgrade to Pro to continue managing your projects.');
                }
            }
        }

        return $next($request);
    }
}
