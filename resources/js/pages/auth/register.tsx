import { Head, Link } from '@inertiajs/react';
import { login } from '@/routes';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

export default function Register() {
    return (
        <>
            <Head title="Registration Closed" />
            <div className="flex flex-col items-center text-center py-6 px-4 space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-base font-bold text-slate-900">Registration is Closed</h2>
                    <p className="text-xs text-slate-500 max-w-xs mt-1">
                        Public self-registration is disabled. All reporters, editors, contributors, and members are onboarded directly by newsroom administrators.
                    </p>
                </div>
                <div className="pt-2">
                    <Link
                        href={login()}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
                    </Link>
                </div>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Registration Closed',
    description: 'Newsroom accounts are managed by administration',
};
