import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import { ChevronUp, Map, Newspaper, Send } from 'lucide-react';
import { useState } from 'react';
import type { Project, Post } from '@/types';

type Props = {
    project: Project;
    post: Post;
    statuses: Record<string, string>;
    statusColors: Record<string, string>;
};

export default function PublicPost({ project, post, statuses, statusColors }: Props) {
    const { auth } = usePage().props;

    const [voteEmail, setVoteEmail] = useState('');

    const commentForm = useForm({
        author_name: '',
        author_email: '',
        body: '',
    });

    function handleVote(e: React.FormEvent) {
        e.preventDefault();

        const errors = usePage().props.errors;
        const hasWarning =
            errors?.voter_email &&
            String(errors.voter_email).toLowerCase().includes('already voted');

        if (hasWarning) {
            if (!confirm('You have already voted on this post. Do you want to remove your vote?')) {
                return;
            }

            router.post(`/p/${project.slug}/post/${post.id}/vote`, {
                voter_email: voteEmail,
                confirm_remove: true,
            });

            return;
        }

        router.post(`/p/${project.slug}/post/${post.id}/vote`, {
            voter_email: voteEmail,
        });
    }

    function handleComment(e: React.FormEvent) {
        e.preventDefault();

        commentForm.post(`/p/${project.slug}/post/${post.id}/comment`, {
            preserveScroll: true,
            onSuccess: () => commentForm.reset(),
        });
    }

    return (
        <>
            <Head title={`${post.title} - ${project.name}`} />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg dark:border-slate-800 dark:bg-slate-950/80">
                    <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-6">
                            <Link href={`/p/${project.slug}`} className="flex items-center gap-3">
                                <div
                                    className="flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold text-white"
                                    style={{ backgroundColor: project.accent_color }}
                                >
                                    {project.name.charAt(0).toUpperCase()}
                                </div>

                                <span className="text-lg font-semibold">{project.name}</span>
                            </Link>
                        </div>

                        <nav className="flex items-center gap-1">
                            <Link
                                href={`/p/${project.slug}`}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
                            >
                                Feedback
                            </Link>

                            <Link
                                href={`/p/${project.slug}/roadmap`}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
                            >
                                <Map className="mr-1 inline h-4 w-4" />
                                Roadmap
                            </Link>

                            <Link
                                href={`/p/${project.slug}/changelog`}
                                className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"
                            >
                                <Newspaper className="mr-1 inline h-4 w-4" />
                                Changelog
                            </Link>
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-5xl px-6 py-8">
                    <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
                        <div className="space-y-6">
                            {/* Post */}
                            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="mb-3 flex items-center gap-2">
                                    <Link
                                        href={`/p/${project.slug}/board/${post.board?.slug}`}
                                        className="text-xs text-muted-foreground transition-colors hover:text-indigo-500"
                                    >
                                        {post.board?.name}
                                    </Link>

                                    <span className="text-xs text-muted-foreground">·</span>

                                    <span
                                        className="rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white"
                                        style={{ backgroundColor: statusColors[post.status] }}
                                    >
                                        {statuses[post.status]}
                                    </span>
                                </div>

                                <h1 className="text-2xl font-bold">{post.title}</h1>

                                <p className="mt-2 text-sm text-muted-foreground">
                                    {post.author_name} ·{' '}
                                    {new Date(post.created_at).toLocaleDateString()}
                                </p>

                                <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed">
                                    {post.body}
                                </div>
                            </div>

                            {/* Comments */}
                            <div className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="border-b border-slate-200 px-6 py-4 dark:border-slate-800">
                                    <h2 className="font-semibold">
                                        Comments ({post.comments?.length ?? 0})
                                    </h2>
                                </div>

                                <div className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {post.comments?.map((c) => (
                                        <div
                                            key={c.id}
                                            className={`px-6 py-4 ${c.is_admin_reply
                                                    ? 'border-l-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30'
                                                    : ''
                                                }`}
                                        >
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium">
                                                    {c.author_name}
                                                </span>

                                                {c.is_admin_reply && (
                                                    <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-[10px] font-medium text-white">
                                                        Team
                                                    </span>
                                                )}

                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(
                                                        c.created_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <p className="mt-1.5 whitespace-pre-wrap text-sm">
                                                {c.body}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Comment Form */}
                                <form
                                    onSubmit={handleComment}
                                    className="space-y-3 border-t border-slate-200 p-6 dark:border-slate-800"
                                >
                                    <div className="grid gap-3 md:grid-cols-2">
                                        <div>
                                            <input
                                                value={commentForm.data.author_name}
                                                onChange={(e) =>
                                                    commentForm.setData(
                                                        'author_name',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Your name"
                                                className="w-full rounded-lg border border-slate-200 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700"
                                            />

                                            {commentForm.errors.author_name && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {commentForm.errors.author_name}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <input
                                                value={commentForm.data.author_email}
                                                onChange={(e) =>
                                                    commentForm.setData(
                                                        'author_email',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Your email"
                                                type="email"
                                                className="w-full rounded-lg border border-slate-200 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700"
                                            />

                                            {commentForm.errors.author_email && (
                                                <p className="mt-1 text-xs text-red-500">
                                                    {commentForm.errors.author_email}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <textarea
                                            value={commentForm.data.body}
                                            onChange={(e) =>
                                                commentForm.setData(
                                                    'body',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Add a comment..."
                                            rows={3}
                                            className="w-full rounded-lg border border-slate-200 bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700"
                                        />

                                        {commentForm.errors.body && (
                                            <p className="mt-1 text-xs text-red-500">
                                                {commentForm.errors.body}
                                            </p>
                                        )}
                                    </div>

                                    {usePage().props.flash?.success && (
                                        <p className="text-sm text-emerald-500">
                                            {usePage().props.flash.success}
                                        </p>
                                    )}

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={commentForm.processing}
                                            className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            <Send className="h-3.5 w-3.5" />
                                            Comment
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                <div className="mb-4 inline-flex flex-col items-center gap-1 rounded-xl bg-slate-100 px-6 py-4 dark:bg-slate-800">
                                    <ChevronUp className="h-6 w-6 text-indigo-500" />
                                    <span className="text-2xl font-bold">
                                        {post.vote_count}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        votes
                                    </span>
                                </div>

                                <form onSubmit={handleVote} className="space-y-2">
                                    <input
                                        value={voteEmail}
                                        onChange={(e) => setVoteEmail(e.target.value)}
                                        placeholder="Your email to vote"
                                        type="email"
                                        required
                                        className="w-full rounded-lg border border-slate-200 bg-background px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700"
                                    />

                                    {usePage().props.errors?.voter_email && (
                                        <p className="text-left text-xs text-red-500">
                                            {usePage().props.errors.voter_email}
                                        </p>
                                    )}

                                    {usePage().props.flash?.success && (
                                        <p className="text-left text-xs text-emerald-500">
                                            {usePage().props.flash.success}
                                        </p>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                                    >
                                        <ChevronUp className="mr-1 inline h-4 w-4" />
                                        Upvote
                                    </button>
                                </form>
                            </div>

                            {post.tags && post.tags.length > 0 && (
                                <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                                    <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                        Tags
                                    </h3>

                                    <div className="flex flex-wrap gap-1.5">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag.id}
                                                className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                                                style={{ backgroundColor: tag.color }}
                                            >
                                                {tag.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}