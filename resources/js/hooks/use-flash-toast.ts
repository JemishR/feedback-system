import { usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    const { props } = usePage();
    const flash = props.flash as {
        success?: string | null;
        error?: string | null;
        toast?: FlashToast | null;
    } | undefined;

    // Use refs to track already displayed flash messages to avoid duplicate toasts on component re-renders
    const lastSuccessRef = useRef<string | null>(null);
    const lastErrorRef = useRef<string | null>(null);
    const lastToastRef = useRef<string | null>(null);

    useEffect(() => {
        if (!flash) return;

        if (flash.toast && JSON.stringify(flash.toast) !== lastToastRef.current) {
            lastToastRef.current = JSON.stringify(flash.toast);
            const type = flash.toast.type || 'success';
            if (typeof toast[type] === 'function') {
                toast[type](flash.toast.message);
            } else {
                toast.success(flash.toast.message);
            }
        }

        if (flash.success && flash.success !== lastSuccessRef.current) {
            lastSuccessRef.current = flash.success;
            toast.success(flash.success);
        }

        if (flash.error && flash.error !== lastErrorRef.current) {
            lastErrorRef.current = flash.error;
            toast.error(flash.error);
        }
    }, [flash]);
}
