import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BadgeCheck, ExternalLink, Globe, ArrowLeft,
  Star, Shield,
  Eye, MousePointerClick, Mic2, Play, Pause, Volume2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { VoiceProfile } from '../lib/demoData';
import { useSEO } from '../lib/seo';

const ELEVENLABS_AFFILIATE = 'https://try.elevenlabs.io/xht4ezzxoclw';

const availabilityConfig = {
  available: { label: 'Available', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', dot: 'bg-emerald-400' },
  busy: { label: 'Currently Busy', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', dot: 'bg-amber-400' },
  unavailable: { label: 'Unavailable', color: 'text-slate-400', bg: 'bg-slate-700/50', border: 'border-slate-700', dot: 'bg-slate-500' },
};

export default function VoiceProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [voice, setVoice] = useState<VoiceProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useSEO({
    title: voice ? `${voice.name} — ElevenLabs Voice Talent` : 'Voice Profile',
    description: voice
      ? `${voice.headline}. ${voice.accent} accent. Genres: ${voice.genres.join(', ')}. Book ${voice.name} on VoiceyPro.`
      : 'View this ElevenLabs Professional Voice Clone profile on VoiceyPro.',
    canonical: `/voice/${id}`,
  });
  const [contactOpen, setContactOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', projectType: '', budget: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [contactError, setContactError] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('voice_profiles')
        .select('*')
        .eq('id', id!)
        .maybeSingle();
      setVoice(data as VoiceProfile | null);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!voice) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-2">Voice not found</h2>
          <p className="text-slate-400 mb-6">This listing may have been removed or doesn't exist.</p>
          <Link to="/browse" className="px-5 py-2.5 rounded-xl bg-sky-500 text-white font-medium hover:bg-sky-400 transition-colors">Browse Voices</Link>
        </div>
      </div>
    );
  }

  const avail = availabilityConfig[voice.availability as keyof typeof availabilityConfig] ?? availabilityConfig.unavailable;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactLoading(true);
    setContactError('');
    try {
      const { error } = await supabase.functions.invoke('send-talent-inquiry', {
        body: {
          voice_profile_id: voice!.id,
          sender_name: form.name,
          sender_email: form.email,
          company: form.company,
          project_type: form.projectType,
          budget: form.budget,
          message: form.message,
        },
      });
      if (error) throw new Error(error.message || 'Failed to send message.');
      setSubmitted(true);
    } catch (err: any) {
      setContactError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setContactLoading(false);
    }
  }

  function toggleAudio() {
    if (!audioRef.current) return;
    if (audioPlaying) {
      audioRef.current.pause();
      setAudioPlaying(false);
    } else {
      audioRef.current.play();
      setAudioPlaying(true);
    }
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60);
    return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back */}
        <Link to="/browse" className="inline-flex items-center gap-2 text-slate-400 hover:text-sky-400 text-sm mb-8 transition-colors">
          <ArrowLeft size={15} /> Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
              {voice.is_featured && (
                <div className="bg-gradient-to-r from-sky-500/20 to-blue-600/20 border-b border-sky-500/20 px-6 py-2 flex items-center gap-2">
                  <Star size={12} className="text-sky-400 fill-sky-400" />
                  <span className="text-sky-400 text-xs font-semibold uppercase tracking-wide">Featured ElevenLabs Voice</span>
                </div>
              )}
              <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative flex-shrink-0">
                    <img
                      src={voice.avatar_url}
                      alt={voice.name}
                      className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover ring-2 ring-slate-700"
                    />
                    {voice.is_verified && (
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center">
                        <BadgeCheck size={17} className="text-sky-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-3 mb-2">
                      <h1 className="text-2xl sm:text-3xl font-bold text-white">{voice.name}</h1>
                      {voice.is_verified && (
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold">
                          <BadgeCheck size={12} /> Verified ElevenLabs Professional Clone
                        </span>
                      )}
                    </div>
                    <p className="text-slate-300 text-base mb-4">{voice.headline}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${avail.bg} ${avail.border}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
                        <span className={avail.color + ' text-xs font-medium'}>{avail.label}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Globe size={13} /> {voice.accent} Accent
                      </span>
                      <span className="text-slate-400 text-xs capitalize">{voice.gender} voice</span>
                      <span className="text-slate-400 text-xs">Age {voice.age_range}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Audio Sample Player */}
            {(voice as any).demo_audio_url && (
              <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Volume2 size={16} className="text-sky-400" />
                  <h2 className="text-white font-bold text-lg">Voice Demo Sample</h2>
                  <span className="ml-auto px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">Listen Now</span>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={toggleAudio}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-500/30 transition-all hover:scale-105 active:scale-95"
                  >
                    {audioPlaying
                      ? <Pause size={18} className="text-white" />
                      : <Play size={18} className="text-white ml-0.5" />
                    }
                  </button>
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div
                      className="relative h-2 bg-slate-700 rounded-full overflow-hidden cursor-pointer"
                      onClick={e => {
                        if (!audioRef.current || !audioDuration) return;
                        const rect = e.currentTarget.getBoundingClientRect();
                        const pct = (e.clientX - rect.left) / rect.width;
                        audioRef.current.currentTime = pct * audioDuration;
                      }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full transition-all"
                        style={{ width: `${audioDuration ? (audioProgress / audioDuration) * 100 : 0}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 text-xs">{formatTime(audioProgress)}</span>
                      <span className="text-slate-500 text-xs">{audioDuration ? formatTime(audioDuration) : '--:--'}</span>
                    </div>
                  </div>
                </div>
                <audio
                  ref={audioRef}
                  src={(voice as any).demo_audio_url}
                  onTimeUpdate={() => setAudioProgress(audioRef.current?.currentTime ?? 0)}
                  onLoadedMetadata={() => setAudioDuration(audioRef.current?.duration ?? 0)}
                  onEnded={() => { setAudioPlaying(false); setAudioProgress(0); }}
                  preload="metadata"
                />
                <p className="text-slate-500 text-xs mt-3">
                  This sample was uploaded by {voice.name} to showcase their ElevenLabs Professional Voice Clone.
                </p>
              </div>
            )}

            {/* ElevenLabs Link — PROMINENT */}
            <div className="bg-gradient-to-r from-sky-500/10 to-blue-600/10 border border-sky-500/30 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <Mic2 size={18} className="text-sky-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold mb-1">ElevenLabs Professional Voice Clone</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Click the link below to open this voice in ElevenLabs and add it to your own account.
                    This is {voice.name}'s verified Professional Voice Clone — not an Instant Clone.
                  </p>
                  <a
                    href={voice.elevenlabs_voice_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-500/25"
                  >
                    <ExternalLink size={15} />
                    Open in ElevenLabs
                  </a>
                  <p className="text-slate-500 text-xs mt-3">
                    Voice link: <span className="text-slate-400 break-all">{voice.elevenlabs_voice_link}</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-4">About {voice.name}</h2>
              <p className="text-slate-300 leading-relaxed">{voice.bio}</p>
            </div>

            {/* Voice Details */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-white font-bold text-lg mb-5">Voice Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">Voice Style</p>
                  <div className="flex flex-wrap gap-1.5">
                    {voice.voice_style_tags.map(tag => (
                      <span key={tag} className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-300 text-xs">{tag}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">Genres</p>
                  <div className="flex flex-wrap gap-1.5">
                    {voice.genres.map(g => (
                      <span key={g} className="px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs border border-blue-500/20">{g}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">Languages</p>
                  <div className="flex flex-wrap gap-1.5">
                    {voice.languages.map(l => (
                      <span key={l} className="px-2.5 py-1 rounded-md bg-slate-700/80 text-slate-300 text-xs border border-slate-700">{l}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-medium uppercase tracking-wide mb-2">Commercial Use</p>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${voice.commercial_use ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-700 text-slate-400'}`}>
                    {voice.commercial_use ? 'Available' : 'Not available'}
                  </span>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-start gap-3">
              <Shield size={14} className="text-slate-500 mt-0.5 flex-shrink-0" />
              <p className="text-slate-500 text-xs leading-relaxed">
                This is a discovery listing only. VoiceyPro does not host, create, or own this voice.
                {voice.name} owns this ElevenLabs Professional Voice Clone and has authorized its listing here.
                Voice owners can remove their shared link at any time. All talent self-submit their own ElevenLabs links.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Contact */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <button
                onClick={() => setContactOpen(true)}
                className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-500/25"
              >
                Contact {voice.name.split(' ')[0]}
              </button>
            </div>

            {/* Stats */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
              <h3 className="text-white font-bold mb-4">Profile Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400 text-sm"><Eye size={14} /> Profile Views</span>
                  <span className="text-white font-semibold">{voice.views.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-slate-400 text-sm"><MousePointerClick size={14} /> Contact Clicks</span>
                  <span className="text-white font-semibold">{voice.contact_clicks.toLocaleString()}</span>
                </div>
              </div>
            </div>


            {/* ElevenLabs CTA */}
            <a
              href={voice.elevenlabs_voice_link}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 rounded-2xl bg-gradient-to-r from-sky-500/10 to-blue-600/10 border border-sky-500/30 text-center text-sky-400 font-semibold text-sm hover:from-sky-500/20 hover:to-blue-600/20 transition-all"
            >
              <ExternalLink size={13} className="inline mr-1.5 mb-0.5" />
              Add to ElevenLabs Account
            </a>

            {/* Affiliate CTA */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-4">
              <p className="text-slate-400 text-xs mb-3 leading-relaxed">
                Don't have ElevenLabs yet? Create an account to use this voice and thousands more.
              </p>
              <a
                href={ELEVENLABS_AFFILIATE}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-xl text-center text-sm font-bold transition-all duration-200 bg-gradient-to-r from-sky-500 to-cyan-400 hover:from-sky-400 hover:to-cyan-300 text-slate-950 shadow-lg shadow-sky-500/30 hover:shadow-sky-400/50 hover:scale-[1.02] active:scale-[0.98]"
              >
                Get ElevenLabs Free
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {contactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={e => { if (e.target === e.currentTarget) { setContactOpen(false); setContactError(''); } }}>
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h3 className="text-white font-bold">Contact {voice.name}</h3>
              <button onClick={() => setContactOpen(false)} className="text-slate-500 hover:text-slate-300 transition-colors">✕</button>            </div>
            <div className="p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <BadgeCheck size={24} className="text-emerald-400" />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-2">Message Sent!</h4>
                  <p className="text-slate-400 text-sm">Your inquiry has been sent to {voice.name}. They'll be in touch soon.</p>
                  <button onClick={() => { setSubmitted(false); setContactOpen(false); }} className="mt-5 px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium transition-colors">
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 text-xs font-medium mb-1 block">Your Name *</label>
                      <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-all" />
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs font-medium mb-1 block">Email *</label>
                      <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-medium mb-1 block">Company / Brand</label>
                    <input value={form.company} onChange={e => setForm(f => ({...f, company: e.target.value}))} className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-all" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 text-xs font-medium mb-1 block">Project Type</label>
                      <select value={form.projectType} onChange={e => setForm(f => ({...f, projectType: e.target.value}))} className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-sky-500 transition-all">
                        <option value="">Select type</option>
                        <option>Commercial</option>
                        <option>Narration</option>
                        <option>E-Learning</option>
                        <option>Podcast</option>
                        <option>Gaming</option>
                        <option>Corporate</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs font-medium mb-1 block">Budget</label>
                      <select value={form.budget} onChange={e => setForm(f => ({...f, budget: e.target.value}))} className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-sky-500 transition-all">
                        <option value="">Select range</option>
                        <option>Under $100</option>
                        <option>$100–$300</option>
                        <option>$300–$1,000</option>
                        <option>$1,000+</option>
                        <option>Discuss</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs font-medium mb-1 block">Message *</label>
                    <textarea required rows={4} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} placeholder="Describe your project..." className="w-full px-3 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-all resize-none" />
                  </div>
                  {contactError && (
                    <p className="text-red-400 text-sm">{contactError}</p>
                  )}
                  <button type="submit" disabled={contactLoading} className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-lg shadow-sky-500/25">
                    {contactLoading ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
