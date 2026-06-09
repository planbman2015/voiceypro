import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mic2, Search, BadgeCheck, ExternalLink, ArrowRight,
  Shield, Users, Globe, Zap, Star, ChevronRight
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { VoiceProfile } from '../lib/demoData';
import VoiceCard from '../components/VoiceCard';
import { useSEO, useJsonLd, DEFAULT_DESCRIPTION } from '../lib/seo';

const PREVIEW_COUNT = 6;

export default function LandingPage() {
  useSEO({
    title: 'ElevenLabs Professional Voice Clone Directory',
    description: DEFAULT_DESCRIPTION,
    canonical: '/',
  });

  useJsonLd({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://voiceypro.com/#website',
        url: 'https://voiceypro.com/',
        name: 'VoiceyPro',
        description: DEFAULT_DESCRIPTION,
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://voiceypro.com/browse?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': 'https://voiceypro.com/#organization',
        name: 'VoiceyPro',
        url: 'https://voiceypro.com/',
        logo: 'https://voiceypro.com/favicon.svg',
        contactPoint: {
          '@type': 'ContactPoint',
          email: 'support@voiceypro.com',
          contactType: 'customer support',
        },
      },
    ],
  });

  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const [preview, setPreview] = useState<VoiceProfile[]>([]);

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('voice_profiles')
        .select('*')
        .eq('status', 'approved')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true })
        .limit(PREVIEW_COUNT);
      setPreview((data as VoiceProfile[]) || []);
    }
    load();
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    navigate(`/browse${query ? `?q=${encodeURIComponent(query)}` : ''}`);
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-sky-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-sky-500/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Hero Microphone Graphic */}
          <div className="flex justify-center mb-10">
            <div className="relative w-48 h-48">
              {/* Outer pulse rings */}
              <div className="absolute inset-0 rounded-full border border-sky-500/10 animate-ping" style={{ animationDuration: '3s' }} />
              <div className="absolute inset-4 rounded-full border border-sky-500/15 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.4s' }} />
              {/* Glow backdrop */}
              <div className="absolute inset-8 rounded-full bg-sky-500/10 blur-xl" />
              {/* Main circle */}
              <div className="absolute inset-10 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 shadow-2xl flex items-center justify-center">
                {/* SVG Condenser Mic */}
                <svg viewBox="0 0 80 100" className="w-16 h-16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Mic capsule body */}
                  <rect x="26" y="8" width="28" height="48" rx="14" fill="url(#capsuleGrad)" />
                  {/* Capsule highlight */}
                  <rect x="30" y="12" width="8" height="36" rx="4" fill="white" fillOpacity="0.07" />
                  {/* Grille lines */}
                  <line x1="26" y1="24" x2="54" y2="24" stroke="white" strokeOpacity="0.12" strokeWidth="1" />
                  <line x1="26" y1="32" x2="54" y2="32" stroke="white" strokeOpacity="0.12" strokeWidth="1" />
                  <line x1="26" y1="40" x2="54" y2="40" stroke="white" strokeOpacity="0.12" strokeWidth="1" />
                  <line x1="26" y1="48" x2="54" y2="48" stroke="white" strokeOpacity="0.12" strokeWidth="1" />
                  {/* Stand arm */}
                  <path d="M40 56 L40 70" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
                  {/* Base */}
                  <path d="M22 70 Q40 78 58 70" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                  {/* Soundwave arcs left */}
                  <path d="M18 18 Q10 32 18 46" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.6" />
                  <path d="M11 12 Q-1 32 11 52" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" fill="none" strokeOpacity="0.3" />
                  {/* Soundwave arcs right */}
                  <path d="M62 18 Q70 32 62 46" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" fill="none" strokeOpacity="0.6" />
                  <path d="M69 12 Q81 32 69 52" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" fill="none" strokeOpacity="0.3" />
                  {/* Gradient def */}
                  <defs>
                    <linearGradient id="capsuleGrad" x1="26" y1="8" x2="54" y2="56" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              {/* Equalizer bars — bottom of ring */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-end gap-0.5">
                {[12, 20, 14, 24, 10, 18, 16, 22, 12, 18, 10].map((h, i) => (
                  <div
                    key={i}
                    className="w-1 rounded-full bg-sky-400/60"
                    style={{
                      height: `${h}px`,
                      animation: `eqBounce ${0.6 + (i % 4) * 0.15}s ease-in-out infinite alternate`,
                      animationDelay: `${i * 0.07}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-8">
            <Mic2 size={13} />
            ElevenLabs Professional Voice Clone Directory
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6">
            Discover Professional
            <br />
            <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">
              ElevenLabs Voice Talent
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            Voice actors with ElevenLabs Professional Voice Clones. Click their shared link to add the voice to your ElevenLabs account.
          </p>
          <p className="text-slate-500 text-base max-w-xl mx-auto mb-10">
            Every listing is a verified ElevenLabs Professional Voice Clone owner with a shareable link.
          </p>

          {/* Search */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-10">
            <div className="relative flex items-center">
              <Search size={18} className="absolute left-4 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by accent, language, style, genre..."
                className="w-full pl-12 pr-32 py-4 rounded-2xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 text-base transition-all"
              />
              <button
                type="submit"
                className="absolute right-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-colors shadow-lg shadow-sky-500/25"
              >
                Search
              </button>
            </div>
          </form>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/submit"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-all shadow-lg shadow-sky-500/30 hover:shadow-sky-500/40 hover:-translate-y-0.5"
            >
              <Mic2 size={17} />
              Join as ElevenLabs Voice Talent
            </Link>
            <Link
              to="/browse"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold border border-slate-700 hover:border-slate-600 transition-all"
            >
              Browse ElevenLabs Voices
              <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </section>

      {/* Trust Section */}
      <section className="py-14 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-sky-500/10 to-blue-600/10 border border-sky-500/20 rounded-2xl p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                <Shield size={20} className="text-sky-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg mb-1">What is VoiceyPro?</h2>
                <p className="text-slate-400 text-sm">A discovery directory — not a voice cloning tool</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: BadgeCheck, text: 'This is a discovery site for ElevenLabs Professional Voice Clone owners only.' },
                { icon: ExternalLink, text: 'All talent have their own shared ElevenLabs voice link to list here.' },
                { icon: Shield, text: 'We do not host, create, or clone voices. We are a discovery directory only.' },
                { icon: Mic2, text: 'Click a voice\'s shared link to add it directly to your own ElevenLabs account.' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <Icon size={15} className="text-sky-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300 text-xs leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Voices Preview */}
      <section id="voices-section" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Star size={15} className="text-sky-400 fill-sky-400" />
                <span className="text-sm font-semibold uppercase tracking-wide text-sky-400">Featured</span>
              </div>
              <h2 className="text-3xl font-bold text-white">ElevenLabs Voice Professionals</h2>
              <p className="text-slate-400 mt-1">Hand-picked, verified Professional Voice Clone owners</p>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/browse"
                className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
              >
                View all voices <ChevronRight size={15} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {preview.map(voice => (
              <VoiceCard key={voice.id} voice={voice} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/browse"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-medium transition-all text-sm shadow-lg shadow-sky-500/25 hover:-translate-y-0.5"
            >
              View All Voices
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">How It Works</h2>
            <p className="text-slate-400 max-w-lg mx-auto">Two paths — whether you're looking for a voice or listing your own</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* For Clients */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <Search size={18} className="text-blue-400" />
                </div>
                <h3 className="text-white font-bold text-lg">For Clients & Producers</h3>
              </div>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Browse & Filter', desc: 'Search by accent, language, style, and genre to find the perfect voice.' },
                  { step: '02', title: 'Preview Profiles', desc: 'Read bios, check voice styles, and review the talent\'s ElevenLabs credentials.' },
                  { step: '03', title: 'Click ElevenLabs Link', desc: 'Use the shared link to add the voice directly to your own ElevenLabs account.' },
                  { step: '04', title: 'Contact Talent', desc: 'Use the built-in form to reach out for custom projects or licensing.' },
                ].map(item => (
                  <div key={item.step} className="flex items-start gap-4">
                    <span className="text-sky-500/60 text-xs font-bold font-mono mt-0.5 w-6 flex-shrink-0">{item.step}</span>
                    <div>
                      <p className="text-white text-sm font-medium mb-0.5">{item.title}</p>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/browse" className="mt-6 w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 hover:text-blue-300 text-sm font-medium border border-blue-500/20 transition-all">
                Browse Voices <ArrowRight size={14} />
              </Link>
            </div>

            {/* For Talent */}
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
                  <Mic2 size={18} className="text-sky-400" />
                </div>
                <h3 className="text-white font-bold text-lg">For ElevenLabs Voice Talent</h3>
              </div>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'Get an ElevenLabs Professional Voice Clone', desc: 'You must have a Professional Voice Clone (not Instant Clone) in your ElevenLabs account.' },
                  { step: '02', title: 'Generate a Shared Link', desc: 'In ElevenLabs: More actions → Share voice → Copy your public share link.' },
                  { step: '03', title: 'Create Your Listing', desc: 'Sign up, paste your ElevenLabs link, add bio, tags, and headshot.' },
                  { step: '04', title: 'Get Discovered', desc: 'Your profile is reviewed and published for clients to find and contact you.' },
                ].map(item => (
                  <div key={item.step} className="flex items-start gap-4">
                    <span className="text-sky-500/60 text-xs font-bold font-mono mt-0.5 w-6 flex-shrink-0">{item.step}</span>
                    <div>
                      <p className="text-white text-sm font-medium mb-0.5">{item.title}</p>
                      <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-col gap-2">
                <Link to="/submit" className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 text-sm font-medium border border-sky-500/20 transition-all">
                  List Your ElevenLabs Voice <ArrowRight size={14} />
                </Link>
                <a href="https://try.elevenlabs.io/xht4ezzxoclw" target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700/50 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs font-medium border border-slate-700 transition-all">
                  Don't have ElevenLabs yet? Get started <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">Why VoiceyPro</h2>
            <p className="text-slate-400">Built specifically for the ElevenLabs ecosystem</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: BadgeCheck, title: 'Verified Professional Clones', desc: 'Every listing must include a valid ElevenLabs Professional Voice Clone shared link. No Instant Clones.', color: 'text-sky-400', bg: 'bg-sky-500/10' },
              { icon: Zap, title: 'Instant ElevenLabs Access', desc: 'Click any shared link to add the voice directly to your ElevenLabs account and start using it immediately.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { icon: Users, title: 'Talent-Owned Voices', desc: 'All talent self-submit and own their voices. Voice owners can remove their link at any time.', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { icon: Globe, title: 'Global Voice Diversity', desc: 'Find voices in dozens of accents, languages, and styles from professional talent worldwide.', color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { icon: Shield, title: 'Admin Moderation', desc: 'Every listing is reviewed and verified before publishing. Broken or invalid links are flagged and removed.', color: 'text-rose-400', bg: 'bg-rose-500/10' },
              { icon: Mic2, title: 'Discovery Only', desc: 'We don\'t host voices, create clones, or process audio. We\'re purely a professional discovery directory.', color: 'text-violet-400', bg: 'bg-violet-500/10' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-slate-600 transition-colors">
                <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                  <Icon size={18} className={color} />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-slate-900 to-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-sky-500/10 via-blue-600/10 to-sky-500/10 border border-sky-500/20 rounded-3xl px-8 py-12">
            <Mic2 size={40} className="text-sky-400 mx-auto mb-5" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Own an ElevenLabs Professional Voice Clone?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              List your voice on VoiceyPro and get discovered by studios, brands, and content creators looking for exactly your sound.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/submit" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-all shadow-lg shadow-sky-500/30">
                List Your Voice Free
                <ArrowRight size={16} />
              </Link>
              <a href="https://try.elevenlabs.io/xht4ezzxoclw" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-slate-300 hover:text-white font-medium border border-slate-700 hover:border-slate-600 transition-all">
                Get ElevenLabs <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
