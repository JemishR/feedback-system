import { Head, useForm, usePage } from '@inertiajs/react';
import { CreditCard, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-react';
import Heading from '@/components/heading';

type Props = {
    isSubscribed: boolean;
    onTrial?: boolean;
    trialEndsAt?: string | null;
    planName: string;
    status: string | null;
    endsAt: string | null;
    onGracePeriod: boolean;
    stripeKey: string | null;
};

export default function Billing({ isSubscribed, onTrial, trialEndsAt, planName, status, endsAt, onGracePeriod, stripeKey }: Props) {
    const { url } = usePage();
    const isSuccess = url.includes('success=1');
    const isCanceled = url.includes('canceled=1');

    const checkoutForm = useForm({});
    const portalForm = useForm({});

    function handleCheckout(e: React.FormEvent) {
        e.preventDefault();
        checkoutForm.post('/settings/billing/checkout');
    }

    function handlePortal(e: React.FormEvent) {
        e.preventDefault();
        portalForm.post('/settings/billing/portal');
    }

    return (
        <>
            <Head title="Billing Settings" />

            <div className="space-y-6">
                <Heading variant="small" title="Billing & Subscription" description="Manage your subscription plan and payment methods." />

                {isSuccess && (
                    <div className="rounded-lg bg-emerald-500/10 p-4 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 mt-0.5" />
                        <div>
                            <p className="font-semibold">Subscription successful!</p>
                            <p>Thank you for upgrading to Pro. Your features are now active.</p>
                        </div>
                    </div>
                )}

                {isCanceled && (
                    <div className="rounded-lg bg-amber-500/10 p-4 border border-amber-500/20 text-amber-600 dark:text-amber-500 text-sm flex items-start gap-3">
                        <AlertCircle className="h-5 w-5 mt-0.5" />
                        <div>
                            <p className="font-semibold">Checkout canceled</p>
                            <p>Your subscription was not processed. You remain on the Free plan.</p>
                        </div>
                    </div>
                )}

                <div className="rounded-xl border border-sidebar-border/70 bg-card p-6 shadow-sm dark:border-sidebar-border">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            <CreditCard className="h-5 w-5" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg">Current Plan: {planName}</h3>
                            <p className="text-sm text-muted-foreground">
                                {isSubscribed 
                                    ? status === 'active' 
                                        ? onGracePeriod 
                                            ? `Your subscription ends on ${new Date(endsAt!).toLocaleDateString()}.` 
                                            : 'Your subscription is active.'
                                        : `Subscription status: ${status}`
                                    : onTrial && trialEndsAt
                                        ? `Your free trial ends on ${new Date(trialEndsAt).toLocaleDateString()}. Upgrade now to keep Pro features.`
                                        : 'You are currently on the free Starter plan. Upgrade to Pro for unlimited access.'}
                            </p>
                        </div>
                    </div>

                    {!isSubscribed && (
                        <div className="rounded-lg border border-indigo-500 p-5 bg-indigo-50 dark:bg-indigo-500/5">
                            <h4 className="font-semibold text-indigo-900 dark:text-indigo-300 mb-2">Upgrade to Pro ($29/month)</h4>
                            <ul className="space-y-2 mb-5 text-sm text-indigo-800 dark:text-indigo-200">
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Unlimited Projects & Boards</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Custom Domains</li>
                                <li className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Remove PulseDesk branding</li>
                            </ul>
                            
                            {!stripeKey ? (
                                <div className="text-sm text-amber-600 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded p-3">
                                    <strong>Developer Note:</strong> Stripe is not fully configured in your .env file yet. Add STRIPE_KEY and STRIPE_SECRET to enable checkout.
                                </div>
                            ) : (
                                <form onSubmit={handleCheckout}>
                                    <button 
                                        type="submit" 
                                        disabled={checkoutForm.processing}
                                        className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                                    >
                                        {checkoutForm.processing ? 'Processing...' : 'Upgrade Now'}
                                    </button>
                                </form>
                            )}
                        </div>
                    )}

                    {isSubscribed && (
                        <div className="pt-4 border-t border-sidebar-border/70 dark:border-sidebar-border">
                            <p className="text-sm text-muted-foreground mb-4">Manage your payment methods, download invoices, or cancel your subscription securely via Stripe.</p>
                            <form onSubmit={handlePortal}>
                                <button 
                                    type="submit" 
                                    disabled={portalForm.processing}
                                    className="inline-flex items-center gap-2 rounded-lg border border-input px-5 py-2.5 text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
                                >
                                    Manage Billing in Stripe
                                    <ExternalLink className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
