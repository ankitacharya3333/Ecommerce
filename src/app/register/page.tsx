'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus, AlertCircle, Loader2 } from 'lucide-react';
import { registerSchema, RegisterInput } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function RegisterPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setServerError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setServerError(json.error || 'Registration failed.');
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
            <h1 className="text-2xl font-serif font-medium text-zinc-900 tracking-tight">
              Create an Account
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Join NOVA MARKET to access tailored order tracking, curated releases, and swift checkout.
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
              <label htmlFor="name" className="block text-xs font-semibold text-zinc-700 mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register('name')}
                placeholder="Elena Rostova"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                  errors.name ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
                } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
              />
              {errors.name && (
                <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email')}
                placeholder="elena@example.com"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                  errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
                } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
              />
              {errors.email && (
                <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-zinc-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
                placeholder="At least 8 characters, 1 uppercase, 1 number"
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
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
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
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Registering Account...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </span>
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-zinc-200 text-center text-xs text-zinc-600">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-zinc-950 underline hover:text-zinc-700">
              Sign in
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
