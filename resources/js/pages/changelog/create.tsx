import { Head, useForm, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { Project } from '@/types';

type Props = { project: Project; types: Record<string, string> };

export default function ChangelogCreate({ project, types }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '', body: '', type: 'improvement', is_published: false,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/projects/${project.id}/changelog`);
    }

    return (
        <>
            <Head title={`New Changelog Entry - ${project.name}`} />
            <div className="mx-auto w-full max-w-2xl p-6">
                <Link href={`/projects/${project.id}/changelog`} className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm transition-colors">
                    <ArrowLeft className="h-4 w-4" />Back to Changelog
                </Link>

                <div className="mt-4 rounded-xl border border-sidebar-border/70 bg-card p-8 shadow-sm dark:border-sidebar-border">
                    <h1 className="text-2xl font-bold tracking-tight">New Changelog Entry</h1>
                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        <div>
                            <label htmlFor="cl-title" className="block text-sm font-medium">Title</label>
                            <input id="cl-title" value={data.title} onChange={(e) => setData('title', e.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="What shipped?" autoFocus />
                            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                        </div>
                        <div>
                            <label htmlFor="cl-type" className="block text-sm font-medium">Type</label>
                            <select id="cl-type" value={data.type} onChange={(e) => setData('type', e.target.value)}
                                className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                                {Object.entries(types).map(([key, label]) => (
                                    <option key={key} value={key}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="cl-body" className="block text-sm font-medium">Description</label>
                            <textarea id="cl-body" value={data.body} onChange={(e) => setData('body', e.target.value)} rows={8}
                                className="mt-1.5 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Describe the changes..." />
                            {errors.body && <p className="mt-1 text-sm text-red-500">{errors.body}</p>}
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" checked={data.is_published} onChange={(e) => setData('is_published', e.target.checked)}
                                className="rounded border-input text-indigo-600 focus:ring-indigo-500" />
                            <span className="text-sm font-medium">Publish immediately</span>
                        </label>
                        <div className="flex justify-end gap-3 pt-2">
                            <Link href={`/projects/${project.id}/changelog`} className="rounded-lg border border-input px-4 py-2.5 text-sm font-medium hover:bg-accent">Cancel</Link>
                            <button type="submit" disabled={processing}
                                className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50">
                                {processing ? 'Saving...' : 'Save Entry'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

ChangelogCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: '/projects' },
        { title: 'Changelog', href: '#' },
        { title: 'New Entry', href: '#' },
    ],
};
