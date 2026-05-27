import { useEffect, useState } from 'react';
import { Plus, CreditCard as Edit2, Trash2, Eye, EyeOff, X, Save } from 'lucide-react';
import { supabase, type BlogPost } from '../lib/supabase';

const empty: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'> = {
  title: '',
  content: '',
  image_url: '',
  published: false,
};

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<BlogPost> | null>(null);
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState('');

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setImageError('Veuillez selectionner un fichier image valide.');
      e.target.value = '';
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setImageError('Image trop lourde (max 3 MB).');
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      if (!result) {
        setImageError('Impossible de lire cette image.');
        return;
      }
      setImageError('');
      setEditing((prev) => (prev ? { ...prev, image_url: result } : prev));
    };
    reader.onerror = () => setImageError('Erreur lors de la lecture de l\'image.');
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    setPosts(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!editing?.title?.trim()) return;
    setSaving(true);
    if (editing.id) {
      await supabase
        .from('blog_posts')
        .update({ ...editing, updated_at: new Date().toISOString() })
        .eq('id', editing.id);
    } else {
      await supabase.from('blog_posts').insert([{ ...empty, ...editing }]);
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const togglePublish = async (post: BlogPost) => {
    await supabase.from('blog_posts').update({ published: !post.published }).eq('id', post.id);
    setPosts((prev) =>
      prev.map((p) => (p.id === post.id ? { ...p, published: !p.published } : p))
    );
  };

  const deletePost = async (id: string) => {
    if (!confirm('Supprimer cet article ?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white">Articles / Photos ({posts.length})</h2>
        <button
          onClick={() => setEditing({ ...empty })}
          className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2 rounded-xl font-semibold text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouvel article
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-2xl h-48 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p>Aucun article. Créez votre premier article !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700"
            >
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-slate-700 flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Pas d'image</span>
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border ${
                      post.published
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/30'
                    }`}
                  >
                    {post.published ? 'Publié' : 'Brouillon'}
                  </span>
                  <span className="text-gray-500 text-xs">{fmt(post.created_at)}</span>
                </div>
                <h3 className="text-white font-bold text-sm mb-3 line-clamp-2">{post.title}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setEditing({ ...post })}
                    className="flex-1 flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-600 text-gray-300 py-1.5 rounded-lg text-xs transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Modifier
                  </button>
                  <button
                    onClick={() => togglePublish(post)}
                    className="flex items-center justify-center gap-1 bg-slate-700 hover:bg-slate-600 text-gray-300 py-1.5 px-3 rounded-lg text-xs transition-colors"
                    title={post.published ? 'Masquer' : 'Publier'}
                  >
                    {post.published ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 py-1.5 px-3 rounded-lg text-xs transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit modal */}
      {editing !== null && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 rounded-3xl max-w-2xl w-full border border-slate-600 p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-white">
                {editing.id ? 'Modifier l\'article' : 'Nouvel article'}
              </h3>
              <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                  Titre *
                </label>
                <input
                  type="text"
                  value={editing.title ?? ''}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Titre de l'article"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-gray-500 rounded-xl focus:border-cyan-400 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                  URL de l'image
                </label>
                <input
                  type="url"
                  value={editing.image_url ?? ''}
                  onChange={(e) => {
                    setImageError('');
                    setEditing({ ...editing, image_url: e.target.value });
                  }}
                  placeholder="https://..."
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-gray-500 rounded-xl focus:border-cyan-400 outline-none transition"
                />
                <div className="my-2 text-center text-xs text-gray-500">ou</div>
                <label className="block">
                  <span className="block text-xs text-gray-400 mb-1">Importer une image depuis votre appareil</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileChange}
                    className="w-full text-sm text-gray-300 file:mr-3 file:px-3 file:py-2 file:rounded-lg file:border-0 file:bg-slate-600 file:text-white hover:file:bg-slate-500"
                  />
                </label>
                {imageError && <p className="mt-2 text-xs text-rose-400">{imageError}</p>}
                {editing.image_url && (
                  <img
                    src={editing.image_url}
                    alt="preview"
                    className="mt-2 w-full h-40 object-cover rounded-xl"
                    onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')}
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                  Contenu / Description
                </label>
                <textarea
                  rows={5}
                  value={editing.content ?? ''}
                  onChange={(e) => setEditing({ ...editing, content: e.target.value })}
                  placeholder="Description de l'activité..."
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-gray-500 rounded-xl focus:border-cyan-400 outline-none transition resize-none"
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    editing.published ? 'bg-cyan-500' : 'bg-slate-600'
                  }`}
                  onClick={() => setEditing({ ...editing, published: !editing.published })}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      editing.published ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </div>
                <span className="text-gray-300 font-semibold text-sm">
                  {editing.published ? 'Publié (visible sur le site)' : 'Brouillon (non visible)'}
                </span>
              </label>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={save}
                disabled={saving || !editing.title?.trim()}
                className="flex-1 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-colors"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                onClick={() => setEditing(null)}
                className="px-6 bg-slate-700 hover:bg-slate-600 text-gray-300 font-bold py-3 rounded-xl transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
