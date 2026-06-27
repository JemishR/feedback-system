<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:check-expired-trials')]
#[Description('Command description')]
class CheckExpiredTrials extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Checking for expired trials...');
        
        $expiredUsers = \App\Models\User::where('trial_ends_at', '<', now())
            ->whereDoesntHave('subscriptions', function($q) {
                $q->where('stripe_status', 'active');
            })->get();
            
        foreach($expiredUsers as $user) {
            $this->warn("User {$user->email} trial has expired.");
        }
        
        $this->info('Done.');
    }
}
