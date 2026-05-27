import { useEffect, useState } from 'react';
import { Wrench, ShoppingCart, Layers, Wind } from 'lucide-react';

const services = [
  {
    icon: Wrench,
    title: 'Climatisation & Réparation',
    desc: 'Installation et dépannage de tous types de climatiseurs — split, cassette, gainable. Nous intervenons rapidement pour remettre vos équipements en parfait état.',
    image:
      'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-cyan-500 to-sky-600',
  },
  {
    icon: ShoppingCart,
    title: 'Vente & Service Après-Pose',
    desc: 'Nous vous accompagnons de l\'achat à l\'entretien. Notre service après-pose garantit la longévité et les performances optimales de vos installations.',
    image:
      'https://images.pexels.com/photos/3736096/pexels-photo-3736096.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-sky-500 to-blue-600',
  },
  {
    icon: Layers,
    title: 'Isolation Thermique',
    desc: 'Réduisez votre consommation d\'énergie grâce à nos solutions d\'isolation thermique sur mesure. Confort amélioré et factures réduites.',
    image:
      'https://images.pexels.com/photos/1108117/pexels-photo-1108117.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-teal-500 to-cyan-600',
  },
  {
    icon: Wind,
    title: 'Gaines de Ventilation',
    desc: 'Fabrication sur mesure de gaines de ventilation en Tôle Galvanisée et en Pir-alu. Des solutions adaptées à tous vos projets industriels et résidentiels.',
    image:
      'https://images.pexels.com/photos/2760241/pexels-photo-2760241.jpeg?auto=compress&cs=tinysrgb&w=600',
    color: 'from-blue-500 to-sky-600',
  },
];

export default function Services() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShowContent(true), 1200);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section id="services" className="relative py-24 overflow-hidden">
      <div
        className={`relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-700 motion-reduce:transition-none ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-cyan-600 font-semibold text-sm uppercase tracking-widest">
            Ce que nous faisons
          </span>
          <h2 className="mt-2 text-4xl lg:text-5xl font-black text-slate-900">
            Nos Services de{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-600">
              Haute Qualité
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto text-lg">
            Besoin d'une solution efficace pour votre climatisation ? Nous mettons notre expertise
            à votre service.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="group bg-white/10 backdrop-blur-sm border border-white/25 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-2"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${svc.color} opacity-25`} />
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug">
                    {svc.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{svc.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
