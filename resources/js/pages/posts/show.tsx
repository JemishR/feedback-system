import { Head, useForm, router } from '@inertiajs/react';
import { ChevronUp, MessageSquare, Pin, Trash2, Send } from 'lucide-react';
import type { Project, Post, Tag, Comment } from '@/types';

type Props = {
    project: Project; post: Post; allTags: Tag[];
    statuses: Record<string, string>; statusColors: Record<string, string>;
};

export default function PostShow({ project, post, allTags, statuses, statusColors }: Props) {
    const commentForm = useForm({ body: '' });
    const base = `/projects/${project.id}/posts/${post.id}`;

    function updateStatus(status: string) { router.patch(base, { status }); }
    function togglePin() { router.patch(base, { is_pinned: !post.is_pinned }); }
    function deletePost() { if (confirm('Delete this post?')) router.delete(base); }
    function toggleTag(tagId: number) {
        const current = post.tags?.map((t) => t.id) ?? [];
        const next = current.includes(tagId) ? current.filter((id) => id !== tagId) : [...current, tagId];
        router.post(`${base}/tags`, { tag_ids: next });
    }
    function submitComment(e: React.FormEvent) {
        e.preventDefault();
        commentForm.post(`${base}/comments`, { onSuccess: () => commentForm.reset() });
    }
    function deleteComment(commentId: number) {
        if (confirm('Delete comment?')) router.delete(`${base}/comments/${commentId}`);
    }

    return (
        <>
            <Head title={post.title} />
            <div className="flex h-full flex-1 gap-6 overflow-x-auto p-6">
                {/* Main Content */}
                <div className="min-w-0 flex-1 space-y-6">
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                        <div className="flex items-start gap-4">
                            <div className="flex flex-col items-center gap-0.5 rounded-lg bg-muted px-3 py-2 text-center min-w-[56px]">
                                <ChevronUp className="h-5 w-5 text-indigo-500" />
                                <span className="text-lg font-bold">{post.vote_count}</span>
                                <span className="text-[10px] text-muted-foreground">votes</span>
                            </div>
                            <div className="min-w-0 flex-1">
                                <h1 className="text-xl font-bold">{post.title}</h1>
                                <p className="text-muted-foreground text-sm mt-1">{post.author_name} ({post.author_email}) · {new Date(post.created_at).toLocaleString()}</p>
                                <div className="mt-4 text-sm leading-relaxed whitespace-pre-wrap">{post.body}</div>
                            </div>
                        </div>
                    </div>

                    {/* Comments */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card shadow-sm dark:border-sidebar-border">
                        <div className="border-b border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                            <h2 className="font-semibold flex items-center gap-2"><MessageSquare className="h-4 w-4" /> Comments ({post.comments?.length ?? 0})</h2>
                        </div>
                        <div className="divide-y divide-sidebar-border/70 dark:divide-sidebar-border">
                            {post.comments?.map((comment) => (
                                <div key={comment.id} className={`group px-5 py-4 ${comment.is_admin_reply ? 'bg-indigo-500/5 border-l-2 border-indigo-500' : ''}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-medium">{comment.author_name}</span>
                                            {comment.is_admin_reply && <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-[10px] font-medium text-white">Team</span>}
                                            <span className="text-muted-foreground text-xs">{new Date(comment.created_at).toLocaleString()}</span>
                                        </div>
                                        <button onClick={() => deleteComment(comment.id)} className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                    <p className="mt-1.5 text-sm whitespace-pre-wrap">{comment.body}</p>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={submitComment} className="border-t border-sidebar-border/70 px-5 py-4 dark:border-sidebar-border">
                            <div className="flex gap-2">
                                <input value={commentForm.data.body} onChange={(e) => commentForm.setData('body', e.target.value)} placeholder="Reply as admin..."
                                    className="flex-1 rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                                <button type="submit" disabled={commentForm.processing || !commentForm.data.body.trim()}
                                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 inline-flex items-center gap-1.5">
                                    <Send className="h-3.5 w-3.5" />Reply
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-72 shrink-0 space-y-4">
                    {/* Status */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm dark:border-sidebar-border">
                        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Status</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {Object.entries(statuses).map(([key, label]) => (
                                <button key={key} onClick={() => updateStatus(key)}
                                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${post.status === key ? 'text-white shadow-sm' : 'bg-muted text-muted-foreground hover:opacity-80'}`}
                                    style={post.status === key ? { backgroundColor: statusColors[key] } : {}}>{label}</button>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm dark:border-sidebar-border">
                        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {allTags.map((tag) => {
                                const active = post.tags?.some((t) => t.id === tag.id);
                                return (
                                    <button key={tag.id} onClick={() => toggleTag(tag.id)}
                                        className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${active ? 'text-white' : 'bg-muted text-muted-foreground'}`}
                                        style={active ? { backgroundColor: tag.color } : {}}>{tag.name}</button>
                                );
                            })}
                            {allTags.length === 0 && <p className="text-muted-foreground text-xs">No tags created yet.</p>}
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm dark:border-sidebar-border space-y-2">
                        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Actions</h3>
                        <button onClick={togglePin}
                            className={`w-full inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${post.is_pinned ? 'border-amber-500/30 bg-amber-500/10 text-amber-600' : 'border-input hover:bg-accent'}`}>
                            <Pin className="h-4 w-4" />{post.is_pinned ? 'Unpin' : 'Pin'} Post
                        </button>
                        <button onClick={deletePost} className="w-full inline-flex items-center gap-2 rounded-lg border border-red-500/30 px-3 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10">
                            <Trash2 className="h-4 w-4" />Delete Post
                        </button>
                    </div>

                    {/* Info */}
                    <div className="rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm dark:border-sidebar-border">
                        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3">Details</h3>
                        <dl className="space-y-2 text-sm">
                            <div><dt className="text-muted-foreground text-xs">Board</dt><dd className="font-medium">{post.board?.name}</dd></div>
                            <div><dt className="text-muted-foreground text-xs">Votes</dt><dd className="font-medium">{post.vote_count}</dd></div>
                            <div><dt className="text-muted-foreground text-xs">Comments</dt><dd className="font-medium">{post.comment_count}</dd></div>
                            <div><dt className="text-muted-foreground text-xs">Created</dt><dd className="font-medium">{new Date(post.created_at).toLocaleDateString()}</dd></div>
                        </dl>
                    </div>
                </div>
            </div>
        </>
    );
}

PostShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: 'Post', href: '#' },
    ],
};
