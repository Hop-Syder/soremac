import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, MessageCircle, Trash2, ShoppingBag } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';

export default function QuoteDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, clearQuote, itemCount } = useQuote();

  const whatsappMessage = () => {
    const lines = items.map(i => {
      const variant = i.selectedVariant ? ` (${i.selectedVariant})` : '';
      return `• ${i.product.name}${variant} — ${i.quantity} ${i.product.packaging || 'unité(s)'}`;
    });
    return `Bonjour SOREMAC, je souhaite demander un devis pour les produits suivants :\n\n${lines.join('\n')}\n\nMerci.`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-amber-accent" />
                <h2 className="font-heading font-semibold text-lg">Votre demande de devis</h2>
                <span className="bg-amber-accent text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">{itemCount}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-gray-200 mb-4" />
                  <p className="text-gray-500 font-medium">Votre demande est vide</p>
                  <p className="text-sm text-gray-400 mt-1">Ajoutez des produits depuis le catalogue</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map(item => (
                    <div key={item.product.id + (item.selectedVariant || '')} className="flex gap-3 p-3 bg-mineral rounded-lg">
                      <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-md" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        {item.selectedVariant && <p className="text-xs text-steel mt-0.5">{item.selectedVariant}</p>}
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-white">
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center rounded border border-gray-200 hover:bg-white">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      <button onClick={() => removeItem(item.product.id)} className="p-1.5 text-gray-400 hover:text-red-500 transition-colors self-start">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer actions */}
            {items.length > 0 && (
              <div className="p-5 border-t border-gray-100 space-y-3">
                <a
                  href={`https://wa.me/22952140000?text=${encodeURIComponent(whatsappMessage())}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  <MessageCircle size={18} />
                  Envoyer sur WhatsApp
                </a>
                <button
                  onClick={clearQuote}
                  className="w-full py-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
                >
                  Vider la demande
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
