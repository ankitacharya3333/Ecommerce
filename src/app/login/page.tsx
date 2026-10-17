'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { loginSchema, LoginInput } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginInput) => {
    setServerError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || 'Authentication failed. Please verify credentials.');
        return;
      }

      router.push('/account');
      router.refresh();
    } catch {
      setServerError('Network error communicating with authentication service.');
    }
  };

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-md">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-xl bg-zinc-950 text-white flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              N
            </div>
            <h1 className="text-2xl font-serif font-medium text-zinc-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Sign in to manage your orders, saved addresses, and personal profile.
            </p>
          </div>

          {serverError && (
            <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="client@novamarket.design"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                  errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
                } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
              />
              {errors.email && (
                <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="text-xs font-semibold text-zinc-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-zinc-500 hover:text-zinc-900 underline"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register('password')}
                placeholder="••••••••"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                  errors.password ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
                } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
              />
              {errors.password && (
                <p className="text-xs text-rose-600 mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </span>
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-zinc-200 text-center text-xs text-zinc-600">
            Don't have an account yet?{' '}
            <Link href="/register" className="font-semibold text-zinc-950 underline hover:text-zinc-700">
              Create an account
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
