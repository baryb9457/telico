import { useEffect, useState } from 'react';
import { Star, CheckCircle, XCircle, Trash2, RefreshCw } from 'lucide-react';
import { supabase, type Testimonial } from '../lib/supabase';

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
    setTestimonials(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const toggleApprove = async (t: Testimonial) => {
    await supabase.from('testimonials').update({ approved: !t.approved }).eq('id', t.id);
    setTestimonials((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, approved: !t.approved } : x))
    );
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Supprimer ce témoignage ?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    setTestimonials((prev) => prev.filter((t) => t.id !== id));
  };

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  const pending = testimonials.filter((t) => !t.approved).length;
  const approved = testimonials.filter((t) => t.approved).length;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-slate-800 rounded-2xl p-4 border border-amber-500/30">
          <p className="text-amber-400 text-sm">Non publies</p>
          <p className="text-3xl font-black text-white mt-1">{pending}</p>
        </div>
        <div className="bg-slate-800 rounded-2xl p-4 border border-green-500/30">
          <p className="text-green-400 text-sm">Approuvés</p>
          <p className="text-3xl font-black text-white mt-1">{approved}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Témoignages ({testimonials.length})</h2>
        <button onClick={load} className="text-gray-400 hover:text-cyan-400 transition-colors">
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-2xl h-28 animate-pulse" />
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Star className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Aucun témoignage pour le moment.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Pending first */}
          {[...testimonials]
            .sort((a, b) => (a.approved === b.approved ? 0 : a.approved ? 1 : -1))
            .map((t) => (
              <div
                key={t.id}
                className={`bg-slate-800 rounded-2xl p-5 border transition-all ${
                  t.approved ? 'border-slate-700' : 'border-amber-500/40'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="text-white font-semibold">{t.client_name}</span>
                      {t.client_role && (
                        <span className="text-gray-400 text-sm">{t.client_role}</span>
                      )}
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full border ${
                          t.approved
                            ? 'bg-green-500/10 text-green-400 border-green-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {t.approved ? 'Publie' : 'Non publie'}
                      </span>
                    </div>
                    {/* Stars */}
                    <div className="flex gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2 italic">"{t.content}"</p>
                    <p className="text-gray-600 text-xs mt-2">{fmt(t.created_at)}</p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleApprove(t)}
                      title={t.approved ? 'Désapprouver' : 'Approuver'}
                      className={`p-2 rounded-xl transition-colors ${
                        t.approved
                          ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                          : 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                      }`}
                    >
                      {t.approved ? (
                        <XCircle className="w-5 h-5" />
                      ) : (
                        <CheckCircle className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => deleteTestimonial(t.id)}
                      title="Supprimer ce commentaire"
                      className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
