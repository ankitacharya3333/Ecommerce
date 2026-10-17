'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { resetPasswordSchema, ResetPasswordInput } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [serverMessage, setServerMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setServerMessage(null);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setServerMessage({
          type: 'error',
          text: json.error || 'Failed to reset password.',
        });
        return;
      }

      setServerMessage({
        type: 'success',
        text: json.message,
      });

      setTimeout(() => {
        router.push('/login');
      }, 2500);
    } catch {
      setServerMessage({
        type: 'error',
        text: 'Network error connecting to reset service.',
      });
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3 text-zinc-800">
          <Lock className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-serif font-medium text-zinc-900 tracking-tight">
          Reset Your Password
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Choose a new, secure password for your NOVA MARKET account.
        </p>
      </div>

      {!token && (
        <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
          No reset token was found in the URL. Please verify your link or request a new reset email.
        </div>
      )}

      {serverMessage && (
        <div
          className={`p-3.5 rounded-lg border text-xs flex items-start gap-2 ${
            serverMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {serverMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
          )}
          <span>{serverMessage.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <input type="hidden" {...register('token')} value={token} />

        <div>
          <label htmlFor="password" className="block text-xs font-semibold text-zinc-700 mb-1">
            New Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            placeholder="At least 8 chars, 1 uppercase, 1 number"
            className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
              errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
            } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
          />
          {errors.password && (
            <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-semibold text-zinc-700 mb-1">
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            {...register('confirmPassword')}
            placeholder="••••••••"
            className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
              errors.confirmPassword ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
            } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-rose-600 mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={isSubmitting || !token}
          className="w-full"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Updating Password...</span>
            </span>
          ) : (
            <span>Update Password</span>
          )}
        </Button>
      </form>

      <div className="pt-4 border-t border-zinc-200 text-center text-xs text-zinc-600">
        Remember your credentials?{' '}
        <Link href="/login" className="font-semibold text-zinc-950 underline hover:text-zinc-700">
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-md">
        <Suspense fallback={<div className="text-center text-xs text-zinc-500">Loading form...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </Container>
    </div>
  );
}
