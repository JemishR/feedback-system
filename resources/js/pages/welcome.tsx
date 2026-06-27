import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, MessageSquare, Map, Newspaper, Sparkles, Zap, CheckCircle2, LayoutGrid, Users } from 'lucide-react';

export default function Welcome({ canRegister = true }: { canRegister?: boolean }) {
    const { auth } = usePage().props;

    return (
        <>
            <Head title="PulseDesk - Customer Feedback & Feature Request Boards" />
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-50 selection:bg-indigo-500/30">
                {/* Navigation */}
                <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                        <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                                <MessageSquare className="h-4 w-4" />
                            </div>
                            <span className="text-xl font-bold tracking-tight">PulseDesk</span>
                        </div>
                        <nav className="flex items-center gap-4 text-sm font-medium">
                            <a href="#features" className="hidden text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 sm:block transition-colors">Features</a>
                            <a href="#pricing" className="hidden text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 sm:block transition-colors">Pricing</a>
                            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                            {auth.user ? (
                                <Link href="/dashboard" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all active:scale-95">
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link href="/login" className="text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition-colors">Log in</Link>
                                    {canRegister && (
                                        <Link href="/register" className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition-all active:scale-95">
                                            Get Started
                                        </Link>
                                    )}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main>
                    {/* Hero Section */}
                    <section className="relative overflow-hidden pt-24 pb-32">
                        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-slate-50 dark:from-indigo-900/20 dark:via-slate-950 dark:to-slate-950"></div>
                        <div className="mx-auto max-w-7xl px-6 text-center">
                            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-8 animate-fade-in">
                                <Sparkles className="h-4 w-4" />
                                <span>The modern way to build what users want</span>
                            </div>
                            <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-7xl mb-8 leading-[1.1]">
                                Listen to your users.<br />
                                <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">Build better products.</span>
                            </h1>
                            <p className="mx-auto max-w-2xl text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                                PulseDesk is the all-in-one platform to collect customer feedback, prioritize feature requests, share your roadmap, and announce product updates.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-xl bg-indigo-600 px-8 text-base font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-700 transition-all active:scale-95 w-full sm:w-auto">
                                    Start for free
                                </Link>
                                <a href="#features" className="inline-flex h-12 items-center justify-center rounded-xl bg-white dark:bg-slate-900 px-8 text-base font-semibold text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95 w-full sm:w-auto gap-2">
                                    See how it works
                                </a>
                            </div>
                            <p className="mt-6 text-sm text-slate-500">No credit card required · 14-day free trial</p>
                        </div>
                    </section>

                    {/* Features */}
                    <section id="features" className="py-24 bg-white dark:bg-slate-900">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center max-w-3xl mx-auto mb-16">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Everything you need to build better</h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400">Stop guessing what your users want. Give them a voice and make data-driven product decisions.</p>
                            </div>

                            <div className="grid gap-8 md:grid-cols-3">
                                {[
                                    { icon: LayoutGrid, title: 'Feedback Boards', desc: 'Create categorized boards for feature requests, bug reports, and general feedback. Let users vote on what matters most.' },
                                    { icon: Map, title: 'Public Roadmap', desc: 'Keep your users in the loop. Automatically sync feedback status to a beautiful Kanban-style public roadmap.' },
                                    { icon: Newspaper, title: 'Product Changelog', desc: 'Announce new features, improvements, and fixes. Close the feedback loop by showing users what you\'ve shipped.' },
                                    { icon: Users, title: 'User Management', desc: 'Track exactly who is asking for what. Understand which features are requested by your most valuable customers.' },
                                    { icon: Sparkles, title: 'Custom Branding', desc: 'Make it yours. Customize colors, logos, and use your own custom domain for a seamless brand experience.' },
                                    { icon: Zap, title: 'Lightning Fast', desc: 'Built on modern tech for instant loads and smooth transitions. Your users will love submitting feedback.' },
                                ].map((feature) => (
                                    <div key={feature.title} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 hover:shadow-lg transition-all dark:bg-slate-950/50 group">
                                        <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                            <feature.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center max-w-3xl mx-auto mb-16">
                                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Simple, transparent pricing</h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400">Start for free, upgrade when you need more power.</p>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                {/* Free Plan */}
                                <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm">
                                    <h3 className="text-xl font-semibold mb-2">Free</h3>
                                    <div className="mt-4 mb-6">
                                        <span className="text-4xl font-bold">$0</span>
                                        <span className="text-muted-foreground">/month</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-6">Perfect for small projects just getting started.</p>
                                    <Link href="/register" className="block w-full rounded-xl border border-indigo-200 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-3 text-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                                        Get Started
                                    </Link>
                                    <ul className="mt-8 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                                        <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 1 Project</li>
                                        <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> 3 Boards per project</li>
                                        <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Unlimited Feedback</li>
                                        <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Basic Roadmap</li>
                                    </ul>
                                </div>
                                
                                {/* Pro Plan */}
                                <div className="rounded-3xl border border-indigo-500 bg-white dark:bg-slate-900 p-8 shadow-xl relative">
                                    <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white uppercase tracking-wider">
                                        Most Popular
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">Pro</h3>
                                    <div className="mt-4 mb-6">
                                        <span className="text-4xl font-bold">$29</span>
                                        <span className="text-muted-foreground">/month</span>
                                    </div>
                                    <p className="text-muted-foreground text-sm mb-6">For growing teams that need more control.</p>
                                    <Link href="/register" className="block w-full rounded-xl bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-700 shadow-sm transition-colors">
                                        Start 14-day Trial
                                    </Link>
                                    <ul className="mt-8 space-y-3 text-sm text-slate-600 dark:text-slate-400">
                                        <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> <strong>Unlimited</strong> Projects</li>
                                        <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> <strong>Unlimited</strong> Boards</li>
                                        <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Custom Domains (Coming soon)</li>
                                        <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> API Access (Coming soon)</li>
                                        <li className="flex items-center gap-3"><CheckCircle2 className="h-4 w-4 text-emerald-500" /> Priority Support</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}
