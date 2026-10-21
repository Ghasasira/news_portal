import React, { useState } from 'react';
import { Copy, Check, Share2, Mail } from 'lucide-react';
import { toast } from 'sonner';

// Official Authentic Social Brand SVGs
export function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
    );
}

export function XIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className}>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
    );
}

export function FacebookIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className}>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
    );
}

export function InstagramIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className}>
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
    );
}

export function LinkedInIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className}>
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.761-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
    );
}

export function TelegramIcon({ className = "w-4 h-4" }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" className={className}>
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
    );
}

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
            } catch {
                // Cancelled
            }
        } else {
            handleCopyLink();
        }
    };

    const handleInstagramShare = async () => {
        if (typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `${title}\n\nRead full story on NEWSPORTAL: ${shareUrl}`,
                    url: shareUrl,
                });
                return;
            } catch {
                // Fall back
            }
        }

        try {
            await navigator.clipboard.writeText(`${title} - Read more: ${shareUrl}`);
            toast.success('Story caption & link copied! Open Instagram to share.');
            window.open('https://www.instagram.com', '_blank');
        } catch {
            toast.error('Failed to copy Instagram caption');
        }
    };

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
                            Distribute verified journalism across your networks and communities.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleCopyLink}
                        className="self-start sm:self-auto px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                    >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
                        <span>{copied ? 'Copied to Clipboard' : 'Copy Shortlink'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 pt-4">
                    {/* WhatsApp */}
                    <a
                        href={links.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-300 font-semibold text-xs transition gap-2 shadow-2xs group"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#25D366] text-white flex items-center justify-center group-hover:scale-105 transition shadow-2xs">
                            <WhatsAppIcon className="w-4 h-4 fill-white" />
                        </div>
                        <span className="text-slate-800 group-hover:text-emerald-700">WhatsApp</span>
                    </a>

                    {/* X (formerly Twitter) */}
                    <a
                        href={links.x}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-400 font-semibold text-xs transition gap-2 shadow-2xs group"
                    >
                        <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center group-hover:scale-105 transition shadow-2xs">
                            <XIcon className="w-3.5 h-3.5 fill-white" />
                        </div>
                        <span className="text-slate-800">X (Twitter)</span>
                    </a>

                    {/* Facebook */}
                    <a
                        href={links.facebook}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-white hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 font-semibold text-xs transition gap-2 shadow-2xs group"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#1877F2] text-white flex items-center justify-center group-hover:scale-105 transition shadow-2xs">
                            <FacebookIcon className="w-4 h-4 fill-white" />
                        </div>
                        <span className="text-slate-800 group-hover:text-blue-700">Facebook</span>
                    </a>

                    {/* Instagram */}
                    <button
                        type="button"
                        onClick={handleInstagramShare}
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-white hover:bg-pink-50/50 border border-slate-200 hover:border-pink-300 font-semibold text-xs transition gap-2 shadow-2xs group cursor-pointer"
                        title="Share on Instagram Story or Feed"
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center group-hover:scale-105 transition shadow-2xs">
                            <InstagramIcon className="w-4 h-4 fill-white" />
                        </div>
                        <span className="text-slate-800 group-hover:text-pink-700">Instagram</span>
                    </button>

                    {/* LinkedIn */}
                    <a
                        href={links.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-white hover:bg-sky-50/50 border border-slate-200 hover:border-sky-300 font-semibold text-xs transition gap-2 shadow-2xs group"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#0A66C2] text-white flex items-center justify-center group-hover:scale-105 transition shadow-2xs">
                            <LinkedInIcon className="w-3.5 h-3.5 fill-white" />
                        </div>
                        <span className="text-slate-800 group-hover:text-sky-700">LinkedIn</span>
                    </a>

                    {/* Telegram */}
                    <a
                        href={links.telegram}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-white hover:bg-cyan-50/50 border border-slate-200 hover:border-cyan-300 font-semibold text-xs transition gap-2 shadow-2xs group"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#24A1DE] text-white flex items-center justify-center group-hover:scale-105 transition shadow-2xs">
                            <TelegramIcon className="w-4 h-4 fill-white" />
                        </div>
                        <span className="text-slate-800 group-hover:text-cyan-700">Telegram</span>
                    </a>

                    {/* Email */}
                    <a
                        href={links.email}
                        className="flex flex-col items-center justify-center p-3 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 hover:border-slate-300 font-semibold text-xs transition gap-2 shadow-2xs group"
                    >
                        <div className="w-8 h-8 rounded-full bg-slate-600 text-white flex items-center justify-center group-hover:scale-105 transition shadow-2xs">
                            <Mail className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-slate-800">Email</span>
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
                className="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition flex items-center justify-center shadow-2xs"
                title="Copy Article Link"
            >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
            </button>

            {/* WhatsApp */}
            <a
                href={links.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#25D366] text-white hover:opacity-90 transition flex items-center justify-center shadow-2xs"
                title="Share on WhatsApp"
            >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
            </a>

            {/* X (formerly Twitter) */}
            <a
                href={links.x}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-black text-white hover:opacity-90 transition flex items-center justify-center shadow-2xs"
                title="Share on 𝕏"
            >
                <XIcon className="w-3 h-3 fill-white" />
            </a>

            {/* Facebook */}
            <a
                href={links.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-[#1877F2] text-white hover:opacity-90 transition flex items-center justify-center shadow-2xs"
                title="Share on Facebook"
            >
                <FacebookIcon className="w-4 h-4 fill-white" />
            </a>

            {/* Instagram */}
            <button
                type="button"
                onClick={handleInstagramShare}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:opacity-90 transition flex items-center justify-center shadow-2xs cursor-pointer"
                title="Share to Instagram"
            >
                <InstagramIcon className="w-3.5 h-3.5 fill-white" />
            </button>

            {/* Native Mobile Share Button */}
            <button
                type="button"
                onClick={handleNativeShare}
                className="w-8 h-8 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition flex items-center justify-center shadow-2xs"
                title="More Share Options..."
            >
                <Share2 className="w-3.5 h-3.5" />
            </button>
        </div>
    );
}
