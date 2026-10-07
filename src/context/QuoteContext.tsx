import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '../data/products';

export interface QuoteItem {
  product: Product;
  selectedVariant?: string;
  quantity: number;
  note?: string;
}

interface QuoteContextType {
  items: QuoteItem[];
  addItem: (product: Product, variant?: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearQuote: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  itemCount: number;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (product: Product, variant?: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id && i.selectedVariant === variant);
      if (existing) {
        return prev.map(i =>
          i.product.id === product.id && i.selectedVariant === variant
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { product, selectedVariant: variant, quantity: 1 }];
    });
  };

  const removeItem = (productId: string) => {
    setItems(prev => prev.filter(i => i.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev => prev.map(i => i.product.id === productId ? { ...i, quantity } : i));
  };

  const clearQuote = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <QuoteContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearQuote, isOpen, setIsOpen, itemCount }}>
      {children}
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const context = useContext(QuoteContext);
  if (!context) throw new Error('useQuote must be used within QuoteProvider');
  return context;
}
