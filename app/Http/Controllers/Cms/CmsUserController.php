<?php

namespace App\Http\Controllers\Cms;

use App\Http\Controllers\Controller;
use App\Models\AuthorProfile;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class CmsUserController extends Controller
{
    /**
     * Display a listing of newsroom staff and registered users.
     */
    public function index(Request $request): Response
    {
        $currentUser = $request->user();

        if (! $currentUser->isAdmin()) {
            abort(403, 'Unauthorized. Only newsroom administrators can manage staff and users.');
        }

        $search = $request->input('search');
        $roleFilter = $request->input('role');

        $query = User::query()
            ->with('authorProfile')
            ->withCount('articles')
            ->latest('id');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($roleFilter && $roleFilter !== 'all') {
            $query->where('role', $roleFilter);
        }

        $users = $query->paginate(20)->withQueryString();

        $stats = [
            'total' => User::count(),
            'admins' => User::whereIn('role', ['super_admin', 'chief_editor'])->count(),
            'editors' => User::where('role', 'section_editor')->count(),
            'authors' => User::whereIn('role', ['author', 'contributor'])->count(),
            'readers' => User::whereIn('role', ['reader', 'auditor'])->count(),
        ];

        $roles = [
            [
                'id' => 'super_admin',
                'name' => 'Super Administrator',
                'description' => 'Full newsroom authority, system config, and user management.',
                'badge' => 'bg-purple-100 text-purple-800 border-purple-200',
            ],
            [
                'id' => 'chief_editor',
                'name' => 'Editor-in-Chief',
                'description' => 'Top editorial lead with publication, retraction, and staff onboarding rights.',
                'badge' => 'bg-indigo-100 text-indigo-800 border-indigo-200',
            ],
            [
                'id' => 'section_editor',
                'name' => 'Section Editor',
                'description' => 'Oversees specific beats (e.g., Tech, Politics), reviews and publishes articles.',
                'badge' => 'bg-blue-100 text-blue-800 border-blue-200',
            ],
            [
                'id' => 'author',
                'name' => 'Staff Reporter / Author',
                'description' => 'Drafts stories, uploads media, and submits drafts for editorial peer review.',
                'badge' => 'bg-emerald-100 text-emerald-800 border-emerald-200',
            ],
            [
                'id' => 'contributor',
                'name' => 'Freelance Contributor',
                'description' => 'Guest columnist or freelance writer with draft submission access.',
                'badge' => 'bg-teal-100 text-teal-800 border-teal-200',
            ],
            [
                'id' => 'auditor',
                'name' => 'Ethics & Compliance Auditor',
                'description' => 'Read-only access to editorial audit trails and corrections logs.',
                'badge' => 'bg-amber-100 text-amber-800 border-amber-200',
            ],
            [
                'id' => 'reader',
                'name' => 'Public Reader / Member',
                'description' => 'Subscriber account for bookmarks, comments, and newsletter delivery.',
                'badge' => 'bg-slate-100 text-slate-800 border-slate-200',
            ],
        ];

        return Inertia::render('cms/users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search ?? '',
                'role' => $roleFilter ?? 'all',
            ],
            'stats' => $stats,
            'availableRoles' => $roles,
        ]);
    }

    /**
     * Onboard a new newsroom staff member or user.
     */
    public function store(Request $request): RedirectResponse
    {
        $currentUser = $request->user();

        if (! $currentUser->isAdmin()) {
            abort(403, 'Unauthorized. Only newsroom administrators can onboard staff.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', 'string', 'in:super_admin,chief_editor,section_editor,author,contributor,auditor,reader'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'beat' => ['nullable', 'string', 'max:150'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'credentials' => ['nullable', 'string', 'max:255'],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'password' => Hash::make($validated['password']),
            'email_verified_at' => now(),
        ]);

        // Auto-provision author profile for editorial roles or if beat/bio provided
        $isEditorial = in_array($validated['role'], ['super_admin', 'chief_editor', 'section_editor', 'author', 'contributor']);
        if ($isEditorial || ! empty($validated['beat']) || ! empty($validated['bio'])) {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug ?: 'author-'.Str::random(6);
            $counter = 1;
            while (AuthorProfile::where('slug', $slug)->exists()) {
                $slug = "{$baseSlug}-{$counter}";
                $counter++;
            }

            AuthorProfile::create([
                'user_id' => $user->id,
                'slug' => $slug,
                'beat' => $validated['beat'] ?? ($isEditorial ? 'News Desk' : null),
                'bio' => $validated['bio'] ?? null,
                'credentials' => $validated['credentials'] ?? null,
                'is_verified' => true,
            ]);
        }

        return back()->with('success', "{$user->name} has been successfully onboarded as {$validated['role']}.");
    }

    /**
     * Update an existing user's details, role, or credentials.
     */
    public function update(Request $request, User $user): RedirectResponse
    {
        $currentUser = $request->user();

        if (! $currentUser->isAdmin()) {
            abort(403, 'Unauthorized. Only newsroom administrators can update staff.');
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'role' => ['required', 'string', 'in:super_admin,chief_editor,section_editor,author,contributor,auditor,reader'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'beat' => ['nullable', 'string', 'max:150'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'credentials' => ['nullable', 'string', 'max:255'],
        ]);

        // Prevent admin demoting themselves if they are the last super admin
        if ($currentUser->id === $user->id && $user->role === 'super_admin' && $validated['role'] !== 'super_admin') {
            if (User::where('role', 'super_admin')->count() <= 1) {
                return back()->withErrors(['role' => 'You cannot demote yourself as the only remaining Super Administrator.']);
            }
        }

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->role = $validated['role'];

        if (! empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        // Update or create author profile
        $isEditorial = in_array($validated['role'], ['super_admin', 'chief_editor', 'section_editor', 'author', 'contributor']);
        if ($isEditorial || ! empty($validated['beat']) || ! empty($validated['bio'])) {
            $authorProfile = $user->authorProfile;
            if ($authorProfile) {
                $authorProfile->update([
                    'beat' => $validated['beat'] ?? $authorProfile->beat,
                    'bio' => $validated['bio'] ?? $authorProfile->bio,
                    'credentials' => $validated['credentials'] ?? $authorProfile->credentials,
                ]);
            } else {
                $baseSlug = Str::slug($validated['name']);
                $slug = $baseSlug ?: 'author-'.Str::random(6);
                $counter = 1;
                while (AuthorProfile::where('slug', $slug)->exists()) {
                    $slug = "{$baseSlug}-{$counter}";
                    $counter++;
                }

                AuthorProfile::create([
                    'user_id' => $user->id,
                    'slug' => $slug,
                    'beat' => $validated['beat'] ?? 'News Desk',
                    'bio' => $validated['bio'] ?? null,
                    'credentials' => $validated['credentials'] ?? null,
                    'is_verified' => true,
                ]);
            }
        }

        return back()->with('success', "Updated profile for {$user->name}.");
    }

    /**
     * Remove a user from the newsroom.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        $currentUser = $request->user();

        if (! $currentUser->isAdmin()) {
            abort(403, 'Unauthorized. Only newsroom administrators can remove staff.');
        }

        // Prevent self deletion
        if ($currentUser->id === $user->id) {
            return back()->withErrors(['error' => 'You cannot delete your own active administrator account.']);
        }

        // Prevent deleting the only super admin
        if ($user->role === 'super_admin' && User::where('role', 'super_admin')->count() <= 1) {
            return back()->withErrors(['error' => 'Cannot remove the last remaining Super Administrator.']);
        }

        // Protect published journalism
        if ($user->articles()->exists()) {
            return back()->withErrors([
                'error' => "Cannot delete {$user->name} because they have authored stories ({$user->articles()->count()} articles). Reassign or archive their articles before removing this account.",
            ]);
        }

        $userName = $user->name;
        $user->authorProfile()?->delete();
        $user->delete();

        return back()->with('success', "Staff member {$userName} has been removed from the newsroom.");
    }
}
