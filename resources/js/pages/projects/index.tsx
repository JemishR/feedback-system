import { Head, Link, router } from '@inertiajs/react';
import { FolderKanban, Plus, MessageSquare, ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';

type Props = {
    projects: Project[];
};

export default function ProjectsIndex({ projects }: Props) {
    return (
        <>
            <Head title="Projects" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
                        <p className="text-muted-foreground mt-1 text-sm">Manage your feedback boards and track feature requests.</p>
                    </div>
                    <Link
                        href="/projects/create"
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md active:scale-[0.98]"
                    >
                        <Plus className="h-4 w-4" />
                        New Project
                    </Link>
                </div>

                {/* Project Grid */}
                {projects.length === 0 ? (
                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-sidebar-border/70 p-12 dark:border-sidebar-border">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10">
                            <FolderKanban className="h-8 w-8 text-indigo-500" />
                        </div>
                        <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
                        <p className="text-muted-foreground mt-1 text-sm">Create your first project to start collecting feedback.</p>
                        <Link
                            href="/projects/create"
                            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700"
                        >
                            <Plus className="h-4 w-4" />
                            Create Project
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/projects/${project.id}`}
                                className="group relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm transition-all hover:shadow-lg hover:border-indigo-500/30 dark:border-sidebar-border dark:hover:border-indigo-500/40"
                            >
                                <div className="absolute inset-x-0 top-0 h-1 transition-all group-hover:h-1.5" style={{ backgroundColor: project.accent_color }} />
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white text-sm font-bold" style={{ backgroundColor: project.accent_color }}>
                                            {project.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{project.name}</h3>
                                            <p className="text-muted-foreground text-xs mt-0.5">/{project.slug}</p>
                                        </div>
                                    </div>
                                    <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100" />
                                </div>
                                <div className="mt-5 flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <FolderKanban className="h-3.5 w-3.5" />
                                        <span>{project.boards_count ?? 0} boards</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        <span>{project.posts_count ?? 0} posts</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

ProjectsIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
    ],
};
