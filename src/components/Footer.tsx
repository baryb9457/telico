import { Snowflake, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-cyan-500 rounded-full p-2">
                <Snowflake className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-white font-black text-lg block leading-tight">
                  TELICO FROID
                </span>
                <span className="text-cyan-400 text-xs tracking-widest uppercase">Guinée</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-sm">
              La fraîcheur, c'est notre métier ! Spécialiste en climatisation, isolation thermique
              et fabrication de gaines de ventilation à Conakry, Guinée.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <p className="text-gray-500">
                <span className="text-gray-400">NIF :</span> 102639457
              </p>
              <p className="text-gray-500">
                <span className="text-gray-400">RCCM :</span> GN.TCC.2026.B.02875
              </p>
            </div>

          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Nos Services
            </h4>
            <ul className="space-y-2 text-sm">
              {[
                'Installation climatiseur',
                'Réparation & Dépannage',
                'Vente de climatiseurs',
                'Service après-pose',
                'Isolation thermique',
                'Gaines de ventilation',
              ].map((s) => (
                <li key={s} className="hover:text-cyan-400 transition-colors cursor-default">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <div>
                  <a href="tel:+224613517653" className="hover:text-cyan-400 transition-colors block">
                    +224 613 51 76 53
                  </a>
                  <a href="tel:+224662732038" className="hover:text-cyan-400 transition-colors block">
                    +224 662 73 20 38
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a
                  href="mailto:telicofroid.sarlu@gmail.com"
                  className="hover:text-cyan-400 transition-colors break-all"
                >
                  telicofroid.sarlu@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                <span>Sonfonia T7, Conakry, Guinée</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-3 text-sm">
          <p>
            &copy; {new Date().getFullYear()} SOCIETE TELICO FROID DE GUINEE — Tous droits
            réservés.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="/admin"
              className="text-gray-300 hover:text-cyan-300 transition-colors text-xs border border-slate-700 hover:border-cyan-500/40 px-3 py-1.5 rounded-full"
            >
              Espace admin
            </a>
            <p className="text-xs text-gray-400">
              Creer votre site web, avec{' '}
              <a
                href="https://aliou.netlify.app/"
                target="_blank"
                rel="noreferrer"
                className="text-cyan-300 hover:text-cyan-200 transition-colors font-semibold"
              >
                KAM Services
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
