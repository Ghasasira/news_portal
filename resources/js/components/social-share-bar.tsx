import React, { useState } from 'react';
import { 
    Copy, 
    Check, 
    Share2, 
    Mail, 
    Send,
    ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

interface SocialShareBarProps {
    title: string;
    url?: string;
    variant?: 'compact' | 'expanded';
    className?: string;
}

export function SocialShareBar({
    title,
    url,
    variant = 'compact',
    className = '',
}: SocialShareBarProps) {
    const [copied, setCopied] = useState(false);

    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedTitle = encodeURIComponent(title);

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2500);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    const handleNativeShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: title,
                    url: shareUrl,
                });
            } catch (err) {
                // User cancelled or share failed silently
            }
        } else {
            handleCopyLink();
        }
    };

    const handleInstagramShare = async () => {
        // If native share is available (mobile iOS/Android), it supports Instagram direct/stories
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `${title}\n\nRead more: ${shareUrl}`,
                    url: shareUrl,
                });
                return;
            } catch {
                // Fall back to copy
            }
        }

        // Desktop fallback: copy formatted text and prompt
        try {
            await navigator.clipboard.writeText(`${title} - Read more on NEWSPORTAL: ${shareUrl}`);
            toast.success('Caption & story link copied! Open Instagram to share.');
            window.open('https://www.instagram.com', '_blank');
        } catch {
            toast.error('Failed to copy Instagram caption');
        }
    };

    // Social Links
    const links = {
        whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%0A%0A${encodedUrl}`,
        x: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
        email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    };

    if (variant === 'expanded') {
        return (
            <div className={`p-6 bg-slate-50 border border-slate-200 rounded-2xl ${className}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                    <div>
                        <h3 className="font-serif font-black text-lg text-slate-900">
                            Share this reporting
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            Distribute trusted investigative journalism across your network.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleCopyLink}
                        className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied to Clipboard' : 'Copy Shortlink'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-4">
                    {/* WhatsApp */}
                    <a
                        href={links.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-semibold text-xs transition gap-1.5"
                    >
                        <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                            WA
                        </span>
                        <span>WhatsApp</span>
                    </a>

                    {/* X (Twitter) */}
                    <a
                        href={links.x}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900 text-white hover:bg-black font-semibold text-xs transition gap-1.5"
                    >
                        <span className="w-7 h-7 rounded-full bg-white text-slate-900 flex items-center justify-center text-xs font-black">
                            𝕏
                        </span>
                        <span>X / Twitter</span>
                    </a>

                    {/* Facebook */}
                    <a
                        href={links.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 font-semibold text-xs transition gap-1.5"
                    >
                        <span className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                            fb
                        </span>
                        <span>Facebook</span>
                    </a>

                    {/* Instagram */}
                    <button
                        type="button"
                        onClick={handleInstagramShare}
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200 font-semibold text-xs transition gap-1.5 cursor-pointer"
                        title="Share on Instagram Story or Feed"
                    >
                        <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-xs font-bold">
                            IG
                        </span>
                        <span>Instagram</span>
                    </button>

                    {/* LinkedIn */}
                    <a
                        href={links.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 font-semibold text-xs transition gap-1.5"
                    >
                        <span className="w-7 h-7 rounded-full bg-sky-600 text-white flex items-center justify-center text-xs font-bold">
                            in
                        </span>
                        <span>LinkedIn</span>
                    </a>

                    {/* Telegram */}
                    <a
                        href={links.telegram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-cyan-50 text-cyan-700 hover:bg-cyan-100 border border-cyan-200 font-semibold text-xs transition gap-1.5"
                    >
                        <span className="w-7 h-7 rounded-full bg-cyan-600 text-white flex items-center justify-center text-xs font-bold">
                            TG
                        </span>
                        <span>Telegram</span>
                    </a>

                    {/* Email */}
                    <a
                        href={links.email}
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 font-semibold text-xs transition gap-1.5"
                    >
                        <span className="w-7 h-7 rounded-full bg-slate-600 text-white flex items-center justify-center text-xs font-bold">
                            <Mail className="w-3.5 h-3.5" />
                        </span>
                        <span>Email</span>
                    </a>
                </div>
            </div>
        );
    }

    // Compact variant (Header / Byline area)
    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            {/* Copy Link Button */}
            <button
                type="button"
                onClick={handleCopyLink}
                className="p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                title="Copy Article Link"
            >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            {/* WhatsApp */}
            <a
                href={links.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition flex items-center justify-center text-[10px] font-bold"
                title="Share on WhatsApp"
            >
                WA
            </a>

            {/* X (Twitter) */}
            <a
                href={links.x}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-900 text-white hover:bg-black transition flex items-center justify-center text-[10px] font-black"
                title="Share on 𝕏"
            >
                𝕏
            </a>

            {/* Facebook */}
            <a
                href={links.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition flex items-center justify-center text-[10px] font-bold"
                title="Share on Facebook"
            >
                fb
            </a>

            {/* Instagram */}
            <button
                type="button"
                onClick={handleInstagramShare}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white hover:opacity-90 transition flex items-center justify-center text-[10px] font-bold shadow-2xs cursor-pointer"
                title="Share to Instagram Story or Feed"
            >
                IG
            </button>

            {/* Native Mobile Share Button (if supported) */}
            <button
                type="button"
                onClick={handleNativeShare}
                className="p-2 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition"
                title="Share options..."
            >
                <Share2 className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
