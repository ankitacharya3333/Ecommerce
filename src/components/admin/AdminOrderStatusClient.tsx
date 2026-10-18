'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface AdminOrderStatusClientProps {
  orderId: string;
  initialStatus: string;
  initialTracking: string;
}

export function AdminOrderStatusClient({
  orderId,
  initialStatus,
  initialTracking,
}: AdminOrderStatusClientProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [trackingNumber, setTrackingNumber] = useState(initialTracking);
  const [isUpdating, setIsUpdating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setFeedback(null);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber }),
      });

      const json = await res.json();
      if (!res.ok) {
        setFeedback({ type: 'error', text: json.error || 'Failed to update order.' });
      } else {
        setFeedback({ type: 'success', text: 'Order status & tracking updated successfully.' });
        router.refresh();
      }
    } catch {
      setFeedback({ type: 'error', text: 'Network error updating order status.' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
      <h2 className="text-sm font-semibold text-zinc-900">
        Update Fulfillment Status & Carrier Tracking
      </h2>

      {feedback && (
        <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
          feedback.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
          <span>{feedback.text}</span>
        </div>
      )}

      <form onSubmit={handleUpdate} className="space-y-4 text-xs">
        <div>
          <label htmlFor="status" className="block font-semibold text-zinc-700 mb-1">
            Fulfillment Lifecycle State
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 bg-white focus:outline-none focus:ring-2 focus:ring-zinc-950 font-medium"
          >
            <option value="PENDING">PENDING (Awaiting packing)</option>
            <option value="PROCESSING">PROCESSING (Packing in studio)</option>
            <option value="SHIPPED">SHIPPED (Handed to courier)</option>
            <option value="DELIVERED">DELIVERED (Client confirmed receipt)</option>
            <option value="CANCELLED">CANCELLED (Refunded / Restocked)</option>
          </select>
        </div>

        <div>
          <label htmlFor="tracking" className="block font-semibold text-zinc-700 mb-1">
            Carrier Tracking Number
          </label>
          <input
            id="tracking"
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder="e.g. 1Z9999999999999999 or DHL-849204"
            className="w-full px-3 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-950 font-mono"
          />
        </div>

        <Button type="submit" variant="primary" size="sm" disabled={isUpdating}>
          {isUpdating ? (
            <span className="flex items-center gap-1.5">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Updating...</span>
            </span>
          ) : (
            <span>Save Order Status Changes</span>
          )}
        </Button>
      </form>
    </div>
  );
}
