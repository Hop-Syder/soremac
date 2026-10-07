import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronLeft, ChevronRight, MessageCircle, ShoppingCart, X, Headphones } from 'lucide-react';
import { getProductBySlug, getRelatedProducts, categories } from '../data/products';
import { useQuote } from '../context/QuoteContext';

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = getProductBySlug(slug || '');
  const { addItem } = useQuote();
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [activeImage, setActiveImage] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (!product) {
    return (
      <main className="pt-32 pb-20 text-center">
        <h1 className="font-heading text-2xl font-bold text-graphite">Produit introuvable</h1>
        <p className="text-steel mt-2">Ce produit n'existe pas ou a été retiré.</p>
        <Link to="/produits" className="inline-flex items-center gap-2 mt-6 text-amber-accent font-medium">
          Retour au catalogue <ArrowRight size={14} />
        </Link>
      </main>
    );
  }

  const category = categories.find(c => c.id === product.categoryId);
  const relatedProducts = getRelatedProducts(product);
  const gallery = product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <main className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-steel mb-8 overflow-x-auto">
          <Link to="/" className="hover:text-amber-accent transition-colors whitespace-nowrap">Accueil</Link>
          <span>/</span>
          <Link to="/produits" className="hover:text-amber-accent transition-colors whitespace-nowrap">Produits</Link>
          <span>/</span>
          {category && (
            <>
              <Link to={`/produits?category=${category.id}`} className="hover:text-amber-accent transition-colors whitespace-nowrap">{category.name}</Link>
              <span>/</span>
            </>
          )}
          <span className="text-graphite font-medium whitespace-nowrap">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative aspect-square rounded-xl overflow-hidden bg-mineral cursor-zoom-in" onClick={() => setLightbox(true)}>
              <img src={gallery[activeImage]} alt={product.name} className="w-full h-full object-cover" />
              {product.badge && (
                <span className="absolute top-4 left-4 px-3 py-1.5 bg-amber-accent text-white text-sm font-medium rounded-lg">{product.badge}</span>
              )}
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-2 mt-3">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-amber-accent' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <p className="text-sm text-amber-accent font-medium uppercase tracking-wider mb-2">{category?.name}</p>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-graphite mb-4">{product.name}</h1>
            <p className="text-steel text-lg leading-relaxed mb-6">{product.shortDescription}</p>

            {/* Brand */}
            {product.brand && (
              <p className="text-sm text-steel mb-4">Marque : <span className="font-medium text-graphite">{product.brand}</span></p>
            )}

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-graphite mb-3">Variantes disponibles</p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map(v => (
                    <button
                      key={v.value}
                      onClick={() => setSelectedVariant(v.label)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all ${
                        selectedVariant === v.label
                          ? 'bg-amber-accent text-white border-amber-accent'
                          : 'border-gray-200 text-graphite hover:border-amber-accent/50'
                      }`}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Packaging */}
            {product.packaging && (
              <p className="text-sm text-steel mb-6">Conditionnement : <span className="font-medium text-graphite">{product.packaging}</span></p>
            )}

            {/* Price */}
            <div className="p-4 bg-mineral rounded-lg mb-6">
              <p className="text-sm text-steel">Prix</p>
              <p className="font-heading text-xl font-bold text-graphite">Sur demande</p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={() => addItem(product, selectedVariant || undefined)}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-amber-accent hover:bg-amber-hover text-white font-medium rounded-lg transition-colors"
              >
                <ShoppingCart size={18} /> Ajouter au devis
              </button>
              <a
                href={`https://wa.me/22952140000?text=${encodeURIComponent(`Bonjour SOREMAC, je souhaite avoir des informations sur : ${product.name}${selectedVariant ? ` (${selectedVariant})` : ''}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                <MessageCircle size={18} /> Demander sur WhatsApp
              </a>
            </div>

            {/* Characteristics */}
            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-heading font-semibold text-graphite mb-4">Caractéristiques</h3>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(product.characteristics).map(([key, value]) => (
                  <div key={key} className="p-3 bg-mineral rounded-lg">
                    <p className="text-xs text-steel uppercase tracking-wider">{key}</p>
                    <p className="text-sm font-medium text-graphite mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Description */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16 max-w-3xl">
          <h2 className="font-heading text-2xl font-bold text-graphite mb-4">Description</h2>
          <p className="text-steel leading-relaxed mb-6">{product.description}</p>

          {product.usage && (
            <div className="mb-6">
              <h3 className="font-heading font-semibold text-graphite mb-2">Utilisation</h3>
              <p className="text-steel">{product.usage}</p>
            </div>
          )}

          {product.tips && (
            <div className="p-4 bg-amber-accent/5 border border-amber-accent/20 rounded-lg">
              <h3 className="font-heading font-semibold text-graphite mb-2">Conseils</h3>
              <p className="text-sm text-steel">{product.tips}</p>
            </div>
          )}
        </motion.div>

        {/* Advice CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 p-8 bg-mineral rounded-xl text-center">
          <Headphones size={32} className="text-amber-accent mx-auto mb-3" />
          <h3 className="font-heading text-xl font-bold text-graphite mb-2">Besoin d'un conseil ?</h3>
          <p className="text-steel mb-4">Vous hésitez entre plusieurs références ? Notre équipe peut vous orienter selon votre besoin.</p>
          <a
            href="https://wa.me/22952140000?text=Bonjour SOREMAC, j'ai besoin de conseil sur mes matériaux."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
          >
            <MessageCircle size={18} /> Parler à un conseiller
          </a>
        </motion.div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-16">
            <h2 className="font-heading text-2xl font-bold text-graphite mb-6">Vous pourriez aussi avoir besoin de...</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map(rp => (
                <Link
                  key={rp.id}
                  to={`/produits/${rp.slug}`}
                  className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-steel uppercase tracking-wider mb-1">{categories.find(c => c.id === rp.categoryId)?.name}</p>
                    <h3 className="font-heading font-semibold text-graphite group-hover:text-amber-accent transition-colors">{rp.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightbox(false)}>
          <button className="absolute top-6 right-6 text-white/70 hover:text-white" onClick={() => setLightbox(false)}>
            <X size={28} />
          </button>
          {gallery.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); setActiveImage((activeImage - 1 + gallery.length) % gallery.length); }}
                className="absolute left-6 text-white/70 hover:text-white"
              >
                <ChevronLeft size={36} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); setActiveImage((activeImage + 1) % gallery.length); }}
                className="absolute right-6 text-white/70 hover:text-white"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}
          <img src={gallery[activeImage]} alt={product.name} className="max-w-[90vw] max-h-[85vh] object-contain" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </main>
  );
}
