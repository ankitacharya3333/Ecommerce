'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Package, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'CONFIRMED';
  const orderNumber = searchParams.get('orderNumber') || orderId;

  return (
    <div className="max-w-xl mx-auto bg-white p-8 sm:p-12 rounded-2xl border border-zinc-200 shadow-sm text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div>
        <span className="text-xs font-semibold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
          Order Successfully Placed
        </span>
        <h1 className="text-2xl sm:text-3xl font-serif font-medium text-zinc-900 tracking-tight mt-3">
          Thank you for choosing NOVA MARKET
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Reference Code: <span className="font-mono font-semibold text-zinc-800">{orderNumber}</span>
        </p>
      </div>

      <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 text-xs text-zinc-600 text-left space-y-2">
        <div className="flex items-center gap-2 font-semibold text-zinc-900">
          <Mail className="w-4 h-4 text-zinc-700" />
          <span>Receipt & Dispatches</span>
        </div>
        <p className="leading-relaxed">
          An automated order confirmation has been dispatched. Once your objects are packed and sealed in our studio, tracking numbers will be provided.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <Link href="/account/orders" className="w-full sm:w-auto">
          <Button variant="primary" size="md" className="w-full">
            <Package className="w-4 h-4 mr-1.5" />
            <span>View in Account</span>
          </Button>
        </Link>
        <Link href="/products" className="w-full sm:w-auto">
          <Button variant="outline" size="md" className="w-full">
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>

      <div className="pt-4 border-t border-zinc-100 flex items-center justify-center gap-1.5 text-[11px] text-zinc-400">
        <ShieldCheck className="w-3.5 h-3.5 text-zinc-500" />
        <span>Complimentary 30-day returns on all domestic orders</span>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container>
        <Suspense fallback={<div className="text-center text-xs text-zinc-500">Loading order status...</div>}>
          <OrderConfirmationContent />
        </Suspense>
      </Container>
    </div>
  );
}
