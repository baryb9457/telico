import { useEffect, useState } from 'react';
import { Star, Quote, Send, CheckCircle, PencilLine, Search } from 'lucide-react';
import { supabase, type Testimonial } from '../lib/supabase';

const PUBLIC_TESTIMONIAL_COLUMNS = 'id,client_name,client_role,content,rating,approved,created_at';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    client_name: '',
    client_role: '',
    content: '',
    rating: 5,
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastEditToken, setLastEditToken] = useState('');
  const [error, setError] = useState('');

  const [editToken, setEditToken] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [editForm, setEditForm] = useState({
    id: '',
    client_name: '',
    client_role: '',
    content: '',
    rating: 5,
  });

  useEffect(() => {
    supabase
      .from('testimonials')
      .select(PUBLIC_TESTIMONIAL_COLUMNS)
      .eq('approved', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setTestimonials(data ?? []);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.client_name.trim() || !form.content.trim()) {
      setError('Veuillez remplir votre nom et votre témoignage.');
      return;
    }
    setSubmitting(true);
    setError('');
    const { data, error: err } = await supabase
      .from('testimonials')
      .insert([{ ...form, approved: true }])
      .select(`${PUBLIC_TESTIMONIAL_COLUMNS},edit_token`)
      .single();
    setSubmitting(false);
    if (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } else {
      setSubmitted(true);
      setLastEditToken(data?.edit_token ?? '');
      if (data) {
        setTestimonials((prev) => [
          {
            id: data.id,
            client_name: data.client_name,
            client_role: data.client_role,
            content: data.content,
            rating: data.rating,
            approved: data.approved,
            created_at: data.created_at,
          },
          ...prev,
        ]);
      }
      setForm({ client_name: '', client_role: '', content: '', rating: 5 });
    }
  };

  const loadTestimonialForEdit = async () => {
    const token = editToken.trim();
    if (!token) {
      setEditError('Entrez votre code de modification.');
      return;
    }

    setEditLoading(true);
    setEditError('');
    setEditSuccess('');

    const { data, error: err } = await supabase
      .from('testimonials')
      .select(PUBLIC_TESTIMONIAL_COLUMNS)
      .eq('edit_token', token)
      .maybeSingle();

    setEditLoading(false);

    if (err || !data) {
      setEditError('Aucun témoignage trouvé avec ce code.');
      return;
    }

    setEditForm({
      id: data.id,
      client_name: data.client_name,
      client_role: data.client_role,
      content: data.content,
      rating: data.rating,
    });
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editToken.trim()) {
      setEditError('Entrez votre code de modification.');
      return;
    }
    if (!editForm.client_name.trim() || !editForm.content.trim()) {
      setEditError('Le nom et le témoignage sont obligatoires.');
      return;
    }

    setEditSubmitting(true);
    setEditError('');
    setEditSuccess('');

    const { data, error: err } = await supabase.rpc('update_testimonial_with_token', {
      p_edit_token: editToken.trim(),
      p_client_name: editForm.client_name,
      p_client_role: editForm.client_role,
      p_content: editForm.content,
      p_rating: editForm.rating,
    });

    setEditSubmitting(false);

    if (err || !data) {
      setEditError('Modification impossible. Vérifiez le code puis réessayez.');
      return;
    }

    const updated = data as Testimonial;

    setTestimonials((prev) => {
      const exists = prev.some((t) => t.id === updated.id);
      if (!updated.approved) {
        return prev.filter((t) => t.id !== updated.id);
      }
      if (!exists) {
        return [updated, ...prev];
      }
      return prev.map((t) => (t.id === updated.id ? updated : t));
    });

    setEditSuccess('Votre témoignage a été mis à jour avec succès.');
  };

  return (
    <section id="temoignages" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-cyan-600 font-semibold text-sm uppercase tracking-widest">
            Ils nous font confiance
          </span>
          <h2 className="mt-2 text-4xl lg:text-5xl font-black text-slate-900">
            Témoignages{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-600">
              Clients
            </span>
          </h2>
        </div>

        {/* Testimonials grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-48 animate-pulse" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <p className="text-center text-gray-400 mb-16 text-lg">
            Soyez le premier à laisser un témoignage !
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white rounded-3xl p-8 shadow-md border border-gray-100 relative"
              >
                <Quote className="w-10 h-10 text-cyan-100 absolute top-6 right-6" />
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < t.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 leading-relaxed mb-6 italic">"{t.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-sky-500 flex items-center justify-center text-white font-bold text-lg">
                    {t.client_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{t.client_name}</p>
                    {t.client_role && (
                      <p className="text-gray-500 text-sm">{t.client_role}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Submit form */}
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 shadow-md border border-gray-100">
          <h3 className="text-2xl font-black text-slate-900 mb-2">Partagez votre expérience</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Votre témoignage sera publié automatiquement dès son envoi.
          </p>

          {submitted ? (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-lg font-bold text-slate-900">Merci pour votre témoignage !</p>
              <p className="text-gray-500 mt-2">Il est maintenant publié sur le site.</p>
              {lastEditToken && (
                <div className="mt-5 text-left bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <p className="text-sm font-semibold text-slate-700 mb-1">Code de modification</p>
                  <p className="text-xs text-slate-500 mb-2">
                    Conservez ce code pour modifier votre témoignage plus tard.
                  </p>
                  <p className="font-mono text-sm bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 break-all">
                    {lastEditToken}
                  </p>
                </div>
              )}
              <button
                onClick={() => {
                  setSubmitted(false);
                  setLastEditToken('');
                }}
                className="mt-4 text-cyan-600 hover:text-cyan-500 text-sm font-medium"
              >
                Soumettre un autre témoignage
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Votre nom *
                  </label>
                  <input
                    type="text"
                    value={form.client_name}
                    onChange={(e) => setForm({ ...form, client_name: e.target.value })}
                    placeholder="Marie Camara"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Votre rôle / entreprise
                  </label>
                  <input
                    type="text"
                    value={form.client_role}
                    onChange={(e) => setForm({ ...form, client_role: e.target.value })}
                    placeholder="Directeur, Hôtel..."
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
              </div>

              {/* Star rating */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Note
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${star <= form.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Votre témoignage *
                </label>
                <textarea
                  rows={4}
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Partagez votre expérience avec TELICO FROID..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition resize-none"
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                {submitting ? 'Envoi en cours...' : 'Soumettre mon témoignage'}
              </button>
            </form>
          )}
        </div>

        <div className="max-w-2xl mx-auto mt-8 bg-white rounded-3xl p-8 shadow-md border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <PencilLine className="w-5 h-5 text-cyan-600" />
            <h3 className="text-2xl font-black text-slate-900">Modifier mon témoignage</h3>
          </div>
          <p className="text-gray-600 mb-6 text-sm">
            Entrez votre code de modification pour retrouver et modifier votre témoignage.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-5">
            <input
              type="text"
              value={editToken}
              onChange={(e) => setEditToken(e.target.value)}
              placeholder="Collez votre code de modification"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
            />
            <button
              type="button"
              onClick={loadTestimonialForEdit}
              disabled={editLoading}
              className="bg-slate-100 hover:bg-slate-200 disabled:opacity-60 text-slate-700 font-semibold px-5 py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              {editLoading ? 'Recherche...' : 'Charger'}
            </button>
          </div>

          {editForm.id && (
            <form onSubmit={submitEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Votre nom *
                  </label>
                  <input
                    type="text"
                    value={editForm.client_name}
                    onChange={(e) => setEditForm({ ...editForm, client_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Votre rôle / entreprise
                  </label>
                  <input
                    type="text"
                    value={editForm.client_role}
                    onChange={(e) => setEditForm({ ...editForm, client_role: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Note</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, rating: star })}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${star <= editForm.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Votre témoignage *
                </label>
                <textarea
                  rows={4}
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition resize-none"
                />
              </div>

              {editError && <p className="text-red-500 text-sm">{editError}</p>}
              {editSuccess && <p className="text-green-600 text-sm">{editSuccess}</p>}

              <button
                type="submit"
                disabled={editSubmitting}
                className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <PencilLine className="w-5 h-5" />
                {editSubmitting ? 'Mise à jour...' : 'Mettre à jour mon témoignage'}
              </button>
            </form>
          )}

          {!editForm.id && !editError && (
            <p className="text-xs text-slate-500">
              Astuce: ce code vous est affiché juste après l&apos;envoi de votre témoignage.
            </p>
          )}
          {editError && !editForm.id && <p className="text-red-500 text-sm">{editError}</p>}
        </div>
      </div>
    </section>
  );
}
