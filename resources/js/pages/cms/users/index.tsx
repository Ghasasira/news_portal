import { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import CmsLayout from '@/layouts/cms-layout';
import { 
    Users, 
    UserPlus, 
    Search, 
    Shield, 
    Key, 
    CheckCircle2, 
    PenTool, 
    Trash2, 
    Edit, 
    X, 
    Copy, 
    Check, 
    FileText, 
    Sparkles, 
    AlertCircle 
} from 'lucide-react';

interface AuthorProfile {
    id: number;
    slug: string;
    bio?: string;
    beat?: string;
    credentials?: string;
    is_verified: boolean;
}

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: string;
    email_verified_at?: string;
    created_at: string;
    articles_count: number;
    author_profile?: AuthorProfile;
}

interface RoleOption {
    id: string;
    name: string;
    description: string;
    badge: string;
}

interface Props {
    users: {
        data: UserItem[];
        current_page: number;
        last_page: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        search: string;
        role: string;
    };
    stats: {
        total: number;
        admins: number;
        editors: number;
        authors: number;
        readers: number;
    };
    availableRoles: RoleOption[];
}

export default function CmsUsersIndex({ users, filters, stats, availableRoles }: Props) {
    const { auth } = usePage().props as unknown as { auth?: { user?: { id: number; name: string; role: string } } };
    const currentUserId = auth?.user?.id;

    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || 'all');
    const [isOnboardOpen, setIsOnboardOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [copiedPassword, setCopiedPassword] = useState(false);

    // Onboarding Form
    const onboardForm = useForm({
        name: '',
        email: '',
        role: 'author',
        password: '',
        password_confirmation: '',
        beat: '',
        bio: '',
        credentials: '',
    });

    // Edit Form
    const editForm = useForm({
        name: '',
        email: '',
        role: 'author',
        password: '',
        password_confirmation: '',
        beat: '',
        bio: '',
        credentials: '',
    });

    const generateRandomPassword = (targetForm: 'onboard' | 'edit') => {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+';
        let generated = '';
        for (let i = 0; i < 14; i++) {
            generated += charset.charAt(Math.floor(Math.random() * charset.length));
        }

        if (targetForm === 'onboard') {
            onboardForm.setData((prev) => ({
                ...prev,
                password: generated,
                password_confirmation: generated,
            }));
        } else {
            editForm.setData((prev) => ({
                ...prev,
                password: generated,
                password_confirmation: generated,
            }));
        }

        navigator.clipboard?.writeText(generated);
        setCopiedPassword(true);
        setTimeout(() => setCopiedPassword(false), 3000);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/cms/users', { search: searchQuery, role: selectedRole }, { preserveState: true });
    };

    const handleRoleFilterChange = (role: string) => {
        setSelectedRole(role);
        router.get('/cms/users', { search: searchQuery, role }, { preserveState: true });
    };

    const handleOnboardSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onboardForm.post('/cms/users', {
            onSuccess: () => {
                setIsOnboardOpen(false);
                onboardForm.reset();
            },
        });
    };

    const handleStartEdit = (user: UserItem) => {
        setEditingUser(user);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
            password_confirmation: '',
            beat: user.author_profile?.beat || '',
            bio: user.author_profile?.bio || '',
            credentials: user.author_profile?.credentials || '',
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        editForm.put(`/cms/users/${editingUser.id}`, {
            onSuccess: () => {
                setEditingUser(null);
                editForm.reset();
            },
        });
    };

    const handleDeleteUser = (user: UserItem) => {
        if (confirm(`Are you sure you want to remove ${user.name} from the newsroom? This action cannot be undone.`)) {
            router.delete(`/cms/users/${user.id}`);
        }
    };

    const getRoleBadge = (roleId: string) => {
        const found = availableRoles.find((r) => r.id === roleId);
        return found ? found.badge : 'bg-slate-100 text-slate-800 border-slate-200';
    };

    const getRoleLabel = (roleId: string) => {
        const found = availableRoles.find((r) => r.id === roleId);
        return found ? found.name : roleId.replace('_', ' ');
    };

    const isEditorialRole = (role: string) => {
        return ['super_admin', 'chief_editor', 'section_editor', 'author', 'contributor'].includes(role);
    };

    return (
        <CmsLayout title="Newsroom Staff Directory & Onboarding">
            <Head title="Staff Directory & Onboarding | NEWSROOM CMS" />

            {/* Top Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Newsroom Staff & User Directory
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Centralized staff onboarding, beat assignments, and editorial role access controls.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsOnboardOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
                >
                    <UserPlus className="w-4 h-4" />
                    <span>Onboard New User / Staff</span>
                </button>
            </div>

            {/* KPI Stats Counters */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Total Accounts</span>
                    <span className="text-xl font-black text-slate-900 mt-1 block">{stats.total}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block">Admins & Chiefs</span>
                    <span className="text-xl font-black text-purple-900 mt-1 block">{stats.admins}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">Section Editors</span>
                    <span className="text-xl font-black text-blue-900 mt-1 block">{stats.editors}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">Reporters / Authors</span>
                    <span className="text-xl font-black text-emerald-900 mt-1 block">{stats.authors}</span>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Public Readers</span>
                    <span className="text-xl font-black text-slate-700 mt-1 block">{stats.readers}</span>
                </div>
            </div>

            {/* Search & Role Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or email address..."
                            className="w-full pl-9 pr-20 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-blue-600 hover:text-blue-500 px-2 py-0.5"
                        >
                            Search
                        </button>
                    </form>

                    <div className="text-xs text-slate-500">
                        Showing <strong className="text-slate-800">{users.total}</strong> registered members
                    </div>
                </div>

                {/* Role Pill Filters */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
                    <button
                        type="button"
                        onClick={() => handleRoleFilterChange('all')}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                            selectedRole === 'all'
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        All ({stats.total})
                    </button>
                    {availableRoles.map((role) => (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => handleRoleFilterChange(role.id)}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                                selectedRole === role.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            {role.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Users Directory Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs text-slate-600">
                        <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                            <tr>
                                <th className="py-3 px-4">Staff Member / User</th>
                                <th className="py-3 px-4">Role & Permissions</th>
                                <th className="py-3 px-4">Beat / Desk</th>
                                <th className="py-3 px-4">Reporting Output</th>
                                <th className="py-3 px-4">Onboarded</th>
                                <th className="py-3 px-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-sans">
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-400">
                                        <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                        <p className="text-sm font-medium">No staff members found matching criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50/80 transition">
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                    {user.name.slice(0, 2)}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-1.5 font-bold text-slate-900">
                                                        <span>{user.name}</span>
                                                        {user.email_verified_at && (
                                                            <span title="Verified">
                                                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                                                            </span>
                                                        )}
                                                        {user.id === currentUserId && (
                                                            <span className="text-[10px] bg-slate-100 text-slate-600 px-1 rounded font-normal">You</span>
                                                        )}
                                                    </div>
                                                    <span className="text-slate-500 text-[11px] block">{user.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${getRoleBadge(user.role)}`}>
                                                {getRoleLabel(user.role)}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            {user.author_profile?.beat ? (
                                                <span className="font-medium text-slate-800">
                                                    {user.author_profile.beat}
                                                </span>
                                            ) : (
                                                <span className="text-slate-400 italic">None</span>
                                            )}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="font-semibold text-slate-800 flex items-center gap-1">
                                                <FileText className="w-3.5 h-3.5 text-slate-400" />
                                                {user.articles_count} {user.articles_count === 1 ? 'article' : 'articles'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-slate-500">
                                            {new Date(user.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex items-center justify-end gap-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => handleStartEdit(user)}
                                                    className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition cursor-pointer"
                                                    title="Edit User & Permissions"
                                                >
                                                    <Edit className="w-3.5 h-3.5" />
                                                </button>
                                                {user.id !== currentUserId && (
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteUser(user)}
                                                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                                                        title="Remove from Newsroom"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                    <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-slate-500">
                            Page {users.current_page} of {users.last_page}
                        </span>
                        <div className="flex gap-1">
                            {users.links.map((link, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => link.url && router.visit(link.url)}
                                    disabled={!link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                    className={`px-2.5 py-1 rounded text-xs transition cursor-pointer ${
                                        link.active
                                            ? 'bg-blue-600 text-white font-bold'
                                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL 1: ONBOARD NEW USER / STAFF */}
            {isOnboardOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <UserPlus className="w-4 h-4 text-blue-600" />
                                    Onboard Newsroom Staff or User
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Admins explicitly onboard users since self-registration is closed.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsOnboardOpen(false)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleOnboardSubmit} className="p-5 space-y-4">
                            {/* Full Name */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={onboardForm.data.name}
                                    onChange={(e) => onboardForm.setData('name', e.target.value)}
                                    placeholder="e.g. Elena Rostova"
                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {onboardForm.errors.name && (
                                    <p className="text-xs text-rose-600 mt-1">{onboardForm.errors.name}</p>
                                )}
                            </div>

                            {/* Email Address */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={onboardForm.data.email}
                                    onChange={(e) => onboardForm.setData('email', e.target.value)}
                                    placeholder="e.g. elena.rostova@newsportal.local"
                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {onboardForm.errors.email && (
                                    <p className="text-xs text-rose-600 mt-1">{onboardForm.errors.email}</p>
                                )}
                            </div>

                            {/* Role Selection */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Select Role & Permissions *
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {availableRoles.map((role) => (
                                        <label
                                            key={role.id}
                                            className={`p-2.5 rounded-lg border text-left cursor-pointer transition block ${
                                                onboardForm.data.role === role.id
                                                    ? 'border-blue-600 bg-blue-50/50'
                                                    : 'border-slate-200 hover:bg-slate-50'
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name="onboard_role"
                                                value={role.id}
                                                checked={onboardForm.data.role === role.id}
                                                onChange={(e) => onboardForm.setData('role', e.target.value)}
                                                className="sr-only"
                                            />
                                            <div className="flex items-center justify-between">
                                                <span className="font-bold text-xs text-slate-900">{role.name}</span>
                                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold border ${role.badge}`}>
                                                    {role.id}
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                                                {role.description}
                                            </p>
                                        </label>
                                    ))}
                                </div>
                                {onboardForm.errors.role && (
                                    <p className="text-xs text-rose-600 mt-1">{onboardForm.errors.role}</p>
                                )}
                            </div>

                            {/* Password Setup & Quick Random Generator */}
                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                                        <Key className="w-3.5 h-3.5 text-blue-600" /> Initial Password *
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => generateRandomPassword('onboard')}
                                        className="text-[11px] text-blue-600 hover:text-blue-500 font-semibold flex items-center gap-1 cursor-pointer"
                                    >
                                        {copiedPassword ? (
                                            <>
                                                <Check className="w-3 h-3 text-emerald-600" />
                                                <span className="text-emerald-600">Copied to Clipboard!</span>
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-3 h-3 text-blue-600" />
                                                <span>Generate Secure Password</span>
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <input
                                            type="text"
                                            required
                                            value={onboardForm.data.password}
                                            onChange={(e) => onboardForm.setData('password', e.target.value)}
                                            placeholder="Min. 8 characters"
                                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                                        />
                                        {onboardForm.errors.password && (
                                            <p className="text-xs text-rose-600 mt-1">{onboardForm.errors.password}</p>
                                        )}
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            required
                                            value={onboardForm.data.password_confirmation}
                                            onChange={(e) => onboardForm.setData('password_confirmation', e.target.value)}
                                            placeholder="Confirm password"
                                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Contextual Author Profile Fields (Shown for editorial roles) */}
                            {isEditorialRole(onboardForm.data.role) && (
                                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                                        <PenTool className="w-3.5 h-3.5 text-emerald-700" />
                                        Author Profile & Byline Details
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                            Beat / Coverage Desk
                                        </label>
                                        <input
                                            type="text"
                                            value={onboardForm.data.beat}
                                            onChange={(e) => onboardForm.setData('beat', e.target.value)}
                                            placeholder="e.g. AI & Frontier Technologies, Geopolitics"
                                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                            Journalistic Credentials / Title
                                        </label>
                                        <input
                                            type="text"
                                            value={onboardForm.data.credentials}
                                            onChange={(e) => onboardForm.setData('credentials', e.target.value)}
                                            placeholder="e.g. Senior Tech Correspondent, Former FT"
                                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                            Short Bio
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={onboardForm.data.bio}
                                            onChange={(e) => onboardForm.setData('bio', e.target.value)}
                                            placeholder="Brief background for public author page..."
                                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Submit & Cancel Buttons */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setIsOnboardOpen(false)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={onboardForm.processing}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition shadow-xs cursor-pointer disabled:opacity-50"
                                >
                                    {onboardForm.processing ? 'Onboarding...' : 'Complete Onboarding'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: EDIT USER & CREDENTIALS */}
            {editingUser && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <Edit className="w-4 h-4 text-blue-600" />
                                    Edit Staff Member: {editingUser.name}
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Update roles, password, or author credentials.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setEditingUser(null)}
                                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={editForm.data.name}
                                    onChange={(e) => editForm.setData('name', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {editForm.errors.name && (
                                    <p className="text-xs text-rose-600 mt-1">{editForm.errors.name}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">
                                    Email Address *
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={editForm.data.email}
                                    onChange={(e) => editForm.setData('email', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                                {editForm.errors.email && (
                                    <p className="text-xs text-rose-600 mt-1">{editForm.errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Role & Permissions *
                                </label>
                                <select
                                    value={editForm.data.role}
                                    onChange={(e) => editForm.setData('role', e.target.value)}
                                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                                >
                                    {availableRoles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name} ({role.id})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Password Reset (Optional) */}
                            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                                        <Key className="w-3.5 h-3.5 text-blue-600" /> Reset Password (Optional)
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => generateRandomPassword('edit')}
                                        className="text-[11px] text-blue-600 hover:text-blue-500 font-semibold flex items-center gap-1 cursor-pointer"
                                    >
                                        <Sparkles className="w-3 h-3 text-blue-600" />
                                        <span>Generate Random</span>
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <input
                                        type="text"
                                        value={editForm.data.password}
                                        onChange={(e) => editForm.setData('password', e.target.value)}
                                        placeholder="Leave blank to keep current"
                                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                                    />
                                    <input
                                        type="text"
                                        value={editForm.data.password_confirmation}
                                        onChange={(e) => editForm.setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm new password"
                                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                                    />
                                </div>
                            </div>

                            {/* Editorial Details */}
                            {isEditorialRole(editForm.data.role) && (
                                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
                                    <div className="text-xs font-bold text-emerald-900">
                                        Author Profile Settings
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                            Beat / Coverage Desk
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.data.beat}
                                            onChange={(e) => editForm.setData('beat', e.target.value)}
                                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                            Credentials
                                        </label>
                                        <input
                                            type="text"
                                            value={editForm.data.credentials}
                                            onChange={(e) => editForm.setData('credentials', e.target.value)}
                                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                                            Biography
                                        </label>
                                        <textarea
                                            rows={2}
                                            value={editForm.data.bio}
                                            onChange={(e) => editForm.setData('bio', e.target.value)}
                                            className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={editForm.processing}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition shadow-xs cursor-pointer disabled:opacity-50"
                                >
                                    {editForm.processing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </CmsLayout>
    );
}
