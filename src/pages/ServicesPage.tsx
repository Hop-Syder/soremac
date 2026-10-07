import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Truck, Headphones, FileText, CreditCard, Users, ArrowRight, MessageCircle } from 'lucide-react';

export default function ServicesPage() {
  const services = [
    {
      icon: <ShoppingBag size={32} />,
      title: 'Vente & distribution',
      desc: 'Vente au détail et en gros de matériaux de construction, équipements et finitions. Large gamme disponible en stock pour répondre à tous vos besoins de chantier.',
      features: ['Vente au détail', 'Vente en gros', 'Stock permanent', 'Large gamme'],
    },
    {
      icon: <Truck size={32} />,
      title: 'Livraison',
      desc: 'Livraison assurée à Cotonou et environs selon les conditions commerciales en vigueur. Nous acheminons vos matériaux directement sur votre chantier.',
      features: ['Cotonou et environs', 'Livraison sur chantier', 'Conditions commerciales adaptées'],
    },
    {
      icon: <Headphones size={32} />,
      title: 'Conseil technique',
      desc: 'Notre équipe vous accompagne dans le choix des matériaux adaptés à votre projet. Bénéficiez de recommandations personnalisées selon vos besoins.',
      features: ['Choix des matériaux', 'Recommandations personnalisées', 'Assistance technique'],
    },
    {
      icon: <FileText size={32} />,
      title: 'Demande de devis',
      desc: 'Demandez votre devis par téléphone, WhatsApp ou email. Notre équipe traite votre demande rapidement et vous propose les meilleures options.',
      features: ['Par téléphone', 'Par WhatsApp', 'Par email', 'Réponse rapide'],
    },
    {
      icon: <CreditCard size={32} />,
      title: 'Paiement',
      desc: 'Plusieurs modes de paiement acceptés pour votre convenance. Payez selon ce qui vous arrange le mieux.',
      features: ['Comptant', 'Chèque', 'Mobile Money'],
    },
    {
      icon: <Users size={32} />,
      title: 'Accompagnement',
      desc: 'Que vous soyez particulier, entrepreneur BTP ou promoteur immobilier, nous adaptons notre service à votre profil et à l\'ampleur de votre projet.',
      features: ['Particuliers', 'Entreprises BTP', 'Promoteurs', 'Institutions'],
    },
  ];

  return (
    <main className="pt-24 pb-20 min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-graphite text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Plus que des matériaux.<br />Un accompagnement.</h1>
            <p className="text-white/70 text-lg max-w-xl">SOREMAC ne se limite pas à la vente. Nous vous accompagnons à chaque étape de votre projet de construction.</p>
          </motion.div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="p-8 rounded-xl border border-gray-100 hover:border-amber-accent/30 transition-colors"
              >
                <span className="text-amber-accent mb-4 block">{service.icon}</span>
                <h2 className="font-heading text-xl font-bold text-graphite mb-3">{service.title}</h2>
                <p className="text-steel leading-relaxed mb-4">{service.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {service.features.map((f, j) => (
                    <span key={j} className="px-3 py-1 bg-mineral text-xs font-medium text-graphite rounded-full">{f}</span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-mineral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-2xl md:text-3xl font-bold text-graphite mb-4">Besoin d'un service ?</h2>
          <p className="text-steel mb-8 max-w-md mx-auto">Contactez-nous pour toute demande. Notre équipe est à votre disposition.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-accent hover:bg-amber-hover text-white font-medium rounded-lg transition-colors">
              Nous contacter <ArrowRight size={16} />
            </Link>
            <a href="https://wa.me/22952140000" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
              <MessageCircle size={18} /> WhatsApp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
