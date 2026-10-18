'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Package, MapPin, Truck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function TrackOrderPage() {
  const [orderQuery, setOrderQuery] = useState('');
  const [emailQuery, setEmailQuery] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim() || !emailQuery.trim()) {
      setErrorMsg('Please supply both the order number and associated billing email.');
      return;
    }

    setIsSearching(true);
    setErrorMsg(null);
    setSearchedOrder(null);

    try {
      const res = await fetch(`/api/orders/track?orderNumber=${encodeURIComponent(orderQuery.trim())}&email=${encodeURIComponent(emailQuery.trim())}`);
      const json = await res.json();

      if (!res.ok) {
        setErrorMsg(json.error || 'No matching order could be located.');
      } else {
        setSearchedOrder(json.order);
      }
    } catch {
      setErrorMsg('Network error communicating with order tracking system.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-2xl">
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
            Fulfillment Concierge
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-zinc-900 tracking-tight">
            Track Order & Delivery
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-2 max-w-md mx-auto leading-relaxed">
            Enter your order reference code (e.g. NVA-2026-XXXX) and confirmation email address to view real-time status.
          </p>
        </div>

        {/* Search Form Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm mb-8">
          <form onSubmit={handleTrackSubmit} className="space-y-4">
            <div>
              <label htmlFor="orderQuery" className="block text-xs font-semibold text-zinc-700 mb-1">
                Order Reference Code
              </label>
              <input
                id="orderQuery"
                type="text"
                value={orderQuery}
                onChange={(e) => setOrderQuery(e.target.value.toUpperCase())}
                placeholder="NVA-2026-XXXX"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-950 font-mono uppercase"
              />
            </div>

            <div>
              <label htmlFor="emailQuery" className="block text-xs font-semibold text-zinc-700 mb-1">
                Customer Email Address
              </label>
              <input
                id="emailQuery"
                type="email"
                value={emailQuery}
                onChange={(e) => setEmailQuery(e.target.value)}
                placeholder="elena@example.com"
                className="w-full px-3.5 py-2 text-sm rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-950"
              />
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <Button type="submit" variant="primary" size="md" disabled={isSearching} className="w-full">
              {isSearching ? 'Locating Order...' : 'Search Order Status'}
            </Button>
          </form>
        </div>

        {/* Search Results Display */}
        {searchedOrder && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200">
              <div>
                <span className="text-xs text-zinc-500 block">Order</span>
                <span className="font-mono text-lg font-bold text-zinc-900">{searchedOrder.orderNumber}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-900 text-white uppercase tracking-wider">
                {searchedOrder.status}
              </span>
            </div>

            {/* Tracking progress pills */}
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div className={`p-2.5 rounded-lg border ${
                ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'].includes(searchedOrder.status)
                  ? 'bg-zinc-950 text-white border-zinc-950'
                  : 'bg-zinc-100 text-zinc-400 border-zinc-200'
              }`}>
                <span className="block font-semibold">1. Placed</span>
              </div>
              <div className={`p-2.5 rounded-lg border ${
                ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(searchedOrder.status)
                  ? 'bg-zinc-950 text-white border-zinc-950'
                  : 'bg-zinc-100 text-zinc-400 border-zinc-200'
              }`}>
                <span className="block font-semibold">2. Packed</span>
              </div>
              <div className={`p-2.5 rounded-lg border ${
                ['SHIPPED', 'DELIVERED'].includes(searchedOrder.status)
                  ? 'bg-zinc-950 text-white border-zinc-950'
                  : 'bg-zinc-100 text-zinc-400 border-zinc-200'
              }`}>
                <span className="block font-semibold">3. In Transit</span>
              </div>
              <div className={`p-2.5 rounded-lg border ${
                searchedOrder.status === 'DELIVERED'
                  ? 'bg-zinc-950 text-white border-zinc-950'
                  : 'bg-zinc-100 text-zinc-400 border-zinc-200'
              }`}>
                <span className="block font-semibold">4. Delivered</span>
              </div>
            </div>

            {/* Order Details */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Destination:</span>
                <span className="font-medium text-zinc-900">{searchedOrder.shippingCity}, {searchedOrder.shippingCountry}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Delivery Tier:</span>
                <span className="font-medium text-zinc-900">{searchedOrder.deliveryOption}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Total Charged:</span>
                <span className="font-semibold text-zinc-950">{formatPrice(Number(searchedOrder.total))}</span>
              </div>
              {searchedOrder.trackingNumber && (
                <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 flex items-center justify-between">
                  <span className="text-zinc-600">Carrier Tracking Number:</span>
                  <span className="font-mono font-bold text-zinc-900">{searchedOrder.trackingNumber}</span>
                </div>
              )}
            </div>

            <div className="pt-2 text-center">
              <Link href={`/account/orders/${searchedOrder.id}`}>
                <Button variant="outline" size="sm">
                  View Full Item Breakdown
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
