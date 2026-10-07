import { motion } from 'framer-motion';
import { Award, Target, Users, MapPin, Shield } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="pt-24 pb-20 min-h-screen">
      {/* Hero */}
      <section className="relative py-20 md:py-32 bg-graphite text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1920&q=80" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Plus de 30 ans à construire la confiance.</h1>
            <p className="text-white/70 text-lg">Depuis 1995, SOREMAC SARL accompagne les constructeurs du Bénin avec des matériaux de qualité et un service de proximité.</p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-heading text-3xl font-bold text-graphite mb-12 text-center">Notre histoire</h2>
          <div className="max-w-2xl mx-auto">
            {[
              { year: '1995', title: 'Création', desc: 'Fondation de la Société REDA de Matériaux de Construction et de Ciment.' },
              { year: '2008', title: 'Nouvelle immatriculation', desc: 'Immatriculation officielle RCCM RB/COT/2008-B3899. Capital : 150 000 000 FCFA.' },
              { year: "Aujourd'hui", title: 'Distribution de matériaux et équipements', desc: 'Plus de 31 ans d\'expertise au service des constructeurs du Bénin. Large gamme de produits et services.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex gap-6 mb-10 last:mb-0"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-amber-accent text-white flex items-center justify-center font-heading font-bold text-sm">{item.year.length <= 4 ? item.year : '●'}</div>
                  {i < 2 && <div className="w-px h-full bg-gray-200 mt-2" />}
                </div>
                <div className="pb-8">
                  <p className="text-xs text-amber-accent font-medium uppercase tracking-wider mb-1">{item.year}</p>
                  <h3 className="font-heading font-semibold text-lg text-graphite mb-1">{item.title}</h3>
                  <p className="text-steel text-sm">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-mineral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="font-heading text-3xl font-bold text-graphite mb-12 text-center">Ce qui nous définit</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Target size={24} />, title: 'Mission', desc: 'Fournir aux constructeurs du Bénin des matériaux de qualité, en détail comme en gros, avec un accompagnement personnalisé.' },
              { icon: <Users size={24} />, title: 'Valeurs', desc: 'Confiance, qualité, proximité et réactivité. Chaque client est un partenaire de long terme.' },
              { icon: <Award size={24} />, title: 'Expertise', desc: 'Plus de 31 ans dans la distribution de matériaux de construction. Une connaissance approfondie du marché local.' },
              { icon: <MapPin size={24} />, title: 'Localisation', desc: 'Implantation stratégique à Vedoko, Agontinkon, Cotonou. Accessible et bien desservie.' },
              { icon: <Shield size={24} />, title: 'Qualité', desc: 'Sélection rigoureuse des produits et des marques. Authenticité garantie pour chaque référence.' },
              { icon: <Award size={24} />, title: 'Engagement', desc: 'Un service commercial réactif, des conseils techniques et une livraison fiable à Cotonou et environs.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="p-6 bg-white rounded-xl border border-gray-100"
              >
                <span className="text-amber-accent mb-3 block">{item.icon}</span>
                <h3 className="font-heading font-semibold text-graphite mb-2">{item.title}</h3>
                <p className="text-sm text-steel leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
