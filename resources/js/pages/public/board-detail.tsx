import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ChevronUp, MessageSquare, Map, Newspaper, Plus, Send } from 'lucide-react';
import { useState } from 'react';
import type { Project, Board, Post, PaginatedData } from '@/types';

type Props = {
    project: Project; board: Board; posts: PaginatedData<Post>;
    statuses: Record<string, string>; statusColors: Record<string, string>;
};

export default function PublicBoardDetail({ project, board, posts, statuses, statusColors }: Props) {
    const { auth } = usePage().props;
    const [showForm, setShowForm] = useState(false);
    const form = useForm({ board_id: board.id, author_name: '', author_email: '', title: '', body: '' });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        form.post(`/p/${project.slug}/submit`, { onSuccess: () => { setShowForm(false); form.reset(); form.setData('board_id', board.id); } });
    }

    return (
        <>
            <Head title={`${board.name} - ${project.name}`} />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg sticky top-0 z-50">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-6">
                            <Link href={`/p/${project.slug}`} className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white text-sm font-bold" style={{ backgroundColor: project.accent_color }}>
                                    {project.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-lg">{project.name}</span>
                            </Link>
                        </div>
                        <nav className="flex items-center gap-1">
                            <Link href={`/p/${project.slug}`} className="rounded-lg px-3 py-2 text-sm font-medium bg-accent">Feedback</Link>
                            <Link href={`/p/${project.slug}/roadmap`} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"><Map className="h-4 w-4 inline mr-1" />Roadmap</Link>
                            <Link href={`/p/${project.slug}/changelog`} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"><Newspaper className="h-4 w-4 inline mr-1" />Changelog</Link>
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl px-6 py-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{board.name}</h1>
                            {board.description && <p className="text-muted-foreground mt-1 text-sm">{board.description}</p>}
                        </div>
                        <button onClick={() => setShowForm(!showForm)}
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 active:scale-[0.98] transition-all">
                            <Plus className="h-4 w-4" />Submit Feedback
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handleSubmit} className="mb-6 rounded-xl border border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-900 p-6 shadow-sm">
                            <h3 className="font-semibold mb-4">Submit Feedback</h3>
                            <div className="grid gap-3 md:grid-cols-2">
                                <input value={form.data.author_name} onChange={(e) => form.setData('author_name', e.target.value)} placeholder="Your name"
                                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                                <input value={form.data.author_email} onChange={(e) => form.setData('author_email', e.target.value)} placeholder="Your email" type="email"
                                    className="rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            </div>
                            <input value={form.data.title} onChange={(e) => form.setData('title', e.target.value)} placeholder="Title" className="mt-3 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            <textarea value={form.data.body} onChange={(e) => form.setData('body', e.target.value)} placeholder="Describe your idea or issue..." rows={4}
                                className="mt-3 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
                            <div className="flex justify-end gap-2 mt-4">
                                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-slate-200 dark:border-slate-700 px-4 py-2 text-sm hover:bg-accent">Cancel</button>
                                <button type="submit" disabled={form.processing}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                                    <Send className="h-3.5 w-3.5" />Submit
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="space-y-2">
                        {posts.data.map((post) => (
                            <Link key={post.id} href={`/p/${project.slug}/post/${post.id}`}
                                className="group flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all hover:shadow-md">
                                <div className="flex flex-col items-center gap-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 min-w-[52px]">
                                    <ChevronUp className="h-4 w-4 text-indigo-500" />
                                    <span className="text-sm font-bold">{post.vote_count}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                                    <p className="text-muted-foreground text-xs mt-1">{post.author_name} · {post.comment_count} comments</p>
                                </div>
                                <span className="rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: statusColors[post.status] }}>
                                    {statuses[post.status]}
                                </span>
                            </Link>
                        ))}
                        {posts.data.length === 0 && <p className="text-muted-foreground text-center py-12">No posts yet. Be the first to share feedback!</p>}
                    </div>
                </main>
            </div>
        </>
    );
}
