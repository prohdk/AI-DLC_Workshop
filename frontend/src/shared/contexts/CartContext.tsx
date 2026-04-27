import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  totalAmount: number;
  totalCount: number;
  addItem: (item: { menuItemId: number; name: string; price: number }) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, qty: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartState | null>(null);

function calcTotals(items: CartItem[]) {
  return {
    totalAmount: items.reduce((s, i) => s + i.price * i.quantity, 0),
    totalCount: items.reduce((s, i) => s + i.quantity, 0),
  };
}

function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem('cart_items');
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveCart(items: CartItem[]) {
  localStorage.setItem('cart_items', JSON.stringify(items));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  const update = (next: CartItem[]) => { setItems(next); saveCart(next); };

  const addItem = useCallback((item: { menuItemId: number; name: string; price: number }) => {
    setItems((prev) => {
      const idx = prev.findIndex((i) => i.menuItemId === item.menuItemId);
      const next = idx >= 0
        ? prev.map((i, j) => j === idx ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...item, quantity: 1 }];
      saveCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((menuItemId: number) => {
    setItems((prev) => { const next = prev.filter((i) => i.menuItemId !== menuItemId); saveCart(next); return next; });
  }, []);

  const updateQuantity = useCallback((menuItemId: number, qty: number) => {
    if (qty < 1) { removeItem(menuItemId); return; }
    setItems((prev) => {
      const next = prev.map((i) => i.menuItemId === menuItemId ? { ...i, quantity: qty } : i);
      saveCart(next);
      return next;
    });
  }, [removeItem]);

  const clear = useCallback(() => { update([]); }, []);

  const { totalAmount, totalCount } = calcTotals(items);

  return (
    <CartContext.Provider value={{ items, totalAmount, totalCount, addItem, removeItem, updateQuantity, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
