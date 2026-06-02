'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  weight: string;
  price: number;
  quantity: number;
  color: string;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>, qty?: number) => void;
  removeFromCart: (productId: number, weight: string) => void;
  updateQty: (productId: number, weight: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('nt-cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem('nt-cart', JSON.stringify(items));
    } catch {}
  }, [items, hydrated]);

  const addToCart = useCallback((item: Omit<CartItem, 'quantity'>, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(
        i => i.productId === item.productId && i.weight === item.weight
      );
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId && i.weight === item.weight
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: number, weight: string) => {
    setItems(prev => prev.filter(i => !(i.productId === productId && i.weight === weight)));
  }, []);

  const updateQty = useCallback((productId: number, weight: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => !(i.productId === productId && i.weight === weight)));
    } else {
      setItems(prev =>
        prev.map(i =>
          i.productId === productId && i.weight === weight ? { ...i, quantity: qty } : i
        )
      );
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items, addToCart, removeFromCart, updateQty, clearCart,
        totalItems, totalPrice,
        isOpen, openCart: () => setIsOpen(true), closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
