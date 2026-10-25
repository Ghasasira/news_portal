import { useState } from 'react';
import { Head, useForm, router, usePage } from '@inertiajs/react';
import CmsLayout from '@/layouts/cms-layout';
import AuthorAvatar from '@/components/ui/author-avatar';
import { 
    Users, 
    UserPlus, 
    Search, 
    Key, 
    CheckCircle2, 
    PenTool, 
    Trash2, 
    Edit, 
    X, 
    Check, 
    FileText, 
    Sparkles, 
    Bookmark, 
    MessageSquare, 
    Globe, 
    ShieldCheck,
    Radio,
    Upload
} from 'lucide-react';

interface AuthorProfile {
    id: number;
    slug: string;
    avatar_url?: string;
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

interface ReaderItem {
    id: number;
    name: string;
    email: string;
    google_id?: string;
    avatar_url?: string;
    email_verified_at?: string;
    created_at: string;
    saved_articles_count: number;
    comments_count: number;
    is_active: boolean;
}

interface RoleOption {
    id: string;
    name: string;
    description: string;
    badge: string;
}

interface Pagination<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: { url: string | null; label: string; active: boolean }[];
}

interface Props {
    staffUsers: Pagination<UserItem>;
    readers: Pagination<ReaderItem>;
    activeTab: 'staff' | 'readers';
    filters: {
        search: string;
        role: string;
    };
    stats: {
        totalStaff: number;
        totalReaders: number;
        googleReaders: number;
        admins: number;
        editors: number;
        authors: number;
        auditors: number;
    };
    availableRoles: RoleOption[];
}

export default function CmsUsersIndex({ 
    staffUsers, 
    readers, 
    activeTab, 
    filters, 
    stats, 
    availableRoles 
}: Props) {
    const { auth } = usePage().props as unknown as { auth?: { user?: { id: number; name: string; role: string } } };
    const currentUserId = auth?.user?.id;

    const [currentTab, setCurrentTab] = useState<'staff' | 'readers'>(activeTab || 'staff');
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || 'all');
    const [isOnboardOpen, setIsOnboardOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<UserItem | null>(null);
    const [copiedPassword, setCopiedPassword] = useState(false);

    const [onboardAvatarPreview, setOnboardAvatarPreview] = useState<string | null>(null);
    const [editAvatarPreview, setEditAvatarPreview] = useState<string | null>(null);

    // Onboarding Form
    const onboardForm = useForm<{
        name: string;
        email: string;
        role: string;
        password: string;
        password_confirmation: string;
        beat: string;
        bio: string;
        credentials: string;
        avatar: File | null;
        avatar_url: string;
    }>({
        name: '',
        email: '',
        role: 'author',
        password: '',
        password_confirmation: '',
        beat: '',
        bio: '',
        credentials: '',
        avatar: null,
        avatar_url: '',
    });

    // Edit Form
    const editForm = useForm<{
        name: string;
        email: string;
        role: string;
        password: string;
        password_confirmation: string;
        beat: string;
        bio: string;
        credentials: string;
        avatar: File | null;
        avatar_url: string;
        _method?: string;
    }>({
        name: '',
        email: '',
        role: 'author',
        password: '',
        password_confirmation: '',
        beat: '',
        bio: '',
        credentials: '',
        avatar: null,
        avatar_url: '',
    });

    const handleOnboardAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onboardForm.setData('avatar', file);
            setOnboardAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleEditAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            editForm.setData('avatar', file);
            setEditAvatarPreview(URL.createObjectURL(file));
        }
    };

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

    const handleTabSwitch = (tab: 'staff' | 'readers') => {
        setCurrentTab(tab);
        setSearchQuery('');
        router.get('/cms/users', { tab, search: '', role: 'all' }, { preserveState: true });
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/cms/users', { tab: currentTab, search: searchQuery, role: selectedRole }, { preserveState: true });
    };

    const handleRoleFilterChange = (role: string) => {
        setSelectedRole(role);
        router.get('/cms/users', { tab: currentTab, search: searchQuery, role }, { preserveState: true });
    };

    const handleOnboardSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onboardForm.post('/cms/users', {
            forceFormData: true,
            onSuccess: () => {
                setIsOnboardOpen(false);
                onboardForm.reset();
                setOnboardAvatarPreview(null);
            },
        });
    };

    const handleStartEdit = (user: UserItem) => {
        setEditingUser(user);
        setEditAvatarPreview(null);
        editForm.setData({
            name: user.name,
            email: user.email,
            role: user.role,
            password: '',
            password_confirmation: '',
            beat: user.author_profile?.beat || '',
            bio: user.author_profile?.bio || '',
            credentials: user.author_profile?.credentials || '',
            avatar: null,
            avatar_url: user.author_profile?.avatar_url || '',
        });
    };

    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingUser) return;

        editForm.transform((data) => ({
            ...data,
            _method: 'PUT',
        }));
        editForm.post(`/cms/users/${editingUser.id}`, {
            forceFormData: true,
            onSuccess: () => {
                setEditingUser(null);
                editForm.reset();
                setEditAvatarPreview(null);
            },
        });
    };

    const handleDeleteStaffUser = (user: UserItem) => {
        if (confirm(`Are you sure you want to remove staff member ${user.name} from the newsroom? This action cannot be undone.`)) {
            router.delete(`/cms/users/${user.id}`);
        }
    };

    const handleDeleteReader = (reader: ReaderItem) => {
        if (confirm(`Remove reader account ${reader.name}? This will purge bookmarks and comment associations.`)) {
            router.delete(`/cms/readers/${reader.id}`);
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
        <CmsLayout title="User & Reader Directory">
            <Head title="Staff & Readers Directory | NEWSROOM CMS" />

            {/* Top Header & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Directory & Access Controls
                    </h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Separated tables for Newsroom Editorial Staff and Public Readers / Customers.
                    </p>
                </div>

                {currentTab === 'staff' && (
                    <button
                        type="button"
                        onClick={() => setIsOnboardOpen(true)}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
                    >
                        <UserPlus className="w-4 h-4" />
                        <span>Onboard Staff Member</span>
                    </button>
                )}
            </div>

            {/* Tab Selector: Staff vs Readers */}
            <div className="flex items-center gap-2 p-1 bg-slate-200/70 rounded-xl mb-6 max-w-md">
                <button
                    type="button"
                    onClick={() => handleTabSwitch('staff')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                        currentTab === 'staff'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <ShieldCheck className="w-4 h-4 text-blue-600" />
                    <span>Newsroom Staff ({stats.totalStaff})</span>
                </button>
                <button
                    type="button"
                    onClick={() => handleTabSwitch('readers')}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                        currentTab === 'readers'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>Public Readers ({stats.totalReaders})</span>
                </button>
            </div>

            {/* KPI Stats Counters */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Staff Members</span>
                    <span className="text-xl font-black text-slate-900 mt-1 block">{stats.totalStaff}</span>
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
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">Google Connected</span>
                    <span className="text-xl font-black text-indigo-900 mt-1 block">{stats.googleReaders}</span>
                </div>
            </div>

            {/* Search & Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 space-y-3">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search ${currentTab === 'staff' ? 'staff' : 'readers'} by name or email...`}
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
                        Showing <strong className="text-slate-800">
                            {currentTab === 'staff' ? staffUsers.total : readers.total}
                        </strong> accounts
                    </div>
                </div>

                {/* Role Pill Filters (Only on Staff tab) */}
                {currentTab === 'staff' && (
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Role:</span>
                        <button
                            type="button"
                            onClick={() => handleRoleFilterChange('all')}
                            className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer ${
                                selectedRole === 'all'
                                    ? 'bg-slate-900 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                        >
                            All Staff ({stats.totalStaff})
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
                )}
            </div>

            {/* TAB 1: NEWSROOM STAFF DIRECTORY TABLE */}
            {currentTab === 'staff' && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                <tr>
                                    <th className="py-3 px-4">Staff Member</th>
                                    <th className="py-3 px-4">Role & Permissions</th>
                                    <th className="py-3 px-4">Beat / Desk</th>
                                    <th className="py-3 px-4">Published Output</th>
                                    <th className="py-3 px-4">Onboarded</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-sans">
                                {staffUsers.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400">
                                            <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                                            <p className="text-sm font-medium">No staff members found.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    staffUsers.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-slate-50/80 transition">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <AuthorAvatar
                                                        name={user.name}
                                                        avatarUrl={user.author_profile?.avatar_url}
                                                        size="md"
                                                    />
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
                                                    {user.articles_count} {user.articles_count === 1 ? 'story' : 'stories'}
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
                                                        title="Edit Staff Member"
                                                    >
                                                        <Edit className="w-3.5 h-3.5" />
                                                    </button>
                                                    {user.id !== currentUserId && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDeleteStaffUser(user)}
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
                    {staffUsers.last_page > 1 && (
                        <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                                Page {staffUsers.current_page} of {staffUsers.last_page}
                            </span>
                            <div className="flex gap-1">
                                {staffUsers.links.map((link, i) => (
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
            )}

            {/* TAB 2: PUBLIC READERS & CUSTOMERS TABLE */}
            {currentTab === 'readers' && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-600">
                            <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                <tr>
                                    <th className="py-3 px-4">Reader / Member</th>
                                    <th className="py-3 px-4">Auth Channel</th>
                                    <th className="py-3 px-4">Saved Bookmarks</th>
                                    <th className="py-3 px-4">Comments Posted</th>
                                    <th className="py-3 px-4">Member Since</th>
                                    <th className="py-3 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 font-sans">
                                {readers.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-slate-400">
                                            <Globe className="w-8 h-8 mx-auto mb-2 opacity-40 text-emerald-600" />
                                            <p className="text-sm font-medium">No public readers registered yet.</p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Readers will appear here once Google OAuth sign-in is launched.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    readers.data.map((reader) => (
                                        <tr key={reader.id} className="hover:bg-slate-50/80 transition">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    {reader.avatar_url ? (
                                                        <img
                                                            src={reader.avatar_url}
                                                            alt={reader.name}
                                                            className="w-8 h-8 rounded-full object-cover shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                                            {reader.name.slice(0, 2)}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <span className="font-bold text-slate-900 block">{reader.name}</span>
                                                        <span className="text-slate-500 text-[11px] block">{reader.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                {reader.google_id ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                                                        <svg className="w-3 h-3" viewBox="0 0 24 24">
                                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                                                        </svg>
                                                        <span>Google OAuth</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                                        <span>Direct Account</span>
                                                    </span>
                                                )}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-semibold text-slate-800 flex items-center gap-1">
                                                    <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                                                    {reader.saved_articles_count} saved
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-semibold text-slate-800 flex items-center gap-1">
                                                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                                                    {reader.comments_count} comments
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-slate-500">
                                                {new Date(reader.created_at).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-3 px-4 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteReader(reader)}
                                                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                                                    title="Remove Reader Account"
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {readers.last_page > 1 && (
                        <div className="p-3 border-t border-slate-200 flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                                Page {readers.current_page} of {readers.last_page}
                            </span>
                            <div className="flex gap-1">
                                {readers.links.map((link, i) => (
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
            )}

            {/* MODAL 1: ONBOARD NEW STAFF MEMBER */}
            {isOnboardOpen && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                                    <UserPlus className="w-4 h-4 text-blue-600" />
                                    Onboard Newsroom Staff Member
                                </h3>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Staff are registered into the users table with newsroom permissions.
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

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                                    Editorial Role *
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
                                            Staff Avatar Image (Stored on System)
                                        </label>
                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3.5">
                                            <AuthorAvatar
                                                name={onboardForm.data.name || 'Preview'}
                                                avatarUrl={onboardAvatarPreview || onboardForm.data.avatar_url}
                                                size="lg"
                                                className="ring-2 ring-white shadow-sm shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <label className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer shadow-xs">
                                                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                                                        <span>{onboardForm.data.avatar ? 'Change Image' : 'Upload Staff Photo'}</span>
                                                        <input
                                                            type="file"
                                                            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                                                            onChange={handleOnboardAvatarChange}
                                                            className="sr-only"
                                                        />
                                                    </label>
                                                    {onboardAvatarPreview && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                onboardForm.setData('avatar', null);
                                                                setOnboardAvatarPreview(null);
                                                            }}
                                                            className="text-xs text-red-600 hover:text-red-700 px-2 py-1"
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-slate-500 mt-1">
                                                    Stored locally in system storage and optimized to WebP.
                                                </p>
                                                {onboardForm.errors.avatar && (
                                                    <p className="text-red-600 text-[11px] mt-1">{onboardForm.errors.avatar}</p>
                                                )}
                                            </div>
                                        </div>
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
                                    {onboardForm.processing ? 'Onboarding...' : 'Complete Staff Onboarding'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: EDIT STAFF MEMBER */}
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
                                            Staff Avatar Image (Stored on System)
                                        </label>
                                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-3.5">
                                            <AuthorAvatar
                                                name={editForm.data.name || 'Preview'}
                                                avatarUrl={editAvatarPreview || editForm.data.avatar_url}
                                                size="lg"
                                                className="ring-2 ring-white shadow-sm shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <label className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded hover:bg-slate-50 cursor-pointer shadow-xs">
                                                        <Upload className="w-3.5 h-3.5 text-slate-500" />
                                                        <span>{editForm.data.avatar ? 'Change Image' : 'Upload New Photo'}</span>
                                                        <input
                                                            type="file"
                                                            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                                                            onChange={handleEditAvatarChange}
                                                            className="sr-only"
                                                        />
                                                    </label>
                                                    {editAvatarPreview && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                editForm.setData('avatar', null);
                                                                setEditAvatarPreview(null);
                                                            }}
                                                            className="text-xs text-red-600 hover:text-red-700 px-2 py-1"
                                                        >
                                                            Cancel
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-slate-500 mt-1">
                                                    Saved to local filesystem and converted to WebP.
                                                </p>
                                                {editForm.errors.avatar && (
                                                    <p className="text-red-600 text-[11px] mt-1">{editForm.errors.avatar}</p>
                                                )}
                                            </div>
                                        </div>
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
