'use client';

import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
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

        {submitted ? (
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-zinc-800/80 border border-zinc-700 text-zinc-200 text-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Thank you for subscribing. Welcome to the NOVA community.</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-md mx-auto"
          >
            <div className="relative flex-1">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full h-11 px-4 rounded-md bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:border-transparent transition-all"
              />
            </div>
            <Button
              type="submit"
              variant="secondary"
              size="md"
              className="h-11 px-6 whitespace-nowrap bg-white text-zinc-900 hover:bg-zinc-100"
            >
              <span>Join</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </form>
        )}

        <p className="text-zinc-500 text-xs mt-4">
          By signing up, you agree to our Privacy Policy. No spam, unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
