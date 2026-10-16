'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem } from '@/lib/types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      addItem: (item, quantity = 1) => {
        const currentItems = get().items;
        const existingIndex = currentItems.findIndex((i) => i.id === item.id);

        if (existingIndex > -1) {
          const updatedItems = [...currentItems];
          const existingItem = updatedItems[existingIndex];
          const newQty = Math.min(
            existingItem.quantity + quantity,
            existingItem.maxStock || 99
          );
          updatedItems[existingIndex] = {
            ...existingItem,
            quantity: newQty,
          };
          set({ items: updatedItems, isOpen: true });
        } else {
          const safeQuantity = Math.min(Math.max(1, quantity), item.maxStock || 99);
          set({
            items: [...currentItems, { ...item, quantity: safeQuantity }],
            isOpen: true,
          });
        }
      },

      updateQuantity: (id, quantity) => {
        const currentItems = get().items;
        if (quantity <= 0) {
          set({ items: currentItems.filter((i) => i.id !== id) });
          return;
        }

        const updatedItems = currentItems.map((item) => {
          if (item.id === id) {
            const safeQty = Math.min(quantity, item.maxStock || 99);
            return { ...item, quantity: safeQty };
          }
          return item;
        });

        set({ items: updatedItems });
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: 'nova-guest-cart-v1',
      storage: createJSONStorage(() => localStorage),
      // Only persist items, isOpen remains UI transient state
      partialize: (state) => ({ items: state.items }),
    }
  )
);
