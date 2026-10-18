'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  Tag,
  AlertCircle,
  Loader2,
  Lock,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { checkoutFormSchema, CheckoutFormInput } from '@/lib/validations';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function CheckoutClient() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  const [idempotencyKey] = useState(() => `idemp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormInput>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      company: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'United States',
      phone: '',
      deliveryOption: 'STANDARD',
      paymentMethod: 'STRIPE',
      couponCode: '',
      items: [],
      idempotencyKey,
    },
  });

  const selectedDelivery = watch('deliveryOption');
  const selectedPayment = watch('paymentMethod');

  // Synchronize cart items into form payload
  useEffect(() => {
    setValue(
      'items',
      items.map((i) => ({
        productId: i.productId,
        quantity: i.quantity,
        selectedVariants: i.selectedVariants,
      }))
    );
    setValue('idempotencyKey', idempotencyKey);
  }, [items, setValue, idempotencyKey]);

  // Dynamic pricing calculation
  let shippingCost = subtotal >= 120 || subtotal === 0 ? 0 : 8.0;
  if (selectedDelivery === 'EXPRESS') shippingCost += 18.0;
  if (selectedDelivery === 'CARBON_NEUTRAL') shippingCost += 2.5;

  const total = Math.max(0, subtotal - couponDiscount + shippingCost);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setIsApplyingCoupon(true);
    setCouponMsg(null);
    try {
      const res = await fetch('/api/checkout/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCouponMsg({ type: 'error', text: data.error || 'Invalid coupon' });
        setCouponDiscount(0);
      } else {
        setCouponDiscount(data.discount);
        setValue('couponCode', data.code);
        setCouponMsg({ type: 'success', text: data.message });
      }
    } catch {
      setCouponMsg({ type: 'error', text: 'Error verifying coupon.' });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const onSubmit = async (data: CheckoutFormInput) => {
    setCheckoutError(null);

    if (items.length === 0) {
      setCheckoutError('Your shopping bag is empty. Please select products first.');
      return;
    }

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            selectedVariants: i.selectedVariants,
          })),
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setCheckoutError(result.error || 'Checkout failed. Please inspect the provided details.');
        return;
      }

      // Order created successfully — clear local guest cart
      clearCart();

      if (result.redirectUrl) {
        if (result.redirectUrl.startsWith('http')) {
          window.location.href = result.redirectUrl;
        } else {
          router.push(result.redirectUrl);
        }
      } else {
        router.push(`/order-confirmation?orderId=${result.orderId}&orderNumber=${result.orderNumber}`);
      }
    } catch (err: any) {
      setCheckoutError('Network error connecting to payment & order processing.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto">
        <h2 className="text-xl font-medium text-zinc-900 mb-2">Your shopping bag is empty</h2>
        <p className="text-xs text-zinc-500 mb-6">
          Add living essentials from our catalog before proceeding to checkout.
        </p>
        <Link href="/products">
          <Button variant="primary" size="md">
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span>Return to Catalog</span>
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start" noValidate>
      {/* Left Column: Customer details & shipping inputs */}
      <div className="lg:col-span-7 space-y-8">
        {checkoutError && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{checkoutError}</span>
          </div>
        )}

        {/* 1. Contact Information */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
            <span>1. Contact Details</span>
          </h2>
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-zinc-700 mb-1">
              Email Address for Receipt & Tracking Updates <span className="text-rose-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              placeholder="elena@example.com"
              className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                errors.email ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
              } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
            />
            {errors.email && <p className="text-xs text-rose-600 mt-1">{errors.email.message}</p>}
          </div>
        </div>

        {/* 2. Shipping Address */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-zinc-900">
            <span>2. Shipping Address</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-xs font-semibold text-zinc-700 mb-1">
                First Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="firstName"
                type="text"
                {...register('firstName')}
                placeholder="Elena"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                  errors.firstName ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
                } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
              />
              {errors.firstName && <p className="text-xs text-rose-600 mt-1">{errors.firstName.message}</p>}
            </div>

            <div>
              <label htmlFor="lastName" className="block text-xs font-semibold text-zinc-700 mb-1">
                Last Name <span className="text-rose-500">*</span>
              </label>
              <input
                id="lastName"
                type="text"
                {...register('lastName')}
                placeholder="Rostova"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                  errors.lastName ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
                } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
              />
              {errors.lastName && <p className="text-xs text-rose-600 mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="address1" className="block text-xs font-semibold text-zinc-700 mb-1">
              Street Address <span className="text-rose-500">*</span>
            </label>
            <input
              id="address1"
              type="text"
              {...register('address1')}
              placeholder="548 Market Street, Suite 4820"
              className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                errors.address1 ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
              } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
            />
            {errors.address1 && <p className="text-xs text-rose-600 mt-1">{errors.address1.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-xs font-semibold text-zinc-700 mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                id="city"
                type="text"
                {...register('city')}
                placeholder="San Francisco"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                  errors.city ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
                } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
              />
              {errors.city && <p className="text-xs text-rose-600 mt-1">{errors.city.message}</p>}
            </div>

            <div>
              <label htmlFor="state" className="block text-xs font-semibold text-zinc-700 mb-1">
                State / Province <span className="text-rose-500">*</span>
              </label>
              <input
                id="state"
                type="text"
                {...register('state')}
                placeholder="CA"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                  errors.state ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
                } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
              />
              {errors.state && <p className="text-xs text-rose-600 mt-1">{errors.state.message}</p>}
            </div>

            <div>
              <label htmlFor="postalCode" className="block text-xs font-semibold text-zinc-700 mb-1">
                Postal Code <span className="text-rose-500">*</span>
              </label>
              <input
                id="postalCode"
                type="text"
                {...register('postalCode')}
                placeholder="94104"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                  errors.postalCode ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
                } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
              />
              {errors.postalCode && <p className="text-xs text-rose-600 mt-1">{errors.postalCode.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-zinc-700 mb-1">
              Phone Number for Carrier Dispatch <span className="text-rose-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="+1 (415) 555-0199"
              className={`w-full px-3.5 py-2 text-sm rounded-lg border ${
                errors.phone ? 'border-rose-400 bg-rose-50/20' : 'border-zinc-300'
              } focus:outline-none focus:ring-2 focus:ring-zinc-950`}
            />
            {errors.phone && <p className="text-xs text-rose-600 mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        {/* 3. Delivery Method */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs space-y-3">
          <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
            <Truck className="w-4 h-4 text-zinc-700" />
            <span>3. Delivery Speed</span>
          </h2>

          <div className="space-y-2">
            <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedDelivery === 'STANDARD' ? 'border-zinc-950 bg-zinc-50/70 ring-1 ring-zinc-950' : 'border-zinc-200 hover:border-zinc-300'
            }`}>
              <div className="flex items-center gap-3">
                <input type="radio" value="STANDARD" {...register('deliveryOption')} className="text-zinc-950 focus:ring-zinc-950" />
                <div>
                  <span className="block text-xs font-semibold text-zinc-900">Standard Tracked Delivery (3-5 business days)</span>
                  <span className="block text-[11px] text-zinc-500">Complimentary on orders over $120.00</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-zinc-900">{subtotal >= 120 ? 'Free' : '$8.00'}</span>
            </label>

            <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
              selectedDelivery === 'EXPRESS' ? 'border-zinc-950 bg-zinc-50/70 ring-1 ring-zinc-950' : 'border-zinc-200 hover:border-zinc-300'
            }`}>
              <div className="flex items-center gap-3">
                <input type="radio" value="EXPRESS" {...register('deliveryOption')} className="text-zinc-950 focus:ring-zinc-950" />
                <div>
                  <span className="block text-xs font-semibold text-zinc-900">Priority Express Dispatch (1-2 business days)</span>
                  <span className="block text-[11px] text-zinc-500">Expedited air freight with dedicated handling</span>
                </div>
              </div>
              <span className="text-xs font-semibold text-zinc-900">{subtotal >= 120 ? '$18.00' : '$26.00'}</span>
            </label>
          </div>
        </div>

        {/* 4. Payment Gateway */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
          <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-zinc-700" />
            <span>4. Payment Method</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between gap-3 ${
              selectedPayment === 'STRIPE' ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950' : 'border-zinc-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900">Credit / Debit Card (Stripe)</span>
                <input type="radio" value="STRIPE" {...register('paymentMethod')} />
              </div>
              <p className="text-[11px] text-zinc-500">
                Official Stripe hosted checkout with 256-bit SSL encryption.
              </p>
            </label>

            <label className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between gap-3 ${
              selectedPayment === 'MANUAL_BANK_TRANSFER' ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950' : 'border-zinc-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-900">Direct Bank Wire</span>
                <input type="radio" value="MANUAL_BANK_TRANSFER" {...register('paymentMethod')} />
              </div>
              <p className="text-[11px] text-zinc-500">
                Wire instructions dispatched with order confirmation.
              </p>
            </label>
          </div>
        </div>
      </div>

      {/* Right Column: Order summary & coupon redemption */}
      <div className="lg:col-span-5 bg-zinc-50 p-6 sm:p-8 rounded-2xl border border-zinc-200 space-y-6">
        <h3 className="text-base font-semibold text-zinc-900">
          Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h3>

        {/* Items mini list */}
        <div className="divide-y divide-zinc-200 max-h-60 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover border border-zinc-200 flex-shrink-0" />
                <div>
                  <span className="font-medium text-zinc-900 block truncate max-w-[160px]">{item.name}</span>
                  <span className="text-zinc-500 text-[11px]">Qty: {item.quantity}</span>
                </div>
              </div>
              <span className="font-semibold text-zinc-900">{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        {/* Coupon Form */}
        <div className="pt-2 border-t border-zinc-200">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Discount code (e.g. WELCOME10)"
              className="flex-1 uppercase text-xs px-3 py-2 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:ring-1 focus:ring-zinc-950 font-mono"
            />
            <button
              type="button"
              disabled={isApplyingCoupon || !couponCode.trim()}
              onClick={handleApplyCoupon}
              className="px-3 py-2 bg-zinc-900 text-white rounded-lg text-xs font-medium hover:bg-zinc-800 disabled:opacity-50"
            >
              {isApplyingCoupon ? 'Checking...' : 'Apply'}
            </button>
          </div>
          {couponMsg && (
            <p className={`text-xs mt-1.5 ${couponMsg.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>
              {couponMsg.text}
            </p>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 text-xs border-t border-zinc-200 pt-4">
          <div className="flex justify-between text-zinc-600">
            <span>Subtotal</span>
            <span className="font-medium text-zinc-900">{formatPrice(subtotal)}</span>
          </div>

          {couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Promotional Discount</span>
              <span>-{formatPrice(couponDiscount)}</span>
            </div>
          )}

          <div className="flex justify-between text-zinc-600">
            <span>Shipping ({selectedDelivery.toLowerCase()})</span>
            <span>{shippingCost === 0 ? 'Complimentary' : formatPrice(shippingCost)}</span>
          </div>

          <div className="flex justify-between items-baseline pt-2 border-t border-zinc-200 text-sm sm:text-base font-bold text-zinc-950">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Placing Order & Initiating Payment...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Lock className="w-4 h-4" />
              <span>Complete Order • {formatPrice(total)}</span>
            </span>
          )}
        </Button>

        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 pt-1">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Server-side inventory validation & SSL encrypted</span>
        </div>
      </div>
    </form>
  );
}
