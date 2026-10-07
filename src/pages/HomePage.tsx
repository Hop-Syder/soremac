import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, FileText, Clock, Truck, Headphones, Award, Shield, MapPin, CheckCircle } from 'lucide-react';
import { categories, getFeaturedProducts } from '../data/products';
import { useQuote } from '../context/QuoteContext';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: 'easeOut' } })
};

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const { addItem, setIsOpen } = useQuote();

  return (
    <main>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80"
            alt="Chantier de construction"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-graphite/90 via-graphite/70 to-graphite/40" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-32 md:py-40">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.span variants={fadeUp} custom={0} className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs font-medium text-white/90 tracking-wider uppercase mb-6">
              Matériaux • Équipements • Solutions BTP
            </motion.span>
            <motion.h1 variants={fadeUp} custom={1} className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6">
              Tout ce qu'il faut<br />pour construire.<br /><span className="text-amber-accent">Un seul partenaire.</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-white/70 max-w-lg mb-8 leading-relaxed">
              Découvrez notre catalogue de matériaux, équipements et solutions pour vos projets de construction à Cotonou et au Bénin.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap items-center gap-4">
              <Link to="/produits" className="inline-flex items-center gap-2 px-6 py-3.5 bg-amber-accent hover:bg-amber-hover text-white font-medium rounded-lg transition-colors">
                Explorer le catalogue <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-medium rounded-lg hover:bg-white/20 transition-colors">
                <FileText size={18} /> Demander un devis
              </Link>
              <a href="https://wa.me/22952140000" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors">
                <MessageCircle size={16} /> Parler sur WhatsApp
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* REASSURANCE BAND */}
      <section className="bg-graphite py-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: <Award size={20} />, text: '31+ ans d\'expérience' },
              { icon: <CheckCircle size={20} />, text: 'Vente détail & gros' },
              { icon: <Truck size={20} />, text: 'Livraison à Cotonou' },
              { icon: <Headphones size={20} />, text: 'Conseil technique' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-center gap-3 text-white/80"
              >
                <span className="text-amber-accent">{item.icon}</span>
                <span className="text-sm font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-graphite mb-3">Tout pour votre chantier.</h2>
            <p className="text-steel text-lg max-w-xl">Du gros œuvre aux finitions, trouvez rapidement les matériaux et équipements adaptés à votre projet.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Link
                  to={`/produits?category=${cat.id}`}
                  className={`group relative overflow-hidden rounded-xl border border-gray-100 hover:border-amber-accent/30 transition-all duration-300 ${
                    i === 0 || i === 3 ? 'sm:col-span-2 sm:row-span-1' : ''
                  }`}
                >
                  <div className="p-6 md:p-8">
                    <span className="text-3xl mb-3 block">{cat.icon}</span>
                    <h3 className="font-heading font-semibold text-lg text-graphite group-hover:text-amber-accent transition-colors">{cat.name}</h3>
                    <p className="text-sm text-steel mt-1.5 line-clamp-2">{cat.description}</p>
                    <div className="flex items-center gap-1 mt-4 text-sm font-medium text-amber-accent opacity-0 group-hover:opacity-100 transition-opacity">
                      Voir les produits <ArrowRight size={14} />
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 text-xs font-medium text-steel bg-mineral px-2 py-1 rounded">
                    {cat.productCount} produits
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 md:py-28 bg-mineral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-end justify-between mb-14">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-graphite mb-3">Les produits recherchés.</h2>
              <p className="text-steel text-lg">Les références les plus demandées par nos clients.</p>
            </div>
            <Link to="/produits" className="hidden md:inline-flex items-center gap-2 text-amber-accent font-medium hover:underline">
              Tout le catalogue <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.slice(0, 8).map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
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
                  {product.variants.length > 0 && (
                    <p className="text-xs text-steel mt-1.5">{product.variants.slice(0, 3).map(v => v.label).join(' • ')}{product.variants.length > 3 ? '...' : ''}</p>
                  )}
                  <div className="flex items-center gap-2 mt-3">
                    <button
                      onClick={() => { addItem(product); }}
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
          <div className="mt-8 text-center md:hidden">
            <Link to="/produits" className="inline-flex items-center gap-2 text-amber-accent font-medium">
              Tout le catalogue <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* PROFILES */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14 text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-graphite mb-3">Un catalogue pensé pour vous.</h2>
            <p className="text-steel text-lg max-w-xl mx-auto">Quel que soit votre projet, nous avons les matériaux qu'il vous faut.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Vous construisez votre maison ?', desc: 'Matériaux pour gros œuvre, toiture, plomberie, sanitaire et finition.', cta: 'Voir les produits', link: '/produits' },
              { title: 'Vous êtes entrepreneur BTP ?', desc: 'Achetez en détail ou en gros selon vos besoins de chantier.', cta: 'Explorer le catalogue', link: '/produits' },
              { title: 'Vous êtes promoteur ou entreprise ?', desc: 'Centralisez vos besoins et demandez un devis personnalisé.', cta: 'Parler à SOREMAC', link: '/contact' },
            ].map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="p-8 rounded-xl border border-gray-100 hover:border-amber-accent/30 bg-mineral/50 hover:bg-white transition-all duration-300"
              >
                <h3 className="font-heading font-semibold text-xl text-graphite mb-3">{card.title}</h3>
                <p className="text-steel text-sm leading-relaxed mb-5">{card.desc}</p>
                <Link to={card.link} className="inline-flex items-center gap-2 text-amber-accent font-medium text-sm hover:underline">
                  {card.cta} <ArrowRight size={14} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY SOREMAC */}
      <section className="py-20 md:py-28 bg-graphite text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-3">L'expérience qui accompagne vos projets.</h2>
            <p className="text-white/60 text-lg max-w-xl">Depuis 1995, SOREMAC est le partenaire de confiance des constructeurs au Bénin.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { icon: <Clock size={24} />, title: 'Expérience', desc: 'Depuis 1995.' },
              { icon: <Award size={24} />, title: 'Large gamme', desc: 'Du gros œuvre aux finitions.' },
              { icon: <Headphones size={24} />, title: 'Conseil', desc: 'Assistance dans le choix des matériaux.' },
              { icon: <MapPin size={24} />, title: 'Proximité', desc: 'Implantation stratégique à Cotonou.' },
              { icon: <Shield size={24} />, title: 'Réactivité', desc: 'Contacts directs par téléphone, WhatsApp et email.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="p-6 rounded-xl bg-white/5 border border-white/10"
              >
                <span className="text-amber-accent mb-3 block">{item.icon}</span>
                <h3 className="font-heading font-semibold text-white mb-1.5">{item.title}</h3>
                <p className="text-sm text-white/60">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-14">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-graphite mb-3">Plus que des matériaux. Un accompagnement.</h2>
            <p className="text-steel text-lg max-w-xl">Nous vous accompagnons à chaque étape de votre projet.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <CheckCircle size={24} />, title: 'Vente & distribution', desc: 'Vente au détail et en gros de matériaux de construction.' },
              { icon: <Truck size={24} />, title: 'Livraison', desc: 'Livraison assurée à Cotonou et environs selon les conditions commerciales.' },
              { icon: <Headphones size={24} />, title: 'Conseil technique', desc: 'Aide au choix des matériaux adaptés à votre projet.' },
              { icon: <FileText size={24} />, title: 'Demande de devis', desc: 'Par téléphone, WhatsApp ou email. Réponse rapide.' },
              { icon: <Shield size={24} />, title: 'Paiement', desc: 'Comptant, chèque et Mobile Money acceptés.' },
              { icon: <Award size={24} />, title: 'Authenticité', desc: 'Produits sélectionnés et vérifiés pour votre sécurité.' },
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="flex gap-4 p-6 rounded-xl border border-gray-100 hover:border-amber-accent/30 transition-colors"
              >
                <span className="text-amber-accent shrink-0">{service.icon}</span>
                <div>
                  <h3 className="font-heading font-semibold text-graphite mb-1">{service.title}</h3>
                  <p className="text-sm text-steel">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section className="py-16 bg-mineral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-graphite mb-2">Des produits sélectionnés pour vos travaux.</h2>
            <p className="text-steel">Marques de confiance distribuées par SOREMAC.</p>
          </motion.div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {['SIKA', 'TOITUROL', 'CIMBENIN'].map((brand, i) => (
              <motion.div
                key={brand}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="font-heading font-bold text-2xl md:text-3xl text-graphite/30 hover:text-graphite transition-colors cursor-default"
              >
                {brand}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AUTHENTICITY */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center p-10 rounded-2xl border border-gray-100 bg-mineral/50"
          >
            <Shield size={32} className="text-amber-accent mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-graphite mb-3">Achetez avec confiance.</h2>
            <p className="text-steel leading-relaxed mb-4">
              SOREMAC privilégie la qualité des produits et l'authenticité des références distribuées.
            </p>
            <p className="text-sm text-graphite/70">
              <strong>TOITUROL</strong> — Exigez l'authenticité du produit.<br />
              <strong>Sika</strong> — Produits originaux garantis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-graphite mb-4">Retrouvez-nous à Cotonou.</h2>
              <div className="space-y-3 text-steel">
                <p className="flex items-start gap-2"><MapPin size={18} className="text-amber-accent mt-0.5 shrink-0" /> <span><strong className="text-graphite">Vedoko — Quartier Agontinkon</strong><br />Voie quittant Étoile vers Toyota, à gauche<br />Carré : 1304/M</span></p>
                <p className="text-sm mt-4"><strong className="text-graphite">Horaires :</strong><br />Lun–Ven : 08h00–13h00 & 15h00–18h00<br />Sam : 08h00–13h00<br />Dim : Fermé</p>
              </div>
              <a href="https://maps.google.com/?q=Vedoko+Agontinkon+Cotonou+Benin" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 bg-graphite text-white font-medium rounded-lg hover:bg-graphite-light transition-colors text-sm">
                <MapPin size={16} /> Ouvrir dans Google Maps
              </a>
            </div>
            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.5!2d2.42!3d6.37!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMjInMTIuMCJOIDLCsDI1JzEyLjAiRQ!5e0!3m2!1sfr!2sbj!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation SOREMAC"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA DEVIS */}
      <section className="py-20 md:py-28 bg-graphite text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-4">Votre besoin.<br />Notre équipe vous répond.</h2>
            <p className="text-white/60 text-lg max-w-xl mx-auto mb-10">
              Envoyez-nous votre liste de matériaux ou votre besoin. Notre équipe vous accompagne dans votre demande de devis.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button onClick={() => setIsOpen(true)} className="inline-flex items-center gap-2 px-8 py-4 bg-amber-accent hover:bg-amber-hover text-white font-medium rounded-lg transition-colors text-lg">
                <FileText size={20} /> Demander un devis
              </button>
              <a href="https://wa.me/22952140000" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors text-lg">
                <MessageCircle size={20} /> WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
