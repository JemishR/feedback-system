import { Head, Link, usePage } from '@inertiajs/react';
import { Map, Newspaper } from 'lucide-react';
import type { Project, ChangelogEntry, PaginatedData } from '@/types';

type Props = {
    project: Project; entries: PaginatedData<ChangelogEntry>;
    typeColors: Record<string, string>; types: Record<string, string>;
};

export default function PublicChangelog({ project, entries, typeColors, types }: Props) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title={`Changelog - ${project.name}`} />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                <header className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg sticky top-0 z-50">
                    <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
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
                            <Link href={`/p/${project.slug}/roadmap`} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent"><Map className="h-4 w-4 inline mr-1" />Roadmap</Link>
                            <Link href={`/p/${project.slug}/changelog`} className="rounded-lg px-3 py-2 text-sm font-medium bg-accent"><Newspaper className="h-4 w-4 inline mr-1" />Changelog</Link>
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-3xl px-6 py-8">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold tracking-tight">Changelog</h1>
                        <p className="text-muted-foreground mt-2">All the latest updates and improvements.</p>
                    </div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800" />

                        <div className="space-y-8">
                            {entries.data.map((entry) => (
                                <div key={entry.id} className="relative flex gap-6">
                                    {/* Timeline dot */}
                                    <div className="relative z-10 mt-1.5">
                                        <div className="h-[10px] w-[10px] rounded-full ring-4 ring-white dark:ring-slate-900" style={{ backgroundColor: typeColors[entry.type] }} />
                                    </div>
                                    <div className="min-w-0 flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="rounded-full px-2.5 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: typeColors[entry.type] }}>{types[entry.type]}</span>
                                            <span className="text-xs text-muted-foreground">{entry.published_at ? new Date(entry.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
                                        </div>
                                        <h2 className="text-lg font-semibold">{entry.title}</h2>
                                        <div className="mt-3 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{entry.body}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {entries.data.length === 0 && (
                            <div className="text-center py-16">
                                <Newspaper className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                                <p className="text-muted-foreground">No changelog entries yet. Stay tuned!</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}
