import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Bookmark, ArrowRight, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import InputError from '@/components/input-error';

interface Props {
    status?: string;
    hasGoogleConfigured: boolean;
}

export default function ReaderLogin({ status, hasGoogleConfigured }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        name: '',
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/reader/login');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-between text-slate-900 selection:bg-blue-600 selection:text-white">
            <Head title="Reader Sign In & Free Account | NEWSPORTAL" />

            {/* Header Navigation */}
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-white font-black text-lg tracking-tighter shadow-xs group-hover:bg-blue-700 transition">
                        N
                    </div>
                    <span className="text-xl font-black tracking-tight text-slate-950 font-serif">
                        NEWSPORTAL
                    </span>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-mono uppercase tracking-wider font-semibold ml-1">
                        Reader
                    </span>
                </Link>

                <Link
                    href="/"
                    className="text-xs font-medium text-slate-500 hover:text-slate-800 transition flex items-center gap-1.5"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to Headlines
                </Link>
            </div>

            {/* Main Portal Card */}
            <div className="w-full max-w-md mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 space-y-6">
                    <div className="space-y-2 text-center">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                            <Bookmark className="w-6 h-6 fill-current" />
                        </div>
                        <h1 className="text-2xl font-black tracking-tight font-serif text-slate-900">
                            Reader Reading List
                        </h1>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                            Sign in or create a free reader account to sync your saved bookmarks across devices and receive personal dispatches.
                        </p>
                    </div>

                    {status && (
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-3 rounded-xl font-medium text-center">
                            {status}
                        </div>
                    )}

                    {/* Google OAuth One-Click Access */}
                    <div className="space-y-2">
                        <a
                            href="/auth/google/redirect"
                            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold py-2.5 px-4 rounded-xl border border-slate-300 shadow-xs hover:border-slate-400 transition cursor-pointer group"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12c0 2.03.45 3.84 1.25 5.42l4.03-3.15z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                                />
                            </svg>
                            <span>Continue with Google</span>
                        </a>
                        <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
                            <Sparkles className="w-3 h-3 text-amber-500" />
                            <span>Instant login & auto account creation</span>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider text-[10px]">
                                or continue with email
                            </span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="email" className="text-xs font-semibold text-slate-700">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="name@example.com"
                                className="rounded-xl border-slate-300 focus:border-blue-600 focus:ring-blue-600 text-sm"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="name" className="text-xs font-semibold text-slate-700">
                                    Display Name <span className="text-slate-400 font-normal">(optional)</span>
                                </Label>
                            </div>
                            <Input
                                id="name"
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="e.g. Jane Doe"
                                className="rounded-xl border-slate-300 focus:border-blue-600 focus:ring-blue-600 text-sm"
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-xs font-semibold text-slate-700">
                                    Password <span className="text-slate-400 font-normal">(optional)</span>
                                </Label>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••"
                                className="rounded-xl border-slate-300 focus:border-blue-600 focus:ring-blue-600 text-sm"
                            />
                            <InputError message={errors.password} />
                            <p className="text-[11px] text-slate-400">
                                If you already set a password on your reader account, enter it here.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer"
                        >
                            {processing && <Spinner className="w-4 h-4 text-white" />}
                            <span>Continue to Reading List</span>
                            <ArrowRight className="w-4 h-4" />
                        </Button>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-slate-500 leading-relaxed">
                                Don&apos;t have an account? Submitting this form automatically provisions your free reader account. No complex password requirements.
                            </p>
                        </div>
                    </form>
                </div>

                {/* Newsroom Staff Link */}
                <div className="text-center mt-6 space-y-2">
                    <p className="text-xs text-slate-500">
                        Are you an author, editor, or administrator?{' '}
                        <Link
                            href="/login"
                            className="text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2"
                        >
                            Log in to Editorial CMS
                        </Link>
                    </p>
                </div>
            </div>

            {/* Simple Footer */}
            <div className="border-t border-slate-200 py-4 text-center text-xs text-slate-400">
                © {new Date().getFullYear()} NEWSPORTAL Inc. Reader Accounts are strictly for public readers & subscribers.
            </div>
        </div>
    );
}
