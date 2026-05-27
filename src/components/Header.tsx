import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import logoEntreprise from '../../image/logo_entreprise.jpeg';

const navLinks = [
  { href: '#accueil', label: 'Accueil' },
  { href: '#services', label: 'Services' },
  { href: '#pourquoi-nous', label: 'Pourquoi nous' },
  { href: '#blog', label: 'Activités' },
  { href: '#temoignages', label: 'Témoignages' },
  { href: '#contact', label: 'Contact' },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const handleNav = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-slate-900 shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src={logoEntreprise}
              alt="Logo TELICO FROID"
              className="w-11 h-11 rounded-full object-cover border border-cyan-400/40"
            />
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-white font-bold text-lg leading-tight">TELICO FROID</span>
                <span className="text-cyan-400/70 text-xs font-bold tracking-wider">STFG</span>
              </div>
              <span className="text-cyan-400 text-xs tracking-widest uppercase">Guinée</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="text-gray-300 hover:text-cyan-400 transition-colors text-sm font-medium"
              >
                {link.label}
              </button>
            ))}
            <a
              href="/admin"
              className="text-gray-200 hover:text-cyan-400 transition-colors text-sm font-semibold"
            >
              Admin
            </a>
          </nav>

          {/* CTA */}
          <a
            href="tel:+224613517653"
            className="hidden md:flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors"
          >
            <Phone className="w-4 h-4" />
            Devis gratuit
          </a>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setOpen(!open)}
            aria-label="Menu"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-slate-900 border-t border-slate-700 px-4 pb-6">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="block w-full text-left text-gray-300 hover:text-cyan-400 py-3 text-base border-b border-slate-800 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <a
            href="tel:+224613517653"
            className="mt-4 flex items-center justify-center gap-2 bg-cyan-500 text-white px-4 py-3 rounded-full font-semibold"
          >
            <Phone className="w-4 h-4" />
            Appeler maintenant
          </a>
          <a
            href="/admin"
            className="mt-3 flex items-center justify-center border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 hover:border-cyan-400 px-4 py-2.5 rounded-full font-semibold transition-colors"
          >
            Espace admin
          </a>
        </div>
      )}
    </header>
  );
}
