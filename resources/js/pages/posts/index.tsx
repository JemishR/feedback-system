import { Head, Link, router } from '@inertiajs/react';
import { ChevronUp, MessageSquare } from 'lucide-react';
import type { Project, Post, Board, PaginatedData } from '@/types';

type Props = {
    project: Project; posts: PaginatedData<Post>; boards: Board[];
    sort: string; statusFilter: string | null; boardFilter: string | null;
};

const STATUS_COLORS: Record<string, string> = {
    pending: '#9ca3af', under_review: '#f59e0b', planned: '#6366f1',
    in_progress: '#3b82f6', completed: '#10b981', closed: '#ef4444',
};

export default function PostsIndex({ project, posts, boards, sort, statusFilter, boardFilter }: Props) {
    const base = `/projects/${project.id}/posts`;
    function applyFilter(params: Record<string, string | null>) {
        const searchParams = new URLSearchParams();
        const merged = { sort, status: statusFilter, board: boardFilter, ...params };
        Object.entries(merged).forEach(([k, v]) => { if (v) searchParams.set(k, v); });
        router.get(`${base}?${searchParams.toString()}`);
    }

    return (
        <>
            <Head title={`Posts - ${project.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">All Posts</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Manage all feedback across boards.</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider mr-1">Board:</span>
                    <button onClick={() => applyFilter({ board: null })}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${!boardFilter ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>All</button>
                    {boards.map((b) => (
                        <button key={b.id} onClick={() => applyFilter({ board: String(b.id) })}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${boardFilter === String(b.id) ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>{b.name}</button>
                    ))}

                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wider ml-4 mr-1">Sort:</span>
                    {['newest', 'top', 'oldest'].map((s) => (
                        <button key={s} onClick={() => applyFilter({ sort: s })}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${sort === s ? 'bg-indigo-600 text-white' : 'bg-muted text-muted-foreground hover:bg-accent'}`}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </button>
                    ))}
                </div>

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
                                <h3 className="truncate font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                                <p className="text-muted-foreground text-xs mt-1">{post.board?.name} · {post.author_name} · {post.comment_count} comments</p>
                            </div>
                            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: STATUS_COLORS[post.status] }}>
                                {post.status.replace('_', ' ')}
                            </span>
                        </Link>
                    ))}
                </div>

                {posts.last_page > 1 && (
                    <div className="flex justify-center gap-1">
                        {posts.links.map((link, i) => (
                            <button key={i} disabled={!link.url || link.active} onClick={() => link.url && router.get(link.url)}
                                className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${link.active ? 'bg-indigo-600 text-white' : 'hover:bg-accent text-muted-foreground'} disabled:opacity-50`}
                                dangerouslySetInnerHTML={{ __html: link.label }} />
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

PostsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: 'Posts', href: '#' },
    ],
};
