import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Mic2, AlertCircle, Eye, EyeOff, BadgeCheck, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSEO } from '../lib/seo';

export default function SignupPage() {
  useSEO({ title: 'Create Account', canonical: '/signup', noindex: true });
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    setError('');
    const { error } = await signUp(email, password, fullName, 'talent');
    setLoading(false);
    if (error) { setError(error.message); return; }
    navigate(redirect);
  }

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
            <Mic2 size={26} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">List Your Voice</h1>
          <p className="text-slate-400 text-sm">Join VoiceyPro · ElevenLabs Voice Directory</p>
        </div>

        {/* Talent-only callout */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 mb-5">
          <BadgeCheck size={17} className="text-sky-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sky-300 text-sm font-semibold mb-0.5">For Voice Talent Only</p>
            <p className="text-slate-400 text-xs leading-relaxed">
              Accounts are for ElevenLabs voice owners who want to list their Professional Voice Clone.
              Clients can browse and contact talent freely — no account needed.
            </p>
          </div>
        </div>

        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm font-medium mb-1.5 block">Full Name</label>
              <input
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 text-sm transition-all"
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 text-sm transition-all"
              />
            </div>
            <div>
              <label className="text-slate-300 text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 pr-11 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 text-sm transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p className="text-amber-400 text-xs leading-relaxed">
                You'll need an <strong>ElevenLabs Professional Voice Clone</strong> with a shared link to complete your listing after signup.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-500/25 mt-2"
            >
              {loading ? 'Creating account...' : 'Create Talent Account'}
            </button>
          </form>

          <div className="mt-5 space-y-3">
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{' '}
                <Link to={`/login?redirect=${redirect}`} className="text-sky-400 hover:text-sky-300 font-medium transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
            <div className="border-t border-slate-700/50 pt-3 text-center">
              <p className="text-slate-500 text-xs flex items-center justify-center gap-1.5">
                <Users size={12} />
                Looking to hire? <Link to="/browse" className="text-slate-400 hover:text-sky-400 transition-colors">Browse voices — no account needed</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
