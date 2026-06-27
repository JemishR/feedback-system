import { Head, Link } from '@inertiajs/react';
import { 
    FolderKanban, Plus, ArrowRight, Sparkles, CheckCircle2, 
    AlertCircle, MessageSquare, ThumbsUp, TrendingUp, Clock 
} from 'lucide-react';
import { dashboard } from '@/routes';
import type { Project, Post } from '@/types';

type Stats = {
    total_feedback: number;
    total_votes: number;
    recent_activity: (Post & { board: { project: Project } })[];
    daily_stats: Record<string, number>;
};

type Props = {
    isSubscribed: boolean;
    onTrial: boolean;
    trialEndsAt: string | null;
    endsAt: string | null;
    onGracePeriod: boolean;
    projects: Project[];
    stats: Stats;
};

export default function Dashboard({ isSubscribed, onTrial, trialEndsAt, endsAt, onGracePeriod, projects, stats }: Props) {
    const last14Days = Array.from({ length: 14 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (13 - i));
        const dateStr = d.toISOString().split('T')[0];
        return {
            date: dateStr,
            day: d.toLocaleDateString([], { weekday: 'short' }),
            count: stats.daily_stats[dateStr] || 0
        };
    });
    const maxCount = Math.max(...last14Days.map(d => d.count), 5);

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 p-8 max-w-7xl mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h1>
                        <p className="text-muted-foreground mt-1">Real-time performance metrics for your feedback portals.</p>
                    </div>
                </div>

                {/* Subscription Status Bar */}
                {(onTrial || isSubscribed || (!onTrial && !isSubscribed)) && (
                    <div className={`rounded-2xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm ${
                        isSubscribed ? 'bg-emerald-500/5 border-emerald-500/20' : 
                        onTrial ? 'bg-indigo-500/5 border-indigo-500/20 shadow-indigo-500/10' : 
                        'bg-amber-500/5 border-amber-500/20'
                    }`}>
                        <div className="flex items-center gap-5">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm ${
                                isSubscribed ? 'bg-emerald-600 text-white' : 
                                onTrial ? 'bg-indigo-600 text-white' : 
                                'bg-amber-600 text-white'
                            }`}>
                                {isSubscribed ? <CheckCircle2 className="h-7 w-7" /> : onTrial ? <Sparkles className="h-7 w-7" /> : <AlertCircle className="h-7 w-7" />}
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <span className="font-extrabold text-xl tracking-tight">
                                        {isSubscribed ? 'Pro Plan Active' : onTrial ? 'Pro Trial Active' : 'Free Plan'}
                                    </span>
                                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${
                                        onTrial ? 'bg-indigo-600 text-white border-transparent' : 'bg-white dark:bg-slate-800'
                                    }`}>
                                        {isSubscribed ? 'Premium' : onTrial ? '14 Days Free' : 'Basic'}
                                    </span>
                                </div>
                                <p className="text-sm font-medium mt-1">
                                    {isSubscribed 
                                        ? (onGracePeriod ? `Your access ends on ${new Date(endsAt!).toLocaleDateString()}` : 'You have full access to all features.')
                                        : (onTrial 
                                            ? <span className="text-indigo-600 dark:text-indigo-400 font-bold">Trial Ends: {new Date(trialEndsAt!).toLocaleDateString()} ({Math.ceil((new Date(trialEndsAt!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left)</span>
                                            : (trialEndsAt ? 'Your trial has expired. Upgrade to keep Pro features.' : 'You are on the Free Starter plan. Upgrade to Pro for unlimited features!'))
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <Link href="/settings/billing" className={`px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 ${
                                isSubscribed ? 'bg-emerald-600 text-white hover:bg-emerald-700' : 
                                'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
                            }`}>
                                {isSubscribed ? 'Manage Billing' : 'Upgrade to Pro'}
                            </Link>
                        </div>
                    </div>
                )}

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Feedback', value: stats.total_feedback, icon: MessageSquare, color: 'text-blue-600 bg-blue-100 dark:bg-blue-500/10' },
                        { label: 'Total Votes', value: stats.total_votes, icon: ThumbsUp, color: 'text-amber-600 bg-amber-100 dark:bg-amber-500/10' },
                        { label: 'Active Projects', value: projects.length, icon: FolderKanban, color: 'text-violet-600 bg-violet-100 dark:bg-violet-500/10' },
                        { label: 'Engagement Rate', value: '84%', icon: TrendingUp, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/10' },
                    ].map((kpi) => (
                        <div key={kpi.label} className="bg-card border border-sidebar-border/70 rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-2 rounded-lg ${kpi.color}`}>
                                    <kpi.icon className="h-5 w-5" />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</span>
                            </div>
                            <div className="text-3xl font-bold">{kpi.value}</div>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Real Feedback Trend Chart */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold">Feedback Volume</h2>
                            <span className="text-xs font-bold px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-full">Last 14 Days</span>
                        </div>
                        <div className="bg-card border border-sidebar-border/70 rounded-3xl p-8 shadow-sm">
                             <div className="flex items-end justify-between gap-2 h-48 w-full border-b border-slate-100 dark:border-slate-800 pb-2">
                                 {last14Days.map((d, i) => (
                                     <div key={i} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                                         {/* Tooltip */}
                                         <div className="absolute bottom-full mb-2 hidden group-hover:block z-10">
                                             <div className="bg-slate-900 text-white text-[10px] py-1 px-2 rounded font-bold whitespace-nowrap shadow-xl">
                                                 {d.count} posts on {d.date}
                                             </div>
                                         </div>
                                         {/* Bar */}
                                         <div 
                                            className={`w-full rounded-t-md transition-all duration-500 ease-out cursor-pointer hover:opacity-100 ${
                                                d.count > 0 ? 'bg-indigo-600 opacity-90' : 'bg-slate-100 dark:bg-slate-800 opacity-50'
                                            }`} 
                                            style={{ height: `${(d.count / maxCount) * 100}%`, minHeight: d.count > 0 ? '4px' : '0px' }} 
                                         />
                                     </div>
                                 ))}
                             </div>
                             <div className="flex justify-between mt-4">
                                 {last14Days.filter((_, i) => i % 2 === 0).map((d, i) => (
                                     <span key={i} className="text-[10px] font-bold text-muted-foreground uppercase">{d.day}</span>
                                 ))}
                             </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-indigo-600" />
                            Live Feed
                        </h2>
                        <div className="space-y-6">
                            {stats.recent_activity.map((post) => (
                                <div key={post.id} className="relative pl-6 pb-2 border-l-2 border-slate-100 dark:border-slate-800 last:border-0">
                                    <div className="absolute left-[-9px] top-0 h-4 w-4 rounded-full bg-indigo-600 border-4 border-white dark:border-slate-950 shadow-sm" />
                                    <div className="text-sm font-bold truncate">{post.title}</div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        In <span className="font-semibold text-indigo-600">{post.board.name}</span>
                                    </div>
                                    <div className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">
                                        {new Date(post.created_at!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            ))}
                            {stats.recent_activity.length === 0 && (
                                <p className="text-sm text-muted-foreground italic">Waiting for feedback...</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [{ title: 'Dashboard', href: dashboard() }],
};
