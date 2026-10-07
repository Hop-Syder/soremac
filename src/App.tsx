import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { QuoteProvider } from './context/QuoteContext';
import Header from './components/Header';
import Footer from './components/Footer';
import QuoteDrawer from './components/QuoteDrawer';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import TipsPage from './pages/TipsPage';
import { MessageCircle, ShoppingBag } from 'lucide-react';
import { useQuote } from './context/QuoteContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function FloatingButtons() {
  const { itemCount, setIsOpen } = useQuote();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Desktop floating buttons */}
      <div className="fixed bottom-6 right-6 z-40 hidden md:flex flex-col gap-3">
        {itemCount > 0 && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 bg-amber-accent hover:bg-amber-hover text-white rounded-full shadow-lg flex items-center justify-center transition-colors relative"
          >
            <ShoppingBag size={22} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-graphite text-white text-xs font-bold rounded-full flex items-center justify-center">{itemCount}</span>
          </motion.button>
        )}
        <a
          href="https://wa.me/22952140000"
          target="_blank"
          rel="noopener noreferrer"
          className="w-14 h-14 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          aria-label="Contacter sur WhatsApp"
        >
          <MessageCircle size={24} />
        </a>
      </div>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 px-2 py-2 safe-bottom">
        <div className="flex items-center justify-around">
          {[
            { path: '/', label: 'Accueil', icon: '🏠' },
            { path: '/produits', label: 'Produits', icon: '📦' },
            { path: '/conseils', label: 'Conseils', icon: '💡' },
          ].map(item => (
            <a key={item.path} href={`#${item.path}`} className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-colors ${isActive(item.path) ? 'text-amber-accent' : 'text-steel'}`}>
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </a>
          ))}
          <button onClick={() => setIsOpen(true)} className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg relative">
            <span className="text-lg">📋</span>
            <span className="text-[10px] font-medium text-steel">Devis</span>
            {itemCount > 0 && <span className="absolute -top-0.5 right-1 w-4 h-4 bg-amber-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">{itemCount}</span>}
          </button>
          <a href="https://wa.me/22952140000" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg">
            <span className="text-lg">💬</span>
            <span className="text-[10px] font-medium text-steel">WhatsApp</span>
          </a>
        </div>
      </nav>
    </>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route path="/produits" element={<CatalogPage />} />
          <Route path="/produits/:slug" element={<ProductPage />} />
          <Route path="/a-propos" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/conseils" element={<TipsPage />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <HashRouter>
      <QuoteProvider>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex-1 pb-16 md:pb-0">
            <AnimatedRoutes />
          </div>
          <Footer />
        </div>
        <QuoteDrawer />
        <FloatingButtons />
      </QuoteProvider>
    </HashRouter>
  );
}
