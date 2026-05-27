import { Award, Settings, Headphones as HeadphonesIcon, MapPin } from 'lucide-react';

const reasons = [
  {
    icon: Award,
    title: 'Expertise reconnue',
    desc: 'Entreprise officiellement enregistrée (NIF : 102639457 – RCCM : GN.TCC.2026.B.02875). Une structure sérieuse à votre service.',
  },
  {
    icon: Settings,
    title: 'Solutions sur mesure',
    desc: 'Fabrications et installations adaptées à vos besoins spécifiques, qu\'il s\'agisse de résidentiel, commercial ou industriel.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Disponibilité totale',
    desc: 'Une équipe réactive à votre écoute pour garantir la longévité de vos installations et résoudre tout problème rapidement.',
  },
  {
    icon: MapPin,
    title: 'Ancrage local',
    desc: 'Basés à Sonfonia T7, Conakry, nous connaissons le terrain et les contraintes climatiques locales mieux que quiconque.',
  },
];

export default function WhyUs() {
  return (
    <section id="pourquoi-nous" className="py-24 bg-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
        <div className="w-full h-full bg-gradient-to-l from-cyan-500 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - text */}
          <div>
            <span className="text-cyan-400 font-semibold text-sm uppercase tracking-widest">
              Notre différence
            </span>
            <h2 className="mt-2 text-4xl lg:text-5xl font-black text-white leading-tight">
              Pourquoi choisir
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
                TELICO FROID ?
              </span>
            </h2>
            <p className="mt-6 text-gray-400 text-lg leading-relaxed">
              Depuis notre création, nous avons fait de la satisfaction client notre priorité
              absolue. Chaque installation, chaque réparation est réalisée avec le plus grand soin.
            </p>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-8 inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-full font-semibold transition-all hover:scale-105"
            >
              Nous contacter
            </a>
          </div>

          {/* Right - reasons grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {reasons.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.title}
                  className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-cyan-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-cyan-500/20 transition-colors">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{r.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{r.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA banner */}
        <div className="mt-20 bg-gradient-to-r from-cyan-500 to-sky-600 rounded-3xl p-8 sm:p-12 text-center">
          <h3 className="text-2xl sm:text-3xl font-black text-white mb-3">
            Ne laissez pas la chaleur gâcher votre quotidien
          </h3>
          <p className="text-cyan-100 mb-6 text-lg">
            Demandez votre devis gratuit dès aujourd'hui !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="tel:+224613517653"
              className="bg-white text-cyan-600 font-bold px-8 py-3 rounded-full hover:bg-cyan-50 transition-colors"
            >
              613 51 76 53
            </a>
            <a
              href="tel:+224662732038"
              className="bg-white/20 text-white font-bold px-8 py-3 rounded-full hover:bg-white/30 transition-colors border border-white/30"
            >
              662 73 20 38
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
