import { useState } from 'react';
import { router, Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { X, Mail, Sparkles, CheckCircle, ArrowRight } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function SubscribeModal({ isOpen, onClose }: Props) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [subscribed, setSubscribed] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setLoading(true);
        router.post(
            '/newsletter/subscribe',
            { email: email.trim() },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setLoading(false);
                    setSubscribed(true);
                    toast.success('Thank you for subscribing to our morning brief!');
                    setTimeout(() => {
                        setSubscribed(false);
                        setEmail('');
                        onClose();
                    }, 2000);
                },
                onError: (errors) => {
                    setLoading(false);
                    toast.error(errors.email || 'Failed to subscribe. Please try again.');
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div 
                className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-100"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
                >
                    <X className="w-5 h-5" />
                </button>

                {subscribed ? (
                    <div className="text-center py-6 space-y-3">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold font-serif text-slate-900">You're Subscribed!</h3>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                            The morning brief will arrive in your inbox each weekday at 06:00 UTC.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-5">
                        <div className="space-y-1.5">
                            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> Daily Editorial Brief
                            </span>
                            <h3 className="text-2xl font-black font-serif text-slate-950">
                                Subscribe to NewsPortal
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Join 140,000+ diplomats, founders, and readers receiving our verified reporting on global policy, AI breakthroughs, and capital markets.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="relative">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-600 focus:outline-none transition"
                                    required
                                    autoFocus
                                />
                                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2.5 rounded-xl transition shadow-sm disabled:opacity-50"
                            >
                                {loading ? 'Subscribing...' : 'Get Morning Dispatch'}
                            </button>
                        </form>

                        <div className="pt-4 border-t border-slate-100 text-center">
                            <p className="text-[11px] text-slate-500">
                                Want to bookmark stories and sync reading across devices?
                            </p>
                            <Link
                                href="/reader/login"
                                onClick={onClose}
                                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 mt-1"
                            >
                                Create a Free Account <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
