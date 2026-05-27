import { useState } from 'react';
import { Snowflake, LogIn, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

type Props = { onLogin: () => void };

export default function AdminLogin({ onLogin }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError('Identifiants incorrects. Veuillez réessayer.');
    } else {
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500 rounded-2xl mb-4">
            <Snowflake className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white">TELICO FROID</h1>
          <p className="text-gray-400 mt-1">Espace administrateur - demandes de devis</p>
        </div>

        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-gray-500 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 text-white placeholder-gray-500 rounded-xl focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
            >
              <LogIn className="w-5 h-5" />
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6">
          <a href="/" className="text-gray-500 hover:text-cyan-400 text-sm transition-colors">
            Retour au site
          </a>
        </p>
      </div>
    </div>
  );
}
