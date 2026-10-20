'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  User,
  Shield,
  Clock,
  Package,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  MapPin,
} from 'lucide-react';
import { updateProfileSchema, UpdateProfileInput } from '@/lib/validations';
import { Button } from '@/components/ui/Button';

interface AccountClientProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
    inquiries: Array<{
      id: string;
      subject: string;
      category: string;
      createdAt: string;
      adminNotified: string;
    }>;
  };
}

export function AccountClient({ user }: AccountClientProps) {
  const router = useRouter();
  const [profileMsg, setProfileMsg] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name || '',
      currentPassword: '',
      newPassword: '',
    },
  });

  const onUpdateProfile = async (data: UpdateProfileInput) => {
    setProfileMsg(null);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setProfileMsg({
          type: 'error',
          text: json.error || 'Failed to update profile.',
        });
        return;
      }

      setProfileMsg({
        type: 'success',
        text: 'Your profile has been successfully updated.',
      });
      reset({
        name: json.user?.name || data.name,
        currentPassword: '',
        newPassword: '',
      });
      router.refresh();
    } catch {
      setProfileMsg({
        type: 'error',
        text: 'Network error communicating with profile service.',
      });
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Top Profile Summary Card */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-zinc-900 text-white flex items-center justify-center font-serif text-2xl font-bold flex-shrink-0">
            {user.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-serif font-medium text-zinc-900">
                {user.name || 'Valued Client'}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-800 uppercase tracking-wider">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
            <p className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>Member since {new Date(user.createdAt).toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="text-zinc-700 hover:text-rose-600 hover:border-rose-300"
        >
          {isLoggingOut ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
          ) : (
            <LogOut className="w-3.5 h-3.5 mr-1.5" />
          )}
          <span>Sign Out</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Settings Form */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs space-y-6">
          <div className="border-b border-zinc-200 pb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium text-zinc-900">
                Account Details & Security
              </h2>
              <p className="text-xs text-zinc-500 mt-0.5">
                Update your identity details or change your password.
              </p>
            </div>
            <Shield className="w-5 h-5 text-zinc-400" />
          </div>

          {profileMsg && (
            <div
              className={`p-3.5 rounded-lg border text-xs flex items-start gap-2 ${
                profileMsg.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {profileMsg.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <span>{profileMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onUpdateProfile)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="name" className="block text-xs font-semibold text-zinc-700 mb-1">
                Display Name
              </label>
              <input
                id="name"
                type="text"
                {...register('name')}
                className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                  errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
                } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
              />
              {errors.name && (
                <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-700 mb-1">
                Account Email
              </label>
              <input
                type="text"
                disabled
                value={user.email}
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-200 bg-zinc-100 text-zinc-500 cursor-not-allowed"
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                Email addresses are immutable for verified security records.
              </p>
            </div>

            <div className="pt-4 border-t border-zinc-200">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-800 mb-3">
                Update Password (Optional)
              </h3>

              <div className="space-y-3">
                <div>
                  <label htmlFor="currentPassword" className="block text-xs font-semibold text-zinc-700 mb-1">
                    Current Password
                  </label>
                  <input
                    id="currentPassword"
                    type="password"
                    {...register('currentPassword')}
                    placeholder="Required only if changing password"
                    className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-950"
                  />
                  {errors.currentPassword && (
                    <p className="text-xs text-rose-600 mt-1">{errors.currentPassword.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-xs font-semibold text-zinc-700 mb-1">
                    New Password
                  </label>
                  <input
                    id="newPassword"
                    type="password"
                    {...register('newPassword')}
                    placeholder="Leave blank to keep existing password"
                    className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                      errors.newPassword ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
                    } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
                  />
                  {errors.newPassword && (
                    <p className="text-xs text-rose-600 mt-1">{errors.newPassword.message}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="md" disabled={isSubmitting}>
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Changes...</span>
                  </span>
                ) : (
                  <span>Save Profile Updates</span>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Right Column: Inquiries & Activity */}
        <div className="space-y-6">
          {/* Order history and management */}
          <div className="bg-zinc-50 p-6 rounded-2xl border border-zinc-200 text-xs text-zinc-600 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-900 font-semibold text-sm">
                <Package className="w-4 h-4 text-zinc-700" />
                <span>Orders & Purchases</span>
              </div>
              <a
                href="/account/orders"
                className="text-xs text-zinc-950 font-semibold underline hover:text-zinc-700"
              >
                View Orders →
              </a>
            </div>
            <p className="leading-relaxed">
              Track your deliveries, review past purchase invoices, and check item fulfillment statuses.
            </p>
          </div>

          {/* Admin Quick Access Panel if user has ADMIN role */}
          {user.role === 'ADMIN' && (
            <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-sm">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  <span>Admin Operations Console</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 uppercase">
                  Staff Access
                </span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                You are signed in with administrator privileges. Manage orders, inventory, catalog, and store analytics.
              </p>
              <a
                href="/admin"
                className="inline-flex items-center justify-center w-full px-4 py-2 text-xs font-semibold rounded-lg bg-white text-zinc-950 hover:bg-zinc-100 transition-colors"
              >
                Open Admin Dashboard
              </a>
            </div>
          )}

          {/* Recent Inquiries List */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-700" />
              <span>Recent Client Dispatches</span>
            </h3>

            {user.inquiries.length === 0 ? (
              <p className="text-xs text-zinc-400">
                No inquiries recorded yet. Reach out via the Contact page anytime.
              </p>
            ) : (
              <div className="divide-y divide-zinc-100 text-xs">
                {user.inquiries.map((inq) => (
                  <div key={inq.id} className="py-2.5">
                    <div className="flex items-center justify-between font-medium text-zinc-900">
                      <span className="truncate max-w-[180px]">{inq.subject}</span>
                      <span className="text-[10px] text-zinc-400">
                        {new Date(inq.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-500">
                      <span>{inq.category}</span>
                      <span>•</span>
                      <span
                        className={`font-semibold ${
                          inq.adminNotified === 'SENT'
                            ? 'text-emerald-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {inq.adminNotified === 'SENT' ? 'Dispatched' : 'Queued'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
