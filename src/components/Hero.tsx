import { ChevronDown, Snowflake, Shield, Wrench } from 'lucide-react';

const snowParticles = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 13) % 100,
  size: 2 + (i % 4),
  duration: 6 + (i % 6),
  delay: -(i * 0.6),
  drift: ((i % 5) - 2) * 18,
}));

export default function Hero() {
  const scrollToServices = () => {
    document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="accueil"
      className="hero-climate-bg relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Alternating backgrounds */}
      <div className="hero-bg-winter absolute inset-0" />
      <div className="hero-bg-sunny absolute inset-0" />

      {/* Sun glow */}
      <div className="hero-sun absolute -top-32 -right-20 w-80 h-80 rounded-full pointer-events-none" />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-cyan-900/60" />

      {/* Animated snowfall */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {snowParticles.map((flake, i) => (
          <span
            key={i}
            className="hero-snowflake absolute"
            style={{
              left: `${flake.left}%`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              ['--fall-duration' as string]: `${flake.duration}s`,
              ['--fall-delay' as string]: `${flake.delay}s`,
              ['--fall-drift' as string]: `${flake.drift}px`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 max-w-5xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 px-4 py-2 rounded-full text-sm font-medium mb-8 backdrop-blur-sm">
          <Snowflake className="w-4 h-4" />
          Expert en confort thermique en Guinée
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
          SOCIETE TELICO
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-sky-300">
            FROID GUINEE
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          La fraîcheur, c'est notre métier ! Installation, réparation et maintenance de
          climatisation à Conakry et partout en Guinée.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 hover:scale-105"
          >
            Demander un devis gratuit
          </a>
          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="border-2 border-white/30 hover:border-cyan-400 text-white hover:text-cyan-400 px-8 py-4 rounded-full font-bold text-lg transition-all duration-200 backdrop-blur-sm"
          >
            Nos services
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
          {[
            { icon: Wrench, value: '500+', label: 'Installations' },
            { icon: Shield, value: '100%', label: 'Garantie SAV' },
            { icon: Snowflake, value: '24h', label: 'Réponse rapide' },
          ].map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10"
            >
              <Icon className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="text-xs text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToServices}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-cyan-400 transition-colors animate-bounce"
        aria-label="Défiler vers le bas"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
}
