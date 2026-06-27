<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class BillingController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $isSubscribed = $user->subscribed('default');
        $subscription = $isSubscribed ? $user->subscription('default') : null;
        $onTrial = $user->onTrial();
        $trialEndsAt = $onTrial && $user->trial_ends_at ? $user->trial_ends_at->toIso8601String() : null;

        return Inertia::render('settings/billing', [
            'isSubscribed' => $isSubscribed,
            'onTrial' => $onTrial,
            'trialEndsAt' => $trialEndsAt,
            'planName' => $isSubscribed ? 'Pro Plan' : ($onTrial ? 'Pro Plan (Trial)' : 'Free Starter'),
            'status' => $subscription ? $subscription->stripe_status : null,
            'endsAt' => $subscription && $subscription->ends_at ? $subscription->ends_at->toIso8601String() : null,
            'onGracePeriod' => $subscription && $subscription->onGracePeriod(),
            'stripeKey' => config('services.stripe.key') ?? config('cashier.key'),
        ]);
    }

    public function checkout(Request $request)
    {
        // Require a price ID. In a real app, this would be a config or env var.
        // E.g., price_1XXXXXXX
        $priceId = $request->input('price_id', config('services.stripe.price_id', 'price_fake_id'));

        return $request->user()
            ->newSubscription('default', $priceId)
            ->checkout([
                'success_url' => route('billing.edit', ['success' => 1]),
                'cancel_url' => route('billing.edit', ['canceled' => 1]),
            ]);
    }

    public function portal(Request $request)
    {
        return $request->user()->redirectToBillingPortal(route('billing.edit'));
    }
}
