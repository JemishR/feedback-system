<?php

namespace Database\Seeders;

use App\Models\Board;
use App\Models\ChangelogEntry;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Project;
use App\Models\Tag;
use App\Models\User;
use App\Models\Vote;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // Create demo user
        $user = User::firstOrCreate(
            ['email' => 'admin@pulsedesk.app'],
            ['name' => 'Admin', 'password' => bcrypt('password')]
        );

        // Create demo project
        $project = $user->projects()->create([
            'name' => 'PulseDesk',
            'slug' => 'pulsedesk',
            'accent_color' => '#6366f1',
            'is_public' => true,
        ]);

        // Boards
        $features = $project->boards()->create(['name' => 'Feature Requests', 'slug' => 'feature-requests', 'sort_order' => 0]);
        $bugs = $project->boards()->create(['name' => 'Bug Reports', 'slug' => 'bug-reports', 'sort_order' => 1]);
        $general = $project->boards()->create(['name' => 'General', 'slug' => 'general', 'sort_order' => 2]);

        // Tags
        $tags = collect([
            $project->tags()->create(['name' => 'UI/UX', 'color' => '#6366f1']),
            $project->tags()->create(['name' => 'Performance', 'color' => '#f59e0b']),
            $project->tags()->create(['name' => 'API', 'color' => '#10b981']),
            $project->tags()->create(['name' => 'Mobile', 'color' => '#ec4899']),
            $project->tags()->create(['name' => 'Security', 'color' => '#ef4444']),
        ]);

        // Feature Request Posts
        $posts = [
            ['board' => $features, 'title' => 'Dark mode support', 'body' => 'Would love to see a dark mode option. My eyes hurt at night!', 'status' => 'completed', 'votes' => 42],
            ['board' => $features, 'title' => 'Export data to CSV', 'body' => 'Need the ability to export all feedback data to CSV for analysis.', 'status' => 'in_progress', 'votes' => 28],
            ['board' => $features, 'title' => 'Slack integration', 'body' => 'Get notified in Slack when new feedback is submitted.', 'status' => 'planned', 'votes' => 35],
            ['board' => $features, 'title' => 'Custom domains', 'body' => 'I want to use my own domain for the public board.', 'status' => 'planned', 'votes' => 19],
            ['board' => $features, 'title' => 'Keyboard shortcuts', 'body' => 'Add keyboard shortcuts for faster navigation.', 'status' => 'under_review', 'votes' => 12],
            ['board' => $features, 'title' => 'Multi-language support', 'body' => 'Support for multiple languages on the public board.', 'status' => 'pending', 'votes' => 8],
            ['board' => $bugs, 'title' => 'Page flickers on load', 'body' => 'The page flickers briefly when loading the dashboard.', 'status' => 'in_progress', 'votes' => 15],
            ['board' => $bugs, 'title' => 'Email notifications delayed', 'body' => 'Email notifications take 10+ minutes to arrive.', 'status' => 'pending', 'votes' => 7],
            ['board' => $general, 'title' => 'Pricing feedback', 'body' => 'The Pro plan is great value. Consider adding a yearly discount.', 'status' => 'under_review', 'votes' => 22],
            ['board' => $general, 'title' => 'Great product!', 'body' => 'Just wanted to say your tool is fantastic. Keep up the work!', 'status' => 'closed', 'votes' => 31],
        ];

        $names = ['Sarah Chen', 'Mike Johnson', 'Emma Wilson', 'Alex Kumar', 'Lisa Park', 'Tom Brown', 'Nina Garcia', 'James Lee'];

        foreach ($posts as $postData) {
            $post = $postData['board']->posts()->create([
                'title' => $postData['title'],
                'body' => $postData['body'],
                'author_name' => $names[array_rand($names)],
                'author_email' => strtolower(str_replace(' ', '.', $names[array_rand($names)])) . '@example.com',
                'status' => $postData['status'],
                'vote_count' => $postData['votes'],
                'is_pinned' => $postData['votes'] > 30,
            ]);

            // Add random tags
            $post->tags()->attach($tags->random(rand(1, 2))->pluck('id'));

            // Create votes
            for ($i = 0; $i < $postData['votes']; $i++) {
                $post->votes()->create([
                    'voter_email' => "voter{$i}_{$post->id}@example.com",
                    'ip_address' => '127.0.0.1',
                ]);
            }

            // Add comments
            $commentCount = rand(0, 4);
            for ($i = 0; $i < $commentCount; $i++) {
                $isAdmin = rand(0, 1) === 1;
                $post->comments()->create([
                    'author_name' => $isAdmin ? 'Admin' : $names[array_rand($names)],
                    'author_email' => $isAdmin ? 'admin@pulsedesk.app' : strtolower(str_replace(' ', '.', $names[array_rand($names)])) . '@example.com',
                    'user_id' => $isAdmin ? $user->id : null,
                    'body' => $isAdmin ? 'Thanks for the feedback! We are looking into this.' : 'I would love this feature too! +1',
                    'is_admin_reply' => $isAdmin,
                ]);
            }
            $post->recalculateCommentCount();
        }

        // Changelog entries
        $project->changelogEntries()->createMany([
            ['title' => 'Dark Mode is Live!', 'body' => "We've shipped dark mode across the entire platform. Your eyes will thank you. Toggle it from the settings menu or it will follow your system preference.", 'type' => 'feature', 'is_published' => true, 'published_at' => now()->subDays(2)],
            ['title' => 'Performance Improvements', 'body' => "Dashboard loads 3x faster now. We optimized database queries and added caching for frequently accessed data.", 'type' => 'improvement', 'is_published' => true, 'published_at' => now()->subDays(7)],
            ['title' => 'Fixed email notification delays', 'body' => "Email notifications are now sent within seconds of an event. We migrated to a dedicated queue worker.", 'type' => 'fix', 'is_published' => true, 'published_at' => now()->subDays(14)],
            ['title' => 'CSV Export Coming Soon', 'body' => "We're working on a comprehensive CSV export feature. Export posts, votes, and comments.", 'type' => 'announcement', 'is_published' => true, 'published_at' => now()->subDays(1)],
        ]);

        $this->command->info('Demo data seeded! Login: admin@pulsedesk.app / password');
    }
}
