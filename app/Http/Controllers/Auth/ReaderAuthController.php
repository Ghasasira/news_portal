<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Reader;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;
use Laravel\Socialite\Facades\Socialite;

class ReaderAuthController extends Controller
{
    /**
     * Show the dedicated Reader Login & Account Creation portal.
     */
    public function showLogin(Request $request): Response|RedirectResponse
    {
        if (Auth::guard('reader')->check()) {
            return redirect()->intended(route('saved.articles'));
        }

        if (Auth::guard('web')->check()) {
            return redirect()->intended('/cms');
        }

        return Inertia::render('auth/reader-login', [
            'status' => session('status'),
            'hasGoogleConfigured' => ! empty(config('services.google.client_id')),
        ]);
    }

    /**
     * Authenticate or onboard a reader using email.
     */
    public function login(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'email' => ['required', 'string', 'email', 'max:255'],
            'name' => ['nullable', 'string', 'max:255'],
            'password' => ['nullable', 'string', 'min:6'],
        ]);

        $reader = Reader::where('email', $validated['email'])->first();

        if ($reader) {
            // Existing reader: verify password if reader set one
            if ($reader->password && ! empty($validated['password'])) {
                if (! Hash::check($validated['password'], $reader->password)) {
                    return back()->withErrors(['password' => 'The provided password does not match our records.']);
                }
            }

            Auth::guard('reader')->login($reader, remember: true);
        } else {
            // New reader: automatically provision their free reader account
            $defaultName = $validated['name'] 
                ?: ucwords(str_replace(['.', '_', '-'], ' ', explode('@', $validated['email'])[0]));

            $reader = Reader::create([
                'name' => $defaultName,
                'email' => $validated['email'],
                'password' => ! empty($validated['password']) ? Hash::make($validated['password']) : null,
                'email_verified_at' => now(),
                'is_active' => true,
            ]);

            Auth::guard('reader')->login($reader, remember: true);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('saved.articles'))
            ->with('success', "Welcome, {$reader->name}! You can now sync bookmarks and customize dispatches.");
    }

    /**
     * Sign the reader out.
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('reader')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with('success', 'You have been signed out of your reader account.');
    }

    /**
     * Redirect to Google OAuth or fallback in development.
     */
    public function googleRedirect()
    {
        if (config('services.google.client_id')) {
            return Socialite::driver('google')->redirect();
        }

        // Demo / Development fallback: instant reader authentication
        $reader = Reader::firstOrCreate(
            ['email' => 'reader.demo@gmail.com'],
            [
                'name' => 'Google Reader Demo',
                'google_id' => 'google_demo_id_98765',
                'avatar_url' => 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                'email_verified_at' => now(),
                'is_active' => true,
            ]
        );

        Auth::guard('reader')->login($reader, remember: true);
        request()->session()->regenerate();

        return redirect()->intended(route('saved.articles'))
            ->with('success', 'Signed in with Google Account (Demo Mode).');
    }

    /**
     * Handle the callback from Google OAuth.
     */
    public function googleCallback(Request $request): RedirectResponse
    {
        if (! config('services.google.client_id')) {
            return redirect()->route('reader.login');
        }

        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            return redirect()->route('reader.login')->withErrors([
                'email' => 'Unable to authenticate with Google. Please try again.',
            ]);
        }

        $reader = Reader::where('google_id', $googleUser->getId())
            ->orWhere('email', $googleUser->getEmail())
            ->first();

        if ($reader) {
            $reader->update([
                'google_id' => $reader->google_id ?? $googleUser->getId(),
                'avatar_url' => $reader->avatar_url ?? $googleUser->getAvatar(),
                'email_verified_at' => $reader->email_verified_at ?? now(),
            ]);
        } else {
            $reader = Reader::create([
                'name' => $googleUser->getName() ?? $googleUser->getNickname() ?? 'Reader',
                'email' => $googleUser->getEmail(),
                'google_id' => $googleUser->getId(),
                'avatar_url' => $googleUser->getAvatar(),
                'email_verified_at' => now(),
                'is_active' => true,
            ]);
        }

        Auth::guard('reader')->login($reader, remember: true);
        $request->session()->regenerate();

        return redirect()->intended(route('saved.articles'))
            ->with('success', "Welcome, {$reader->name}! Signed in with Google.");
    }
}
