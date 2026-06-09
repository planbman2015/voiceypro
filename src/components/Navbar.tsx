import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  async function handleSignOut() {
    await signOut();
    navigate('/');
    setUserMenuOpen(false);
  }

  function handleLogoClick(e: React.MouseEvent) {
    if (location.pathname === '/') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center gap-2 group">
            <svg viewBox="0 0 80 100" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="26" y="8" width="28" height="48" rx="14" fill="url(#navCapsule)" />
              <rect x="30" y="12" width="8" height="36" rx="4" fill="white" fillOpacity="0.07" />
              <line x1="26" y1="24" x2="54" y2="24" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
              <line x1="26" y1="32" x2="54" y2="32" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
              <line x1="26" y1="40" x2="54" y2="40" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
              <line x1="26" y1="48" x2="54" y2="48" stroke="white" strokeOpacity="0.15" strokeWidth="1" />
              <path d="M40 56 L40 70" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M22 70 Q40 78 58 70" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M18 18 Q10 32 18 46" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.7" />
              <path d="M62 18 Q70 32 62 46" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.7" />
              <defs>
                <linearGradient id="navCapsule" x1="26" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.9" />
                </linearGradient>
              </defs>
            </svg>
            <span className="font-bold text-white text-lg tracking-tight">
              Voicey<span className="text-sky-400">Pro</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/browse" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/browse') ? 'text-sky-400 bg-sky-400/10' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}>
              Browse Voices
            </Link>
            <Link to="/faq" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/faq') ? 'text-sky-400 bg-sky-400/10' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}>
              FAQ
            </Link>
            <Link to="/contact" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/contact') ? 'text-sky-400 bg-sky-400/10' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`}>
              Contact
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors text-sm font-medium"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                    <User size={13} className="text-white" />
                  </div>
                  <span>{profile?.full_name?.split(' ')[0] || 'Account'}</span>
                  <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden">
                    <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    {profile?.role === 'admin' && (
                      <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors">
                        <Shield size={14} /> Admin
                      </Link>
                    )}
                    <div className="border-t border-slate-700" />
                    <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-300 hover:text-red-400 hover:bg-slate-700 transition-colors">
                      <LogOut size={14} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Sign in
                </Link>
                <Link to="/submit" className="px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-semibold transition-colors shadow-lg shadow-sky-500/25">
                  List Your Voice
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-1">
          <Link to="/browse" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Browse Voices</Link>
          <Link to="/faq" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">FAQ</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">Contact</Link>
          <div className="border-t border-slate-800 pt-2 mt-2 space-y-1">
            {user ? (
              <>
                <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800">Dashboard</Link>
                <button onClick={handleSignOut} className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-red-400 hover:bg-slate-800">Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800">Sign in</Link>
                <Link to="/submit" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-md text-sm font-semibold text-sky-400 hover:text-sky-300 hover:bg-slate-800">List Your Voice</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
