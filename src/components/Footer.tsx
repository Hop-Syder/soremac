import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-graphite text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 - Brand */}
          <div className="lg:col-span-1">
            <div className="font-heading font-bold text-2xl text-white mb-4">SOREMAC</div>
            <p className="text-sm leading-relaxed text-white/60 mb-6">
              Matériaux de construction, équipements et solutions pour vos projets au Bénin. Depuis 1995.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://wa.me/22952140000" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-600 transition-colors">
                <MessageCircle size={16} />
              </a>
            </div>
          </div>

          {/* Col 2 - Entreprise */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">Entreprise</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Accueil', path: '/' },
                { label: 'À propos', path: '/a-propos' },
                { label: 'Services', path: '/services' },
                { label: 'Conseils', path: '/conseils' },
                { label: 'Contact', path: '/contact' },
              ].map(link => (
                <li key={link.path}>
                  <Link to={link.path} className="text-sm text-white/60 hover:text-amber-accent transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Produits */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">Produits</h4>
            <ul className="space-y-2.5">
              {[
                'Acier & Fer', 'Cimenterie', 'Maçonnerie', 'Toiture', 'Carrelage',
                'Plomberie', 'Sanitaire', 'Électricité', 'Peinture', 'Quincaillerie'
              ].map(cat => (
                <li key={cat}>
                  <Link to="/produits" className="text-sm text-white/60 hover:text-amber-accent transition-colors">{cat}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 - Contact */}
          <div>
            <h4 className="font-heading font-semibold text-white text-sm uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Phone size={14} className="mt-0.5 shrink-0" />
                <a href="tel:+22952140000" className="hover:text-white transition-colors">+229 52 14 00 00</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MessageCircle size={14} className="mt-0.5 shrink-0" />
                <a href="https://wa.me/22952140000" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <Mail size={14} className="mt-0.5 shrink-0" />
                <span>contact@soremac.bj</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-white/60">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>Vedoko, Quartier Agontinkon<br />Cotonou, Bénin</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-white/40">
            © {new Date().getFullYear()} SOREMAC SARL. Tous droits réservés.
          </div>
          <div className="flex items-center gap-6 text-xs text-white/40">
            <span>RCCM RB/COT/2008-B3899</span>
            <span>IFU 3200700012811</span>
            <a href="#" className="hover:text-white/70 transition-colors">Mentions légales</a>
            <a href="#" className="hover:text-white/70 transition-colors">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
