import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

export default function AdminApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAccess = async () => {
    setLoading(true);
    const { data } = await supabase.auth.getSession();
    const session = data.session;

    if (!session) {
      setLoggedIn(false);
      setIsAdmin(false);
      setLoading(false);
      return;
    }

    setLoggedIn(true);
    const { data: adminRow } = await supabase
      .from('admin_users')
      .select('id')
      .eq('id', session.user.id)
      .maybeSingle();

    setIsAdmin(!!adminRow);
    setLoading(false);
  };

  useEffect(() => {
    checkAccess();

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      checkAccess();
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!loggedIn) return <AdminLogin onLogin={() => setLoggedIn(true)} />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center">
          <h2 className="text-2xl font-black text-white mb-2">Acces refuse</h2>
          <p className="text-gray-400 mb-6">
            Votre compte est connecte, mais il n&apos;est pas autorise a acceder a l&apos;espace admin.
          </p>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setLoggedIn(false);
              setIsAdmin(false);
            }}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl transition-colors"
          >
            Se deconnecter
          </button>
        </div>
      </div>
    );
  }

  return <AdminPanel onLogout={() => setLoggedIn(false)} />;
}
