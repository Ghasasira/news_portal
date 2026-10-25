import React from 'react';
import { router } from '@inertiajs/react';
import AuthorAvatar from '@/components/ui/author-avatar';
import { User, AuthorProfile } from '@/types/news';

interface AuthorLinkProps {
    user?: User | null;
    authorProfile?: AuthorProfile | null;
    showAvatar?: boolean;
    avatarSize?: 'xs' | 'sm' | 'md';
    className?: string;
    textClassName?: string;
}

export default function AuthorLink({
    user,
    authorProfile,
    showAvatar = false,
    avatarSize = 'xs',
    className = '',
    textClassName = '',
}: AuthorLinkProps) {
    const profile = authorProfile || user?.author_profile;
    const authorName = user?.name || 'Newsroom Journalist';
    const authorSlug = profile?.slug || (user?.name ? user.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'staff');
    const avatarUrl = profile?.avatar_url;

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        router.visit(`/author/${authorSlug}`);
    };

    return (
        <span
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    handleClick(e as any);
                }
            }}
            title={`View profile and stories by ${authorName}`}
            className={`inline-flex items-center gap-1.5 cursor-pointer hover:text-blue-600 transition group/author select-none ${className}`}
        >
            {showAvatar && (
                <AuthorAvatar
                    name={authorName}
                    avatarUrl={avatarUrl}
                    size={avatarSize}
                    className="group-hover/author:ring-1 group-hover/author:ring-blue-600 transition"
                />
            )}
            <span className={`font-semibold group-hover/author:underline ${textClassName}`}>
                {authorName}
            </span>
        </span>
    );
}
