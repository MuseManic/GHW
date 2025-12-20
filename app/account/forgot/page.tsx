'use client'

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordRequirements = {
    minLength: newPassword.length >= 8,
    hasUpperCase: /[A-Z]/.test(newPassword),
    hasLowerCase: /[a-z]/.test(newPassword),
    hasNumber: /[0-9]/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(newPassword),
  };

  const allRequirementsMet = Object.values(passwordRequirements).every(req => req);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (!allRequirementsMet) {
      setError('Please meet all password requirements');
      setLoading(false);
      return;
    }

    if (currentPassword === newPassword) {
      setError('New password must be different from current password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Password reset failed');
        setLoading(false);
        return;
      }

      setSuccess('Password reset successfully! Redirecting to login...');
      
      setTimeout(() => {
        router.push('/account/login');
      }, 2000);
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Reset password error:', err);
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
      style={{
        backgroundImage: "url('/images/Botaani-26.jpg')",
        backgroundSize: '500%',
        backgroundPosition: 'top right',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Reset Password</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
            {success}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Current Password
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="currentPassword">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-2.5 text-gray-600 hover:text-black transition"
                title={showCurrentPassword ? 'Hide password' : 'Show password'}
              >
                {showCurrentPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div> */}

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="newPassword">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-gray-600 hover:text-black transition"
                title={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {newPassword && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={passwordRequirements.minLength}
                      readOnly
                      className="w-4 h-4 rounded cursor-default"
                    />
                    <span className={`text-xs ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-600'}`}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={passwordRequirements.hasUpperCase}
                      readOnly
                      className="w-4 h-4 rounded cursor-default"
                    />
                    <span className={`text-xs ${passwordRequirements.hasUpperCase ? 'text-green-600' : 'text-gray-600'}`}>
                      One uppercase letter (A-Z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={passwordRequirements.hasLowerCase}
                      readOnly
                      className="w-4 h-4 rounded cursor-default"
                    />
                    <span className={`text-xs ${passwordRequirements.hasLowerCase ? 'text-green-600' : 'text-gray-600'}`}>
                      One lowercase letter (a-z)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={passwordRequirements.hasNumber}
                      readOnly
                      className="w-4 h-4 rounded cursor-default"
                    />
                    <span className={`text-xs ${passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-600'}`}>
                      One number (0-9)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={passwordRequirements.hasSpecialChar}
                      readOnly
                      className="w-4 h-4 rounded cursor-default"
                    />
                    <span className={`text-xs ${passwordRequirements.hasSpecialChar ? 'text-green-600' : 'text-gray-600'}`}>
                      One special character (!@#$%^&* etc)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-600 hover:text-black transition"
                title={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !allRequirementsMet}
            className="w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition disabled:bg-gray-400"
          >
            {loading ? 'Resetting Password...' : 'Reset Password'}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 flex items-center">
          <div className="flex-1 h-px bg-gray-300" />
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <Link href="/account/login" className="text-sm text-gray-600 hover:text-black transition font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
