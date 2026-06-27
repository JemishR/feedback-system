import { Head, Link } from '@inertiajs/react';
import { ArrowUpRight, ChevronUp, Clock, CheckCircle2, Loader2, FolderKanban, MessageSquare, ExternalLink } from 'lucide-react';
import type { Project, Post, ProjectStats, Board } from '@/types';

type Props = {
    project: Project;
    stats: ProjectStats;
    recentPosts: Post[];
    topPosts: Post[];
};

const STATUS_COLORS: Record<string, string> = {
    pending: '#9ca3af', under_review: '#f59e0b', planned: '#6366f1',
    in_progress: '#3b82f6', completed: '#10b981', closed: '#ef4444',
};

export default function ProjectShow({ project, stats, recentPosts, topPosts }: Props) {
    return (
        <>
            <Head title={project.name} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl text-white text-lg font-bold shadow-lg" style={{ backgroundColor: project.accent_color }}>
                            {project.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{project.name}</h1>
                            <div className="flex items-center gap-3 mt-1">
                                <a href={`/p/${project.slug}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-indigo-500 text-xs inline-flex items-center gap-1 transition-colors">
                                    /p/{project.slug} <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Link href={`/projects/${project.id}/boards`} className="rounded-lg border border-input px-3 py-2 text-sm font-medium transition-colors hover:bg-accent">Boards</Link>
                        <Link href={`/projects/${project.id}/posts`} className="rounded-lg border border-input px-3 py-2 text-sm font-medium transition-colors hover:bg-accent">All Posts</Link>
                        <Link href={`/projects/${project.id}/changelog`} className="rounded-lg border border-input px-3 py-2 text-sm font-medium transition-colors hover:bg-accent">Changelog</Link>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid gap-4 md:grid-cols-5">
                    {[
                        { label: 'Total Posts', value: stats.total_posts, icon: MessageSquare, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                        { label: 'Total Votes', value: stats.total_votes, icon: ChevronUp, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                        { label: 'Pending', value: stats.pending_posts, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                        { label: 'In Progress', value: stats.in_progress_posts, icon: Loader2, color: 'text-sky-500', bg: 'bg-sky-500/10' },
                        { label: 'Completed', value: stats.completed_posts, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    ].map((stat) => (
                        <div key={stat.label} className="rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm transition-all hover:shadow-md dark:border-sidebar-border">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{stat.label}</span>
                                <div className={`rounded-lg p-1.5 ${stat.bg}`}>
                                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="mt-2 text-3xl font-bold tracking-tight">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Boards */}
                {project.boards && project.boards.length > 0 && (
                    <div>
                        <h2 className="text-lg font-semibold mb-3">Boards</h2>
                        <div className="grid gap-3 md:grid-cols-3">
                            {project.boards.map((board) => (
                                <Link key={board.id} href={`/projects/${project.id}/boards/${board.id}`}
                                    className="group rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-500/30 dark:border-sidebar-border">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FolderKanban className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-medium">{board.name}</span>
                                        </div>
                                        <span className="text-muted-foreground text-sm">{board.posts_count ?? 0} posts</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Recent Posts */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border">
                        <div className="border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                            <h2 className="font-semibold">Recent Posts</h2>
                        </div>
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {recentPosts.length === 0 ? (
                                <p className="text-muted-foreground p-5 text-sm">No posts yet.</p>
                            ) : recentPosts.map((post) => (
                                <Link key={post.id} href={`/projects/${project.id}/posts/${post.id}`}
                                    className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-accent/50">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                                        <ChevronUp className="h-3.5 w-3.5" />{post.vote_count}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{post.title}</p>
                                        <p className="text-muted-foreground text-xs">{post.board?.name} · {new Date(post.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: STATUS_COLORS[post.status] }}>
                                        {post.status.replace('_', ' ')}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Top Voted */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border">
                        <div className="border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                            <h2 className="font-semibold">Top Voted</h2>
                        </div>
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {topPosts.length === 0 ? (
                                <p className="text-muted-foreground p-5 text-sm">No posts yet.</p>
                            ) : topPosts.map((post, i) => (
                                <Link key={post.id} href={`/projects/${project.id}/posts/${post.id}`}
                                    className="group flex items-center gap-3 px-5 py-3 transition-colors hover:bg-accent/50">
                                    <span className="text-muted-foreground text-sm font-medium w-5 text-center">#{i + 1}</span>
                                    <div className="flex h-8 items-center gap-1 rounded-lg bg-indigo-500/10 px-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                                        <ChevronUp className="h-3.5 w-3.5" />{post.vote_count}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate text-sm font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{post.title}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

ProjectShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: 'Overview', href: '#' },
    ],
};
