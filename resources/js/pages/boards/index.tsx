import { Head, Link, useForm, router } from '@inertiajs/react';
import { FolderKanban, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { Project, Board } from '@/types';

type Props = { project: Project; boards: Board[] };

export default function BoardsIndex({ project, boards }: Props) {
    const [showCreate, setShowCreate] = useState(false);
    const form = useForm({ name: '', description: '', is_public: true });

    function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        form.post(`/projects/${project.id}/boards`, { onSuccess: () => { setShowCreate(false); form.reset(); } });
    }

    function handleDelete(boardId: number) {
        if (confirm('Delete this board and all its posts?')) {
            router.delete(`/projects/${project.id}/boards/${boardId}`);
        }
    }

    return (
        <>
            <Head title={`Boards - ${project.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Boards</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Organize feedback into categories for {project.name}.</p>
                    </div>
                    <button onClick={() => setShowCreate(!showCreate)}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-[0.98]">
                        <Plus className="h-4 w-4" />New Board
                    </button>
                </div>

                {showCreate && (
                    <form onSubmit={handleCreate} className="rounded-xl border border-indigo-500/30 bg-card p-5 shadow-sm">
                        <h3 className="font-semibold mb-4">Create Board</h3>
                        <div className="space-y-3">
                            <input value={form.data.name} onChange={(e) => form.setData('name', e.target.value)} placeholder="Board name"
                                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" autoFocus />
                            {form.errors.name && <p className="text-xs text-red-500 mt-1 font-medium">{form.errors.name}</p>}
                            <textarea value={form.data.description ?? ''} onChange={(e) => form.setData('description', e.target.value)} placeholder="Description (optional)"
                                className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" rows={2} />
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setShowCreate(false)} className="rounded-lg border border-input px-4 py-2 text-sm hover:bg-accent">Cancel</button>
                                <button type="submit" disabled={form.processing} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">Create</button>
                            </div>
                        </div>
                    </form>
                )}

                <div className="space-y-3">
                    {boards.map((board) => (
                        <div key={board.id} className="group flex items-center justify-between rounded-xl border border-sidebar-border/70 bg-card p-5 shadow-sm transition-all hover:shadow-md dark:border-sidebar-border">
                            <Link href={`/projects/${project.id}/boards/${board.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                                <FolderKanban className="h-5 w-5 text-indigo-500" />
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{board.name}</h3>
                                        {!board.is_public && <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                                    </div>
                                    {board.description && <p className="text-muted-foreground text-sm truncate mt-0.5">{board.description}</p>}
                                </div>
                            </Link>
                            <div className="flex items-center gap-3">
                                <span className="text-muted-foreground text-sm">{board.posts_count ?? 0} posts</span>
                                <button onClick={() => handleDelete(board.id)} className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

BoardsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: 'Boards', href: '#' },
    ],
};
