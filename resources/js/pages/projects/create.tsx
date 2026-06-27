import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6'];

export default function ProjectsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        accent_color: '#6366f1',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/projects');
    }

    return (
        <>
            <Head title="Create Project" />
            <div className="mx-auto w-full max-w-2xl p-6">
                <Link href="/projects" className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Projects
                </Link>

                <div className="mt-4 rounded-xl border border-sidebar-border/70 bg-card p-8 shadow-sm dark:border-sidebar-border">
                    <h1 className="text-2xl font-bold tracking-tight">Create New Project</h1>
                    <p className="text-muted-foreground mt-1 text-sm">Set up a new feedback board for your product.</p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="project-name" className="block text-sm font-medium">Project Name</label>
                            <input
                                id="project-name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm shadow-sm transition-colors focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                placeholder="e.g. My Awesome App"
                                autoFocus
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Brand Color</label>
                            <p className="text-muted-foreground mt-0.5 text-xs">Choose a color that represents your project.</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                                {COLORS.map((color) => (
                                    <button
                                        key={color}
                                        type="button"
                                        onClick={() => setData('accent_color', color)}
                                        className="h-9 w-9 rounded-full transition-all hover:scale-110"
                                        style={{
                                            backgroundColor: color,
                                            boxShadow: data.accent_color === color ? `0 0 0 3px var(--background), 0 0 0 5px ${color}` : 'none',
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="rounded-lg border border-dashed border-sidebar-border/70 p-4 dark:border-sidebar-border">
                            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">Preview</p>
                            <div className="mt-3 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg text-white text-sm font-bold" style={{ backgroundColor: data.accent_color }}>
                                    {data.name ? data.name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div>
                                    <p className="font-semibold">{data.name || 'Project Name'}</p>
                                    <p className="text-muted-foreground text-xs">pulsedesk.app/p/{data.name ? data.name.toLowerCase().replace(/\s+/g, '-') : 'your-project'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                            <Link href="/projects" className="rounded-lg border border-input px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Project'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

ProjectsCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: 'Create', href: '/projects/create' },
    ],
};
