import { useState, useEffect } from 'react';
import {
  Snowflake,
  LayoutDashboard,
  Mail,
  BookOpen,
  Star,
  LogOut,
  Menu,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import RequestsManager from './RequestsManager';
import BlogManager from './BlogManager';
import TestimonialsManager from './TestimonialsManager';

type Tab = 'dashboard' | 'requests' | 'blog' | 'testimonials';

type Props = { onLogout: () => void };

export default function AdminPanel({ onLogout }: Props) {
  const [tab, setTab] = useState<Tab>('requests');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [counts, setCounts] = useState({ requests: 0, pendingTestimonials: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      const [{ count: r }, { count: t }] = await Promise.all([
        supabase
          .from('contact_requests')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'new'),
        supabase
          .from('testimonials')
          .select('id', { count: 'exact', head: true })
          .eq('approved', false),
      ]);
      setCounts({ requests: r ?? 0, pendingTestimonials: t ?? 0 });
    };
    fetchCounts();
  }, [tab]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onLogout();
  };

  const navItems: { id: Tab; label: string; icon: typeof Mail; badge?: number }[] = [
    { id: 'requests', label: 'Demandes de devis', icon: Mail, badge: counts.requests },
    { id: 'blog', label: 'Blog / Photos', icon: BookOpen },
    { id: 'testimonials', label: 'Témoignages', icon: Star, badge: counts.pendingTestimonials },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 p-6 border-b border-slate-700">
        <div className="bg-cyan-500 rounded-xl p-2">
          <Snowflake className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-white font-black text-base block leading-tight">TELICO FROID</span>
          <span className="text-cyan-400 text-xs">Admin</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        <button
          onClick={() => { setTab('dashboard'); setSidebarOpen(false); }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
            tab === 'dashboard'
              ? 'bg-cyan-500/10 text-cyan-400'
              : 'text-gray-400 hover:text-white hover:bg-slate-700'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          Tableau de bord
        </button>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                tab === item.id
                  ? 'bg-cyan-500/10 text-cyan-400'
                  : 'text-gray-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="flex-1 text-left">{item.label}</span>
              {(item.badge ?? 0) > 0 && (
                <span className="bg-cyan-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700 space-y-2">
        <a
          href="/"
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-slate-700 transition-all"
        >
          Voir le site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Déconnexion
        </button>
      </div>
    </div>
  );

  const dashboardStats = [
    { label: 'Nouveaux devis', value: counts.requests, color: 'text-blue-400' },
    { label: 'Temoignages non publies', value: counts.pendingTestimonials, color: 'text-amber-400' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-800 border-r border-slate-700 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-64 h-full bg-slate-800 border-r border-slate-700">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-slate-800 border-b border-slate-700 px-6 py-4 flex items-center gap-4">
          <button
            className="lg:hidden text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-white font-bold text-lg capitalize">
            {tab === 'dashboard'
              ? 'Tableau de bord'
              : tab === 'requests'
              ? 'Demandes de devis'
              : tab === 'blog'
              ? 'Blog & Photos'
              : 'Témoignages'}
          </h1>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {tab === 'dashboard' && (
            <div>
              <p className="text-gray-400 mb-8">Bienvenue dans le panel d'administration TELICO FROID.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {dashboardStats.map((stat) => (
                  <div key={stat.label} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className={`text-5xl font-black mt-2 ${stat.color}`}>{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setTab(item.id)}
                      className="bg-slate-800 rounded-2xl p-5 border border-slate-700 hover:border-cyan-500/40 transition-all text-left group"
                    >
                      <Icon className="w-8 h-8 text-cyan-400 mb-3" />
                      <p className="text-white font-bold">{item.label}</p>
                      <p className="text-gray-400 text-sm mt-1 group-hover:text-cyan-400 transition-colors">
                        Gérer &rarr;
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {tab === 'requests' && <RequestsManager />}
          {tab === 'blog' && <BlogManager />}
          {tab === 'testimonials' && <TestimonialsManager />}
        </main>
      </div>
    </div>
  );
}
