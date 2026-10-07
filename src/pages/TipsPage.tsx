import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Clock } from 'lucide-react';

const articles = [
  {
    slug: 'comment-choisir-fer-beton',
    title: 'Comment choisir son fer à béton ?',
    excerpt: 'Fe400 ou Fe500 ? Quel diamètre pour quelle structure ? Guide pratique pour bien choisir vos fers à béton.',
    category: 'Acier & Fer',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80',
  },
  {
    slug: 'fe400-vs-fe500',
    title: 'Fe400 ou Fe500 : quelle différence ?',
    excerpt: 'Comprendre les grades d\'acier et choisir le bon fer selon la structure de votre construction.',
    category: 'Acier & Fer',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=600&q=80',
  },
  {
    slug: 'comment-choisir-carrelage',
    title: 'Comment choisir ses carreaux ?',
    excerpt: 'Grès cérame, céramique, format, finition... Les critères essentiels pour bien choisir votre carrelage.',
    category: 'Carrelage',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?w=600&q=80',
  },
  {
    slug: 'quel-ciment-choisir',
    title: 'Quel ciment choisir pour son chantier ?',
    excerpt: 'CPJ, CPR, CPM... Comprendre les types de ciment et choisir celui adapté à vos travaux.',
    category: 'Cimenterie',
    readTime: '5 min',
    image: 'https://images.unsplash.com/photo-1590725121839-892b45745d42?w=600&q=80',
  },
  {
    slug: 'comment-choisir-tole',
    title: 'Comment choisir une tôle de toiture ?',
    excerpt: 'Aluminium, galvanisée, bac ou ondulée... Guide pour choisir la bonne couverture.',
    category: 'Toiture',
    readTime: '4 min',
    image: 'https://images.unsplash.com/photo-1632759145354-ed692484c06a?w=600&q=80',
  },
  {
    slug: '5-erreurs-a-eviter',
    title: '5 erreurs à éviter avant d\'acheter vos matériaux',
    excerpt: 'Les pièges courants lors de l\'achat de matériaux de construction et comment les éviter.',
    category: 'Conseils généraux',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1590725140246-20acdee442be?w=600&q=80',
  },
];

export default function TipsPage() {
  return (
    <main className="pt-24 pb-20 min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-graphite text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Conseils & guides</h1>
            <p className="text-white/70 text-lg max-w-xl">Des informations pratiques pour vous aider à choisir les bons matériaux pour vos projets de construction.</p>
          </motion.div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, i) => (
              <motion.article
                key={article.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium text-amber-accent uppercase tracking-wider">{article.category}</span>
                    <span className="flex items-center gap-1 text-xs text-steel">
                      <Clock size={12} /> {article.readTime}
                    </span>
                  </div>
                  <h2 className="font-heading font-semibold text-lg text-graphite group-hover:text-amber-accent transition-colors mb-2">{article.title}</h2>
                  <p className="text-sm text-steel line-clamp-2 mb-4">{article.excerpt}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-amber-accent">
                    Lire l'article <ArrowRight size={14} />
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-mineral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="font-heading text-2xl font-bold text-graphite mb-3">Besoin d'un conseil personnalisé ?</h2>
          <p className="text-steel mb-6">Notre équipe est à votre disposition pour vous orienter dans vos choix.</p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-amber-accent hover:bg-amber-hover text-white font-medium rounded-lg transition-colors">
            Nous contacter <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}
