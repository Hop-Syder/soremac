import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, MessageCircle, FileText, Phone } from 'lucide-react';
import { useQuote } from '../context/QuoteContext';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { itemCount, setIsOpen } = useQuote();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { label: 'Accueil', path: '/' },
    { label: 'Produits', path: '/produits' },
    { label: 'Services', path: '/services' },
    { label: 'À propos', path: '/a-propos' },
    { label: 'Conseils', path: '/conseils' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top bar */}
          <div className={`hidden md:flex items-center justify-between py-1.5 text-xs transition-all duration-300 ${scrolled ? 'h-0 overflow-hidden opacity-0' : 'h-auto opacity-100 text-white/80'}`}>
            <span>Matériaux de construction • Vente détail & gros • Cotonou, Bénin</span>
            <div className="flex items-center gap-4">
              <a href="tel:+22952140000" className="flex items-center gap-1 hover:text-white transition-colors">
                <Phone size={12} /> +229 52 14 00 00
              </a>
            </div>
          </div>

          {/* Main nav */}
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className={`font-heading font-bold text-xl tracking-tight transition-colors duration-300 ${scrolled ? 'text-graphite' : 'text-white'}`}>
                SOREMAC
              </div>
              <span className={`text-[10px] font-medium tracking-wider uppercase transition-colors duration-300 ${scrolled ? 'text-steel' : 'text-white/70'}`}>
                SARL
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-amber-accent ${
                    scrolled ? 'text-graphite' : 'text-white/90 hover:text-white'
                  } ${location.pathname === link.path ? 'text-amber-accent' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-amber-accent hover:bg-amber-hover rounded-md transition-colors"
              >
                <FileText size={16} />
                Devis {itemCount > 0 && <span className="bg-white text-amber-accent text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">{itemCount}</span>}
              </button>
              <a
                href="https://wa.me/22952140000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={`lg:hidden p-2 rounded-md transition-colors ${scrolled ? 'text-graphite' : 'text-white'}`}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed inset-0 z-40 bg-white pt-20"
          >
            <nav className="flex flex-col p-6 gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`py-3 px-4 text-lg font-medium rounded-lg transition-colors ${
                    location.pathname === link.path ? 'bg-mineral text-amber-accent' : 'text-graphite hover:bg-mineral'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col gap-3">
                <button
                  onClick={() => { setIsOpen(true); setMobileOpen(false); }}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-amber-accent rounded-lg"
                >
                  <FileText size={18} /> Demander un devis
                </button>
                <a
                  href="https://wa.me/22952140000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-white bg-green-600 rounded-lg"
                >
                  <MessageCircle size={18} /> WhatsApp
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
