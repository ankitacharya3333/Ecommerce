'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  MessageSquare,
  Send,
  AlertCircle,
  CheckCircle2,
  Info,
  Loader2,
} from 'lucide-react';
import { contactInquirySchema, ContactInquiryInput } from '@/lib/validations';
import { Button } from '@/components/ui/Button';

export function ContactForm() {
  const [serverStatus, setServerStatus] = useState<{
    type: 'success' | 'error';
    message: string;
    emailNotice?: string;
    inquiryId?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactInquiryInput>({
    resolver: zodResolver(contactInquirySchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      category: 'GENERAL_SUPPORT',
      orderNumber: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactInquiryInput) => {
    setServerStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        setServerStatus({
          type: 'error',
          message: json.error || 'Failed to submit inquiry. Please try again.',
        });
        return;
      }

      setServerStatus({
        type: 'success',
        message: 'Your inquiry has been successfully recorded in our database.',
        emailNotice: json.emailDelivery?.notice,
        inquiryId: json.inquiryId,
      });
      reset();
    } catch {
      setServerStatus({
        type: 'error',
        message: 'Network error communicating with the server. Please check your connection.',
      });
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl border border-zinc-200 shadow-xs">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-zinc-800" />
        <h2 className="text-xl font-medium text-zinc-900">
          Send a Client Inquiry
        </h2>
      </div>

      {serverStatus && (
        <div
          className={`p-4 rounded-lg mb-6 border text-xs sm:text-sm space-y-1.5 ${
            serverStatus.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
          role="alert"
        >
          <div className="flex items-start gap-2 font-semibold">
            {serverStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />
            )}
            <span>{serverStatus.message}</span>
          </div>

          {serverStatus.inquiryId && (
            <p className="text-xs text-emerald-700 pl-6">
              Reference Code: <code className="font-mono bg-emerald-100/70 px-1 py-0.5 rounded">{serverStatus.inquiryId}</code>
            </p>
          )}

          {serverStatus.emailNotice && (
            <div className="flex items-start gap-1.5 pl-6 pt-1 text-xs text-zinc-600">
              <Info className="w-3.5 h-3.5 text-zinc-400 mt-0.5 flex-shrink-0" />
              <span>{serverStatus.emailNotice}</span>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Name & Email Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-zinc-700 mb-1">
              Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              {...register('name')}
              placeholder="Elena Rostova"
              className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                errors.name ? 'border-rose-400 bg-rose-50/30' : 'border-zinc-300'
              } focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent`}
            />
            {errors.name && (
              <p className="text-xs text-rose-600 mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 mb-1">
              Email Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="elena@example.com"
              className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                errors.email ? 'border-rose-400 bg-rose-50/30' : 'border-zinc-300'
              } focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:border-transparent`}
            />
            {errors.email && (
              <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Category & Order Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-xs font-semibold text-zinc-700 mb-1">
              Inquiry Category <span className="text-rose-500">*</span>
            </label>
            <select
              id="category"
              {...register('category')}
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-950 bg-white"
            >
              <option value="GENERAL_SUPPORT">General Support</option>
              <option value="ORDER_INQUIRY">Order Status & Shipping</option>
              <option value="PRODUCT_SPECIFICATION">Product Specifications & Dimensions</option>
              <option value="TRADE_PARTNERSHIP">Commercial Trade & Partnerships</option>
              <option value="PRESS_MEDIA">Press & Studio Inquiries</option>
            </select>
            {errors.category && (
              <p className="text-xs text-rose-600 mt-1">{errors.category.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="orderNumber" className="block text-xs font-semibold text-zinc-700 mb-1">
              Order Number (Optional)
            </label>
            <input
              id="orderNumber"
              type="text"
              {...register('orderNumber')}
              placeholder="e.g. NVA-9842"
              className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-950"
            />
            {errors.orderNumber && (
              <p className="text-xs text-rose-600 mt-1">{errors.orderNumber.message}</p>
            )}
          </div>
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-xs font-semibold text-zinc-700 mb-1">
            Subject <span className="text-rose-500">*</span>
          </label>
          <input
            id="subject"
            type="text"
            {...register('subject')}
            placeholder="Inquiry regarding material finishes"
            className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
              errors.subject ? 'border-rose-400 bg-rose-50/30' : 'border-zinc-300'
            } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
          />
          {errors.subject && (
            <p className="text-xs text-rose-600 mt-1">{errors.subject.message}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-xs font-semibold text-zinc-700 mb-1">
            Message <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="message"
            rows={5}
            {...register('message')}
            placeholder="Please detail your request or question with as much clarity as possible..."
            className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
              errors.message ? 'border-rose-400 bg-rose-50/30' : 'border-zinc-300'
            } focus:outline-none focus:ring-2 focus:ring-zinc-950 resize-y`}
          />
          {errors.message && (
            <p className="text-xs text-rose-600 mt-1">{errors.message.message}</p>
          )}
        </div>

        <div className="pt-2 flex items-center justify-between">
          <p className="text-[11px] text-zinc-400">
            Administrator dispatch route: <span className="font-mono text-zinc-600">rmnrr333@gmail.com</span>
          </p>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Recording...</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span>Submit Inquiry</span>
                <Send className="w-3.5 h-3.5" />
              </span>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
