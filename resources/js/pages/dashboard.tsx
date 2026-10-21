import { useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { LayoutDashboard, Globe, ArrowRight } from 'lucide-react';

export default function Dashboard() {
    useEffect(() => {
        router.visit('/cms', { replace: true });
    }, []);

    return (
        <>
            <Head title="Redirecting to CMS..." />
            <div className="flex h-full flex-1 flex-col items-center justify-center p-8 text-center">
                <div className="max-w-md space-y-4 bg-white dark:bg-neutral-900 p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mx-auto">
                        <LayoutDashboard className="w-6 h-6" />
                    </div>
                    <h1 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                        Redirecting to Newsroom CMS...
                    </h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        The editorial workspace has been centralized under the newsroom command center.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                        <Link
                            href="/cms"
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition"
                        >
                            <span>Open Newsroom CMS</span>
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-200 rounded-lg text-sm font-semibold transition"
                        >
                            <Globe className="w-4 h-4" />
                            <span>View Public Site</span>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Newsroom CMS',
            href: '/cms',
        },
    ],
};
