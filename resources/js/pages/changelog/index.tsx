import { Head, Link, router } from '@inertiajs/react';
import { Plus, Trash2, Eye, EyeOff, Newspaper } from 'lucide-react';
import type { Project, ChangelogEntry, PaginatedData } from '@/types';

type Props = {
    project: Project; entries: PaginatedData<ChangelogEntry>;
    types: Record<string, string>; typeColors: Record<string, string>;
};

export default function ChangelogIndex({ project, entries, types, typeColors }: Props) {
    function togglePublish(entry: ChangelogEntry) {
        router.patch(`/projects/${project.id}/changelog/${entry.id}`, { is_published: !entry.is_published });
    }
    function deleteEntry(id: number) {
        if (confirm('Delete this entry?')) router.delete(`/projects/${project.id}/changelog/${id}`);
    }

    return (
        <>
            <Head title={`Changelog - ${project.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Changelog</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Announce updates and shipped features.</p>
                    </div>
                    <Link href={`/projects/${project.id}/changelog/create`}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]">
                        <Plus className="h-4 w-4" />New Entry
                    </Link>
                </div>

                {entries.data.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/70 p-12 dark:border-sidebar-border">
                        <Newspaper className="h-8 w-8 text-muted-foreground mb-3" />
                        <p className="text-muted-foreground text-sm">No changelog entries yet.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {entries.data.map((entry) => (
                            <div key={entry.id} className="group rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm transition-all hover:shadow-md dark:border-sidebar-border">
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-2">
                                            <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white" style={{ backgroundColor: typeColors[entry.type] }}>{types[entry.type]}</span>
                                            <h3 className="font-semibold">{entry.title}</h3>
                                            {!entry.is_published && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">Draft</span>}
                                        </div>
                                        <p className="text-muted-foreground text-sm mt-2 line-clamp-2">{entry.body}</p>
                                        <p className="text-muted-foreground text-xs mt-2">
                                            {entry.published_at ? `Published ${new Date(entry.published_at).toLocaleDateString()}` : `Created ${new Date(entry.created_at).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                        <button onClick={() => togglePublish(entry)} className="rounded-lg p-2 text-muted-foreground hover:bg-accent transition-colors" title={entry.is_published ? 'Unpublish' : 'Publish'}>
                                            {entry.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                        <button onClick={() => deleteEntry(entry.id)} className="rounded-lg p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

ChangelogIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: 'Changelog', href: '#' },
    ],
};
