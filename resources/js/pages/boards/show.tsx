import { Head, Link, router } from '@inertiajs/react';
import { ChevronUp, MessageSquare, Pin, Trash2 } from 'lucide-react';
import type { Project, Board, Post, PaginatedData } from '@/types';

type Props = {
    project: Project; board: Board; posts: PaginatedData<Post>;
    sort: string; statusFilter: string | null;
};

const STATUS_COLORS: Record<string, string> = {
    pending: '#9ca3af', under_review: '#f59e0b', planned: '#6366f1',
    in_progress: '#3b82f6', completed: '#10b981', closed: '#ef4444',
};
const STATUSES: Record<string, string> = {
    pending: 'Pending', under_review: 'Under Review', planned: 'Planned',
    in_progress: 'In Progress', completed: 'Completed', closed: 'Closed',
};

export default function BoardShow({ project, board, posts, sort, statusFilter }: Props) {
    const base = `/projects/${project.id}/boards/${board.id}`;
    function applyFilter(params: Record<string, string | null>) {
        const searchParams = new URLSearchParams();
        const merged = { sort, status: statusFilter, ...params };
        Object.entries(merged).forEach(([k, v]) => { if (v) searchParams.set(k, v); });
        router.get(`${base}?${searchParams.toString()}`);
    }

    return (
        <>
            <Head title={`${board.name} - ${project.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{board.name}</h1>
                    {board.description && <p className="text-muted-foreground mt-1 text-sm">{board.description}</p>}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider mr-1">Sort:</span>
                    {['newest', 'top', 'oldest'].map((s) => (
                        <button key={s} onClick={() => applyFilter({ sort: s })}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${sort === s ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider ml-4 mr-1">Status:</span>
                    <button onClick={() => applyFilter({ status: null })}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${!statusFilter ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>All</button>
                    {Object.entries(STATUSES).map(([key, label]) => (
                        <button key={key} onClick={() => applyFilter({ status: key })}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${statusFilter === key ? 'text-white' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
                            style={statusFilter === key ? { backgroundColor: STATUS_COLORS[key] } : {}}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Posts */}
                <div className="space-y-2">
                    {posts.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/70 p-12 dark:border-sidebar-border">
                            <MessageSquare className="h-8 w-8 text-muted-foreground mb-3" />
                            <p className="text-muted-foreground text-sm">No posts found.</p>
                        </div>
                    ) : posts.data.map((post) => (
                        <Link key={post.id} href={`/projects/${project.id}/posts/${post.id}`}
                            className="group flex items-center gap-4 rounded-xl border border-sidebar-border/70 bg-card p-4 shadow-sm transition-all hover:shadow-md hover:border-indigo-500/30 dark:border-sidebar-border">
                            <div className="flex flex-col items-center gap-0.5 rounded-lg bg-muted px-3 py-2 text-center min-w-[52px]">
                                <ChevronUp className="h-4 w-4 text-indigo-500" />
                                <span className="text-sm font-bold">{post.vote_count}</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    {post.is_pinned && <Pin className="h-3.5 w-3.5 text-amber-500" />}
                                    <h3 className="truncate font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                                </div>
                                <p className="text-muted-foreground text-xs mt-1">{post.author_name} · {new Date(post.created_at).toLocaleDateString()} · {post.comment_count} comments</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {post.tags?.map((tag) => (
                                    <span key={tag.id} className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: tag.color }}>{tag.name}</span>
                                ))}
                                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: STATUS_COLORS[post.status] }}>
                                    {post.status.replace('_', ' ')}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Pagination */}
                {posts.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {posts.links.map((link, i) => (
                            <button key={i} disabled={!link.url || link.active}
                                onClick={() => link.url && router.get(link.url)}
                                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${link.active ? 'bg-indigo-600 text-white' : 'hover:bg-accent text-muted-foreground'} disabled:opacity-50`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

BoardShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: 'Board', href: '#' },
    ],
};
