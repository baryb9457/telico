import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

const contactInfo = [
  {
    icon: Phone,
    label: 'Téléphone',
    value: '613 51 76 53 / 662 73 20 38',
    href: 'tel:+224613517653',
  },
  {
    icon: Mail,
    label: 'E-mail',
    value: 'telicofroid.sarlu@gmail.com',
    href: 'mailto:telicofroid.sarlu@gmail.com',
  },
  {
    icon: MapPin,
    label: 'Adresse',
    value: 'Sonfonia T7, Conakry, Guinée',
    href: '#',
  },
  {
    icon: Clock,
    label: 'Disponibilité',
    value: 'Lun – Sam : 8h – 18h',
    href: '#',
  },
];

const subjects = [
  'Demande de devis',
  'Installation climatiseur',
  'Réparation / Dépannage',
  'Isolation thermique',
  'Gaine de ventilation',
  'Autre demande',
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Demande de devis',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setError('Veuillez renseigner votre nom et votre message.');
      return;
    }
    setSubmitting(true);
    setError('');
    const payload = {
      ...form,
      subject: form.subject?.trim() || 'Demande de devis',
    };
    const { error: err } = await supabase.from('contact_requests').insert([payload]);
    setSubmitting(false);
    if (err) {
      setError('Une erreur est survenue. Veuillez réessayer ou nous appeler directement.');
    } else {
      setSubmitted(true);
      setForm({
        name: '',
        email: '',
        phone: '',
        subject: 'Demande de devis',
        message: '',
      });
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-cyan-400 font-semibold text-sm uppercase tracking-widest">
            Prenons contact
          </span>
          <h2 className="mt-2 text-4xl lg:text-5xl font-black text-white">
            Contactez-nous{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
              dès aujourd'hui
            </span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-xl mx-auto">
            Obtenez votre devis gratuit en quelques minutes. Notre équipe vous répond rapidement.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((info) => {
              const Icon = info.icon;
              return (
                <a
                  key={info.label}
                  href={info.href}
                  className="flex items-start gap-4 bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-cyan-500/50 transition-all group"
                >
                  <div className="w-11 h-11 bg-cyan-500/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-0.5">{info.label}</p>
                    <p className="text-white font-semibold">{info.value}</p>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Form */}
          <div className="lg:col-span-3 bg-slate-800 rounded-3xl p-8 border border-slate-700">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-white mb-2">Message envoyé !</h3>
                <p className="text-gray-400">
                  Nous avons bien reçu votre demande et vous contacterons très prochainement.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Mamadou Diallo"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-gray-500 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+224 6XX XX XX XX"
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-gray-500 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="votre@email.com"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-gray-500 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Sujet
                  </label>
                  <select
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition"
                  >
                    {subjects.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Décrivez votre besoin en détail..."
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-gray-500 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition resize-none"
                  />
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-lg"
                >
                  <Send className="w-5 h-5" />
                  {submitting ? 'Envoi en cours...' : 'Envoyer ma demande'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
