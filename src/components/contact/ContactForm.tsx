'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-zinc-200 shadow-xs">
      <h2 className="text-xl font-medium text-zinc-900 mb-6">
        Send a Message
      </h2>

      {submitted ? (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-900 leading-relaxed">
          <strong className="font-semibold block mb-1">Message Transmitted (Demo)</strong>
          Thank you for reaching out! In Day 1 this form operates in demonstration mode. Backend email delivery will be connected in an upcoming session.
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="text-xs font-semibold text-emerald-800 underline hover:text-emerald-950"
            >
              Send another message
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="first-name" className="block text-xs font-semibold text-zinc-700 mb-1">
                First Name
              </label>
              <input
                id="first-name"
                type="text"
                required
                placeholder="Jane"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent"
              />
            </div>
            <div>
              <label htmlFor="last-name" className="block text-xs font-semibold text-zinc-700 mb-1">
                Last Name
              </label>
              <input
                id="last-name"
                type="text"
                required
                placeholder="Doe"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-xs font-semibold text-zinc-700 mb-1">
              Email Address
            </label>
            <input
              id="contact-email"
              type="email"
              required
              placeholder="jane.doe@example.com"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs font-semibold text-zinc-700 mb-1">
              Subject
            </label>
            <select
              id="subject"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent bg-white"
            >
              <option>Order status & inquiry</option>
              <option>Product specifications & materials</option>
              <option>Trade & commercial partnerships</option>
              <option>Press & media</option>
            </select>
          </div>

          <div>
            <label htmlFor="message" className="block text-xs font-semibold text-zinc-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              required
              placeholder="Describe your inquiry..."
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent resize-y"
            />
          </div>

          <Button type="submit" variant="primary" size="md" className="w-full sm:w-auto">
            Transmit Message
          </Button>
        </form>
      )}
    </div>
  );
}
