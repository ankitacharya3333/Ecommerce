'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowRight, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { newsletterSchema, NewsletterInput } from '@/lib/validations';
import { Button } from '@/components/ui/Button';

export function NewsletterSection() {
  const [serverMessage, setServerMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
      consent: true,
    },
  });

  const onSubmit = async (data: NewsletterInput) => {
    setServerMessage(null);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok) {
        setServerMessage({
          type: 'error',
          text: json.error || 'Subscription failed. Please try again.',
        });
        return;
      }

      setServerMessage({
        type: 'success',
        text: json.message,
      });
      reset({ email: '', consent: true });
    } catch {
      setServerMessage({
        type: 'error',
        text: 'Network error. Please check your internet connection.',
      });
    }
  };

  return (
    <section className="bg-zinc-900 text-white py-16 sm:py-20 border-t border-zinc-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-zinc-800 text-zinc-300 mb-6 border border-zinc-700">
          <Mail className="w-5 h-5" />
        </div>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-medium tracking-tight text-white mb-3">
          Curated dispatches directly to your inbox.
        </h2>
        <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-normal leading-relaxed">
          Be first to experience limited edition collections, private seasonal sales, and thoughtful design stories from our artisans.
        </p>

        {serverMessage ? (
          <div
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-lg border text-sm max-w-md mx-auto ${
              serverMessage.type === 'success'
                ? 'bg-zinc-800/80 border-zinc-700 text-zinc-200'
                : 'bg-rose-950/40 border-rose-800 text-rose-200'
            }`}
          >
            {serverMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            )}
            <span>{serverMessage.text}</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center gap-3 max-w-md mx-auto"
            noValidate
          >
            <div className="flex flex-col sm:flex-row items-stretch gap-2 w-full">
              <div className="relative flex-1 text-left">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  {...register('email')}
                  placeholder="Enter your email address"
                  className={`w-full h-11 px-4 rounded-md bg-zinc-800 border ${
                    errors.email ? 'border-rose-500' : 'border-zinc-700'
                  } text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all`}
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                size="md"
                disabled={isSubmitting}
                className="h-11 px-6 whitespace-nowrap bg-white text-zinc-900 hover:bg-zinc-100 min-w-[100px]"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                ) : (
                  <span className="flex items-center gap-1">
                    <span>Join</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>

            {errors.email && (
              <p className="text-xs text-rose-400 text-left w-full pl-1">
                {errors.email.message}
              </p>
            )}

            {/* Consent Checkbox */}
            <div className="flex items-start gap-2 pt-1 text-left">
              <input
                id="newsletter-consent"
                type="checkbox"
                {...register('consent')}
                className="mt-0.5 rounded border-zinc-700 bg-zinc-800 text-zinc-200 focus:ring-zinc-400"
              />
              <label htmlFor="newsletter-consent" className="text-[11px] text-zinc-400 leading-tight">
                I consent to receive newsletter updates from NOVA MARKET. Unsubscribe anytime.
              </label>
            </div>
            {errors.consent && (
              <p className="text-xs text-rose-400 text-left w-full pl-1">
                {errors.consent.message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
