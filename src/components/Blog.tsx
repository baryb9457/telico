import { useEffect, useState } from 'react';
import { Calendar, ArrowRight, ImageOff } from 'lucide-react';
import { supabase, type BlogPost } from '../lib/supabase';

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<BlogPost | null>(null);

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(6)
      .then(({ data }) => {
        setPosts(data ?? []);
        setLoading(false);
      });
  }, []);

  const fmt = (d: string) =>
    new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <section id="blog" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-cyan-600 font-semibold text-sm uppercase tracking-widest">
            Notre actualité
          </span>
          <h2 className="mt-2 text-4xl lg:text-5xl font-black text-slate-900">
            Nos{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-sky-600">
              Activités
            </span>
          </h2>
          <p className="mt-4 text-gray-600 max-w-xl mx-auto">
            Découvrez nos derniers chantiers, installations et interventions en photos.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-3xl h-80 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ImageOff className="w-16 h-16 mx-auto mb-4 opacity-40" />
            <p className="text-lg">Aucune publication pour le moment.</p>
            <p className="text-sm mt-1">Revenez bientôt !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-100"
                onClick={() => setSelected(post)}
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  {post.image_url ? (
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-50 to-sky-100">
                      <ImageOff className="w-12 h-12 text-cyan-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    {fmt(post.created_at)}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  {post.content && (
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">{post.content}</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-cyan-600 text-sm font-semibold hover:gap-2 transition-all">
                    Lire la suite <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {selected.image_url && (
              <img
                src={selected.image_url}
                alt={selected.title}
                className="w-full h-64 object-cover rounded-t-3xl"
              />
            )}
            <div className="p-8">
              <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                <Calendar className="w-4 h-4" />
                {fmt(selected.created_at)}
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-4">{selected.title}</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selected.content}</p>
              <button
                onClick={() => setSelected(null)}
                className="mt-8 bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-2.5 rounded-full font-semibold transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
