import React, { useState } from 'react';

interface AuthorAvatarProps {
    name?: string | null;
    avatarUrl?: string | null;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

const sizeClasses = {
    xs: 'w-5 h-5 text-[9px]',
    sm: 'w-6 h-6 text-[10px]',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-24 h-24 text-2xl font-bold sm:w-28 sm:h-28',
};

const bgColors = [
    'bg-blue-600 text-white',
    'bg-indigo-600 text-white',
    'bg-emerald-600 text-white',
    'bg-violet-600 text-white',
    'bg-amber-600 text-white',
    'bg-rose-600 text-white',
    'bg-teal-600 text-white',
    'bg-slate-700 text-white',
];

function getInitials(name?: string | null): string {
    if (!name) return 'NP';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function getColorForName(name?: string | null): string {
    if (!name) return bgColors[0];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % bgColors.length;
    return bgColors[index];
}

export default function AuthorAvatar({
    name,
    avatarUrl,
    size = 'md',
    className = '',
}: AuthorAvatarProps) {
    const [imgError, setImgError] = useState(false);
    const sizeStyle = sizeClasses[size] || sizeClasses.md;
    const initials = getInitials(name);
    const colorClass = getColorForName(name);

    if (avatarUrl && !imgError) {
        return (
            <img
                src={avatarUrl}
                alt={name || 'Author'}
                onError={() => setImgError(true)}
                className={`${sizeStyle} rounded-full object-cover shrink-0 border border-slate-200/80 shadow-2xs ${className}`}
            />
        );
    }

    return (
        <div
            className={`${sizeStyle} ${colorClass} rounded-full flex items-center justify-center font-bold tracking-tight uppercase shrink-0 border border-white/20 shadow-2xs select-none ${className}`}
            title={name || 'Author'}
        >
            {initials}
        </div>
    );
}
