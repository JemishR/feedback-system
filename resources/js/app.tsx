import { createInertiaApp } from '@inertiajs/react';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

import BaseLayout from '@/layouts/base-layout';

const appName = import.meta.env.VITE_APP_NAME || 'PulseDesk';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        let pageLayout;
        switch (true) {
            case name === 'welcome':
                pageLayout = null;
                break;
            case name.startsWith('auth/'):
                pageLayout = AuthLayout;
                break;
            case name.startsWith('settings/'):
                pageLayout = [AppLayout, SettingsLayout];
                break;
            case name.startsWith('public/'):
                pageLayout = null;
                break;
            default:
                pageLayout = AppLayout;
                break;
        }

        if (pageLayout === null) {
            return BaseLayout;
        }

        if (Array.isArray(pageLayout)) {
            return [BaseLayout, ...pageLayout];
        }

        return [BaseLayout, pageLayout];
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
            </TooltipProvider>
        );
    },
    progress: {
        color: '#6366f1',
    },
});

// This will set light / dark mode on load...
initializeTheme();
