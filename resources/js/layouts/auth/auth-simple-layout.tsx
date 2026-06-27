import { Link } from '@inertiajs/react';
import { MessageSquare, Sparkles, LayoutGrid, CheckCircle2 } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
            {/* Left Panel - Branding/Marketing */}
            <div className="hidden lg:flex w-1/2 flex-col justify-between bg-indigo-600 dark:bg-indigo-900 p-12 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-indigo-500/50 via-transparent to-transparent"></div>
                
                <div className="relative z-10">
                    <Link href={home()} className="flex items-center gap-2.5 mb-16">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-md">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                        <span className="text-2xl font-bold tracking-tight">PulseDesk</span>
                    </Link>

                    <h2 className="text-4xl font-bold leading-tight mb-6">
                        Build better products <br /> by listening to your users.
                    </h2>
                    <p className="text-indigo-100 text-lg max-w-md mb-12">
                        Join thousands of product teams who use PulseDesk to collect feedback, prioritize features, and announce product updates.
                    </p>

                    <div className="space-y-6">
                        {[
                            { icon: LayoutGrid, text: 'Create unlimited feedback boards' },
                            { icon: CheckCircle2, text: 'Prioritize tasks with a public roadmap' },
                            { icon: Sparkles, text: 'Keep users engaged with a product changelog' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 text-indigo-50">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                                    <item.icon className="h-5 w-5" />
                                </div>
                                <span className="font-medium">{item.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="relative z-10 text-indigo-200 text-sm">
                    © {new Date().getFullYear()} PulseDesk Inc. All rights reserved.
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="flex w-full lg:w-1/2 flex-col items-center justify-center p-6 md:p-12 relative">
                {/* Mobile Header Logo */}
                <div className="lg:hidden absolute top-8 left-8">
                    <Link href={home()} className="flex items-center gap-2 text-slate-900 dark:text-white">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
                            <MessageSquare className="h-4 w-4" />
                        </div>
                        <span className="font-bold">PulseDesk</span>
                    </Link>
                </div>

                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        <div className="space-y-3">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
                            <p className="text-slate-500 dark:text-slate-400">
                                {description}
                            </p>
                        </div>
                        
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
