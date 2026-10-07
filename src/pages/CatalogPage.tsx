import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal, X, ArrowRight } from 'lucide-react';
import { products, categories } from '../data/products';
import { useQuote } from '../context/QuoteContext';

export default function CatalogPage() {
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || '';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useQuote();

  const brands = [...new Set(products.map(p => p.brand).filter(Boolean))] as string[];

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.shortDescription.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = !selectedCategory || p.categoryId === selectedCategory;
      const matchBrand = !selectedBrand || p.brand === selectedBrand;
      return matchSearch && matchCategory && matchBrand;
    });
  }, [search, selectedCategory, selectedBrand]);

  return (
    <main className="pt-24 pb-20 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-graphite mb-2">Catalogue SOREMAC</h1>
          <p className="text-steel text-lg">Explorez nos matériaux, équipements et produits pour tous vos projets de construction.</p>
        </motion.div>

        {/* Search bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-steel" />
            <input
              type="text"
              placeholder="Rechercher un produit, une marque, une dimension..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-mineral border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-accent focus:ring-1 focus:ring-amber-accent/20 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-steel hover:text-graphite">
                <X size={16} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 rounded-lg text-sm font-medium text-graphite"
          >
            <SlidersHorizontal size={16} /> Filtrer
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar filters - Desktop */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-28 space-y-6">
              <div>
                <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-graphite mb-3">Catégorie</h3>
                <div className="space-y-1.5">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${!selectedCategory ? 'bg-amber-accent/10 text-amber-accent font-medium' : 'text-steel hover:bg-mineral'}`}
                  >
                    Toutes les catégories
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${selectedCategory === cat.id ? 'bg-amber-accent/10 text-amber-accent font-medium' : 'text-steel hover:bg-mineral'}`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {brands.length > 0 && (
                <div>
                  <h3 className="font-heading font-semibold text-sm uppercase tracking-wider text-graphite mb-3">Marque</h3>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setSelectedBrand('')}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${!selectedBrand ? 'bg-amber-accent/10 text-amber-accent font-medium' : 'text-steel hover:bg-mineral'}`}
                    >
                      Toutes les marques
                    </button>
                    {brands.map(brand => (
                      <button
                        key={brand}
                        onClick={() => setSelectedBrand(brand)}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${selectedBrand === brand ? 'bg-amber-accent/10 text-amber-accent font-medium' : 'text-steel hover:bg-mineral'}`}
                      >
                        {brand}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Mobile filters drawer */}
          {showFilters && (
            <div className="fixed inset-0 z-50 md:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-heading font-semibold text-lg">Filtres</h3>
                  <button onClick={() => setShowFilters(false)}><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Catégorie</h4>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => { setSelectedCategory(''); setShowFilters(false); }} className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${!selectedCategory ? 'bg-amber-accent text-white border-amber-accent' : 'border-gray-200 text-steel'}`}>Toutes</button>
                      {categories.map(cat => (
                        <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setShowFilters(false); }} className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${selectedCategory === cat.id ? 'bg-amber-accent text-white border-amber-accent' : 'border-gray-200 text-steel'}`}>{cat.name}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1">
            <p className="text-sm text-steel mb-6">{filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''} trouvé{filteredProducts.length > 1 ? 's' : ''}</p>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-steel text-lg mb-2">Aucun produit ne correspond à votre recherche.</p>
                <p className="text-sm text-steel/70 mb-4">Essayez une autre référence ou contactez notre équipe.</p>
                <Link to="/contact" className="inline-flex items-center gap-2 text-amber-accent font-medium">
                  Demander de l'aide <ArrowRight size={14} />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                    className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <Link to={`/produits/${product.slug}`} className="block relative overflow-hidden aspect-[4/3]">
                      <img src={product.image} alt={product.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {product.badge && (
                        <span className="absolute top-3 left-3 px-2 py-1 bg-amber-accent text-white text-xs font-medium rounded">{product.badge}</span>
                      )}
                    </Link>
                    <div className="p-4">
                      <p className="text-xs text-steel uppercase tracking-wider mb-1">{categories.find(c => c.id === product.categoryId)?.name}</p>
                      <Link to={`/produits/${product.slug}`}>
                        <h3 className="font-heading font-semibold text-graphite group-hover:text-amber-accent transition-colors">{product.name}</h3>
                      </Link>
                      <p className="text-xs text-steel mt-1 line-clamp-2">{product.shortDescription}</p>
                      {product.variants.length > 0 && (
                        <p className="text-xs text-steel mt-1.5">{product.variants.slice(0, 3).map(v => v.label).join(' • ')}{product.variants.length > 3 ? '...' : ''}</p>
                      )}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => addItem(product)}
                          className="flex-1 py-2 text-xs font-medium text-amber-accent border border-amber-accent/30 rounded-md hover:bg-amber-accent hover:text-white transition-colors"
                        >
                          Ajouter au devis
                        </button>
                        <Link to={`/produits/${product.slug}`} className="py-2 px-3 text-xs font-medium text-graphite border border-gray-200 rounded-md hover:bg-gray-50 transition-colors">
                          Voir
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
