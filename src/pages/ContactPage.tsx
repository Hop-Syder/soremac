import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MessageCircle, Mail, MapPin, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pt-24 pb-20 min-h-screen">
      {/* Hero */}
      <section className="py-16 md:py-24 bg-graphite text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4">Parlons de votre projet.</h1>
            <p className="text-white/70 text-lg max-w-xl">Contactez-nous par téléphone, WhatsApp ou email. Notre équipe vous répond rapidement.</p>
          </motion.div>
        </div>
      </section>

      {/* Contact content */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left - Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h2 className="font-heading text-2xl font-bold text-graphite mb-8">Nos coordonnées</h2>
              <div className="space-y-6">
                <a href="tel:+22952140000" className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-amber-accent/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-amber-accent/10 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-amber-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-graphite">Téléphone</p>
                    <p className="text-steel text-sm">+229 52 14 00 00</p>
                  </div>
                </a>

                <a href="https://wa.me/22952140000" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-green-500/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-green-600/10 flex items-center justify-center shrink-0">
                    <MessageCircle size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-graphite">WhatsApp</p>
                    <p className="text-steel text-sm">+229 52 14 00 00</p>
                  </div>
                </a>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-amber-accent/10 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-amber-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-graphite">Email</p>
                    <p className="text-steel text-sm">contact@soremac.bj</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-amber-accent/10 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-amber-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-graphite">Adresse</p>
                    <p className="text-steel text-sm">Vedoko — Quartier Agontinkon<br />Voie quittant Étoile vers Toyota, à gauche<br />Carré : 1304/M — Cotonou, Bénin</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-amber-accent/10 flex items-center justify-center shrink-0">
                    <Clock size={18} className="text-amber-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-graphite">Horaires</p>
                    <p className="text-steel text-sm">
                      Lun – Ven : 08h00–13h00 & 15h00–18h00<br />
                      Samedi : 08h00–13h00<br />
                      Dimanche : Fermé
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right - Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <h2 className="font-heading text-2xl font-bold text-graphite mb-8">Envoyez-nous un message</h2>
              {submitted ? (
                <div className="p-8 bg-green-50 border border-green-200 rounded-xl text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send size={20} className="text-green-600" />
                  </div>
                  <h3 className="font-heading font-semibold text-graphite mb-2">Message envoyé !</h3>
                  <p className="text-steel text-sm">Notre équipe vous répondra dans les plus brefs délais.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-graphite mb-1.5">Nom *</label>
                      <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-accent focus:ring-1 focus:ring-amber-accent/20" placeholder="Votre nom" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-graphite mb-1.5">Téléphone *</label>
                      <input type="tel" required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-accent focus:ring-1 focus:ring-amber-accent/20" placeholder="+229 XX XX XX XX" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-graphite mb-1.5">Email</label>
                      <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-accent focus:ring-1 focus:ring-amber-accent/20" placeholder="votre@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-graphite mb-1.5">Entreprise</label>
                      <input type="text" value={form.company} onChange={e => setForm({...form, company: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-accent focus:ring-1 focus:ring-amber-accent/20" placeholder="Nom de l'entreprise (optionnel)" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-graphite mb-1.5">Objet *</label>
                    <input type="text" required value={form.subject} onChange={e => setForm({...form, subject: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-accent focus:ring-1 focus:ring-amber-accent/20" placeholder="Demande de devis, information produit..." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-graphite mb-1.5">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-amber-accent focus:ring-1 focus:ring-amber-accent/20 resize-none" placeholder="Décrivez votre besoin..." />
                  </div>
                  <button type="submit" className="w-full py-3.5 bg-amber-accent hover:bg-amber-hover text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2">
                    <Send size={16} /> Envoyer ma demande
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-mineral">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
          <div className="aspect-video rounded-xl overflow-hidden bg-gray-200">
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
        </div>
      </section>
    </main>
  );
}
