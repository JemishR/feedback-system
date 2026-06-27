import { Head, Link, usePage } from '@inertiajs/react';
import { MessageSquare, ChevronUp, Map, Newspaper, ExternalLink } from 'lucide-react';
import type { Project, Board, Post } from '@/types';

type Props = { project: Project; boards: Board[]; recentPosts: Post[] };

export default function PublicBoard({ project, boards, recentPosts }: Props) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title={`${project.name} - Feedback`} />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* Header */}
                <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg sticky top-0 z-50">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white text-sm font-bold" style={{ backgroundColor: project.accent_color }}>
                                    {project.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-lg">{project.name}</span>
                            </div>
                        </div>
                        <nav className="flex items-center gap-1">
                            <Link href={`/p/${project.slug}`} className="rounded-lg px-3 py-2 text-sm font-medium transition-colors bg-accent">Feedback</Link>
                            <Link href={`/p/${project.slug}/roadmap`} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"><Map className="h-4 w-4 inline mr-1" />Roadmap</Link>
                            <Link href={`/p/${project.slug}/changelog`} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent"><Newspaper className="h-4 w-4 inline mr-1" />Changelog</Link>
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl px-6 py-8">
                    {/* Hero */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold tracking-tight">Share Your Feedback</h1>
                        <p className="text-muted-foreground mt-2">Help us build a better product. Vote on ideas or submit your own.</p>
                    </div>

                    {/* Boards Grid */}
                    <div className="grid gap-4 md:grid-cols-3 mb-10">
                        {boards.map((board) => (
                            <Link key={board.id} href={`/p/${project.slug}/board/${board.slug}`}
                                className="group rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm transition-all hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{board.name}</h3>
                                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all" />
                                </div>
                                {board.description && <p className="text-muted-foreground text-sm mt-1">{board.description}</p>}
                                <p className="text-muted-foreground text-xs mt-3">{board.posts_count ?? 0} posts</p>
                            </Link>
                        ))}
                    </div>

                    {/* Recent Posts */}
                    <h2 className="text-xl font-bold mb-4">Recent Feedback</h2>
                    <div className="space-y-2">
                        {recentPosts.map((post) => (
                            <Link key={post.id} href={`/p/${project.slug}/post/${post.id}`}
                                className="group flex items-center gap-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all hover:shadow-md">
                                <div className="flex flex-col items-center gap-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 px-3 py-2 min-w-[52px]">
                                    <ChevronUp className="h-4 w-4 text-indigo-500" />
                                    <span className="text-sm font-bold">{post.vote_count}</span>
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="truncate font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                                    <p className="text-muted-foreground text-xs mt-1">{post.board?.name} · {post.author_name} · {post.comment_count} comments</p>
                                </div>
                            </Link>
                        ))}
                        {recentPosts.length === 0 && <p className="text-muted-foreground text-center py-8">No feedback yet. Be the first!</p>}
                    </div>
                </main>
            </div>
        </>
    );
}
