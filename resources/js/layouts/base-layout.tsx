import { Toaster } from '@/components/ui/sonner';

export default function BaseLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {children}
            <Toaster />
        </>
    );
}
