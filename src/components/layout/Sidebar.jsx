import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Search,
  Map,
  MessageSquare,
  GraduationCap,
  Palette,
  Users,
  TrendingUp,
  FlaskConical,
  Eye,
  Newspaper,
  Image,
  Wand2,
  Calendar,
  LogOut,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import useStore from '../../store/store';
import { useAuth } from '../../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/analyzer', label: 'Campaign Analyzer', icon: Search },
  { to: '/planner', label: 'Campaign Planner', icon: Map },
  { to: '/consultant', label: 'AI Consultant', icon: MessageSquare },
  { to: '/learn', label: 'Learning Hub', icon: GraduationCap },
];

const PHASE2_ITEMS = [
  { to: '/creative', label: 'Creative Studio', icon: Palette },
  { to: '/audience', label: 'Audience Builder', icon: Users },
  { to: '/prompt-generator', label: 'Prompt Generator', icon: Wand2 },
  { to: '/festival', label: 'Festival Planner', icon: Calendar },
  { to: '/news', label: 'News & Trends', icon: Newspaper },
  { to: '/prompts', label: 'Prompt Library', icon: Image },
];

const PHASE3_ITEMS = [
  { to: '/forecasting', label: 'Forecasting', icon: TrendingUp },
  { to: '/experiments', label: 'Experiments', icon: FlaskConical },
  { to: '/competitive', label: 'Competitive Intel', icon: Eye },
];

export default function Sidebar() {
  const sidebarOpen = useStore((s) => s.sidebarOpen);
  const toggleSidebar = useStore((s) => s.toggleSidebar);
  const aiCallsToday = useStore((s) => s.aiCallsToday);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 lg:hidden bg-navy-800 border border-slate-700 rounded-xl p-2 text-slate-300 cursor-pointer"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full bg-navy-900/95 backdrop-blur-xl border-r border-slate-700/50 
          flex flex-col z-40 transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-0 -translate-x-full lg:w-16 lg:translate-x-0'}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-5 border-b border-slate-700/50">
          <div className="w-8 h-8 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-navy-900" />
          </div>
          {sidebarOpen && (
            <span className="font-display font-bold text-lg text-slate-100">
              Campaign<span className="text-teal-400">OS</span>
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
            {sidebarOpen ? 'Core Features' : ''}
          </p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
                }`
              }
            >
              <item.icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}

          {sidebarOpen && (
            <>
              <div className="h-px bg-slate-700/50 my-4" />
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                Creative & Content
              </p>
            </>
          )}
          {PHASE2_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
                }`
              }
            >
              <item.icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}

          {sidebarOpen && (
            <>
              <div className="h-px bg-slate-700/50 my-4" />
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-3 mb-2">
                Analytics & Intelligence
              </p>
            </>
          )}
          {PHASE3_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${
                  isActive
                    ? 'bg-teal-500/15 text-teal-400 border border-teal-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-700/30'
                }`
              }
            >
              <item.icon size={18} className="flex-shrink-0" />
              {sidebarOpen && <span>{item.label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom — Usage & User */}
        <div className="border-t border-slate-700/50 p-3 space-y-3">
          {/* AI Usage Meter */}
          {sidebarOpen && (
            <div className="bg-navy-800/50 rounded-xl p-3">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-400">AI Calls Today</span>
                <span className="text-teal-400 font-mono">{aiCallsToday}/15</span>
              </div>
              <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((aiCallsToday / 15) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* User */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-500/20 rounded-xl flex items-center justify-center text-teal-400 text-sm font-bold flex-shrink-0">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-200 font-medium truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs text-slate-500 truncate">
                  {user?.email || ''}
                </p>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="text-slate-500 hover:text-red-400 transition-colors cursor-pointer flex-shrink-0"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
