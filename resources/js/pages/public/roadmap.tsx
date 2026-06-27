import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronUp, Map, Newspaper } from 'lucide-react';
import type { Project, Post } from '@/types';

type Props = {
    project: Project;
    columns: { planned: Post[]; in_progress: Post[]; completed: Post[] };
    statusColors: Record<string, string>;
};

const COLUMN_CONFIG = [
    { key: 'planned' as const, title: 'Planned', color: '#6366f1', icon: '📋' },
    { key: 'in_progress' as const, title: 'In Progress', color: '#3b82f6', icon: '🚧' },
    { key: 'completed' as const, title: 'Completed', color: '#10b981', icon: '✅' },
];

export default function PublicRoadmap({ project, columns }: Props) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title={`Roadmap - ${project.name}`} />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg sticky top-0 z-50">
                    <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                        <div className="flex items-center gap-6">
                            <Link href={`/p/${project.slug}`} className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg text-white text-sm font-bold" style={{ backgroundColor: project.accent_color }}>
                                    {project.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-semibold text-lg">{project.name}</span>
                            </Link>
                        </div>
                        <nav className="flex items-center gap-1">
                            <Link href={`/p/${project.slug}`} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent">Feedback</Link>
                            <Link href={`/p/${project.slug}/roadmap`} className="rounded-lg px-3 py-2 text-sm font-medium bg-accent"><Map className="h-4 w-4 inline mr-1" />Roadmap</Link>
                            <Link href={`/p/${project.slug}/changelog`} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"><Newspaper className="h-4 w-4 inline mr-1" />Changelog</Link>
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-6 py-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold tracking-tight">Product Roadmap</h1>
                        <p className="text-muted-foreground mt-2">See what we're working on and what's coming next.</p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {COLUMN_CONFIG.map((col) => (
                            <div key={col.key}>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-lg">{col.icon}</span>
                                    <h2 className="font-semibold">{col.title}</h2>
                                    <span className="rounded-full bg-slate-200 dark:bg-slate-700 px-2 py-0.5 text-xs font-medium">{columns[col.key].length}</span>
                                </div>
                                <div className="space-y-2">
                                    {columns[col.key].map((post) => (
                                        <Link key={post.id} href={`/p/${project.slug}/post/${post.id}`}
                                            className="group block rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-sm transition-all hover:shadow-md">
                                            <h3 className="font-medium text-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{post.title}</h3>
                                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                <span className="inline-flex items-center gap-0.5"><ChevronUp className="h-3 w-3 text-indigo-500" />{post.vote_count}</span>
                                                <span>{post.board?.name}</span>
                                            </div>
                                        </Link>
                                    ))}
                                    {columns[col.key].length === 0 && (
                                        <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-6 text-center">
                                            <p className="text-muted-foreground text-sm">Nothing here yet</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
}
