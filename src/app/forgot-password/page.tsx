'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyRound, CheckCircle2, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { forgotPasswordSchema, ForgotPasswordInput } from '@/lib/validations';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function ForgotPasswordPage() {
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    message: string;
    devResetLink?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setStatus(null);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setStatus({
          type: 'error',
          message: json.error || 'Failed to request reset instructions.',
        });
        return;
      }

      setStatus({
        type: 'success',
        message: json.message,
        devResetLink: json.devResetLink,
      });
    } catch {
      setStatus({
        type: 'error',
        message: 'Network error connecting to reset service.',
      });
    }
  };

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-md">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mx-auto mb-3 text-zinc-800">
              <KeyRound className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-serif font-medium text-zinc-900 tracking-tight">
              Password Recovery
            </h1>
            <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
              Enter the email address registered with your account to receive password reset instructions.
            </p>
          </div>

          {status && (
            <div
              className={`p-4 rounded-lg border text-xs leading-relaxed space-y-2 ${
                status.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-2">
                {status.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                )}
                <span>{status.message}</span>
              </div>

              {status.devResetLink && (
                <div className="pt-2 border-t border-emerald-200 text-[11px]">
                  <strong className="block font-semibold mb-0.5">Development Testing Token:</strong>
                  <Link
                    href={status.devResetLink}
                    className="text-emerald-800 underline break-all font-mono hover:text-emerald-950"
                  >
                    Click here to open Reset Password page with generated token
                  </Link>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 mb-1">
                Account Email
              </label>
              <input
                id="email"
                type="email"
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
                  <span>Processing...</span>
                </span>
              ) : (
                <span>Send Reset Link</span>
              )}
            </Button>
          </form>

          <div className="pt-4 border-t border-zinc-200 text-center text-xs">
            <Link
              href="/login"
              className="inline-flex items-center gap-1 text-zinc-600 hover:text-zinc-950 font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
