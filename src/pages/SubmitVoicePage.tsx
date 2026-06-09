import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mic2, ExternalLink, BadgeCheck, AlertCircle, Shield, Music } from 'lucide-react';
import AvatarUpload from '../components/AvatarUpload';
import AudioSampleUpload from '../components/AudioSampleUpload';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { ACCENTS, LANGUAGES, GENRES, VOICE_STYLES } from '../lib/demoData';
import { useSEO } from '../lib/seo';

const ELEVENLABS_LINK_PATTERN = /^https:\/\/(www\.)?elevenlabs\.io\/.+/i;

export default function SubmitVoicePage() {
  useSEO({
    title: 'List Your ElevenLabs Voice',
    description: 'Submit your ElevenLabs Professional Voice Clone to VoiceyPro and get discovered by studios, brands, and content creators looking for your sound.',
    canonical: '/submit',
  });
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const [form, setForm] = useState({
    name: '',
    headline: '',
    bio: '',
    avatar_url: '',
    elevenlabs_voice_link: '',
    accent: '',
    gender: '',
    age_range: '',
    commercial_use: true,
    availability: 'available',
    languages: [] as string[],
    genres: [] as string[],
    voice_style_tags: [] as string[],
    social_linkedin: '',
    social_website: '',
    social_tiktok: '',
    social_fiverr: '',
    demo_audio_url: '',
  });

  function update(key: string, value: string | boolean | string[]) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function toggleArray(key: 'languages' | 'genres' | 'voice_style_tags', val: string) {
    setForm(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(x => x !== val) : [...f[key], val],
    }));
  }

  const elevenlabsLinkValid = ELEVENLABS_LINK_PATTERN.test(form.elevenlabs_voice_link);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) { navigate('/login?redirect=/submit'); return; }
    if (!elevenlabsLinkValid) { setError('Please enter a valid ElevenLabs shared voice link.'); return; }
    if (!confirmed) { setError('You must confirm ownership of the ElevenLabs Professional Voice Clone.'); return; }

    setLoading(true);
    setError('');

    const social_links: Record<string, string> = {};
    if (form.social_linkedin) social_links.linkedin = form.social_linkedin;
    if (form.social_website) social_links.website = form.social_website;
    if (form.social_tiktok) social_links.tiktok = form.social_tiktok;
    if (form.social_fiverr) social_links.fiverr = form.social_fiverr;

    const { error: dbError } = await supabase.from('voice_profiles').insert({
      user_id: user.id,
      name: form.name,
      headline: form.headline,
      bio: form.bio,
      avatar_url: form.avatar_url,
      elevenlabs_voice_link: form.elevenlabs_voice_link,
      accent: form.accent,
      gender: form.gender,
      age_range: form.age_range,
      commercial_use: form.commercial_use,
      availability: form.availability,
      languages: form.languages,
      genres: form.genres,
      voice_style_tags: form.voice_style_tags,
      social_links,
      demo_audio_url: form.demo_audio_url || null,
      status: 'pending',
    });

    setLoading(false);
    if (dbError) { setError(dbError.message); return; }
    navigate('/dashboard?submitted=true');
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 flex items-center justify-center mx-auto mb-5">
            <Mic2 size={28} className="text-sky-400" />
          </div>
          <h2 className="text-white text-2xl font-bold mb-3">Sign in to List Your Voice</h2>
          <p className="text-slate-400 mb-6">Create an account or sign in to submit your ElevenLabs Professional Voice Clone listing.</p>
          <div className="flex flex-col gap-3">
            <Link to="/signup?redirect=/submit" className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold transition-colors">Create Account</Link>
            <Link to="/login?redirect=/submit" className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium border border-slate-700 transition-colors">Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-5">
            <Mic2 size={13} />
            ElevenLabs Voice Talent Listing
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">List Your ElevenLabs Voice</h1>
          <p className="text-slate-400">Only for ElevenLabs Professional Voice Clone owners with a shared link</p>
        </div>

        {/* Requirement Banner */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
          <AlertCircle size={17} className="text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 text-sm font-semibold mb-1">ElevenLabs Professional Voice Clone Required</p>
            <p className="text-amber-400/80 text-xs leading-relaxed">
              You must have an ElevenLabs account with a <strong>Professional Voice Clone</strong> (not Instant Clone).
              Generate a shared link in ElevenLabs: <strong>More actions → Share voice</strong>.
              Listings without a valid shared link will be rejected.
            </p>
            <a href="https://try.elevenlabs.io/xht4ezzxoclw" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-amber-300 hover:text-amber-200 text-xs font-medium transition-colors">
              Don't have ElevenLabs? Get Professional Voice Clone <ExternalLink size={10} />
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-5">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Full Name *</label>
                <input required value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your professional name" className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 text-sm transition-all" />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Professional Headline *</label>
                <input required value={form.headline} onChange={e => update('headline', e.target.value)} placeholder='e.g. "Commercial ElevenLabs Voice | Narration Specialist"' className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 text-sm transition-all" />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Bio *</label>
                <textarea required rows={4} value={form.bio} onChange={e => update('bio', e.target.value)} placeholder="Tell clients about your voice, experience, and what makes your ElevenLabs clone unique..." className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/20 text-sm transition-all resize-none" />
              </div>

              <AvatarUpload
                value={form.avatar_url}
                onChange={url => update('avatar_url', url)}
              />
            </div>
          </div>

          {/* Section: Audio Demo Sample */}
          <div className="bg-slate-800/60 border border-sky-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-sky-500/15 flex items-center justify-center flex-shrink-0">
                <Music size={17} className="text-sky-400" />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg leading-tight">Audio Demo Sample</h2>
                <p className="text-sky-400 text-xs font-medium">Strongly recommended — profiles with a demo get significantly more inquiries</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-3 mb-5">
              Upload a 30–90 second audio clip that showcases your voice. Clients can press play directly
              on your profile page before deciding to reach out. MP3, WAV, OGG, or M4A — max 10 MB.
            </p>
            <AudioSampleUpload
              value={form.demo_audio_url}
              onChange={url => update('demo_audio_url', url)}
            />
          </div>

          {/* Section 2: ElevenLabs Link */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-2">ElevenLabs Shared Voice Link</h2>
            <p className="text-slate-400 text-sm mb-5">This is the most important field. Listings without a valid ElevenLabs Professional Voice Clone link will be rejected.</p>
            <div>
              <label className="text-slate-300 text-sm font-medium mb-1.5 block">ElevenLabs Shared Voice Link *</label>
              <div className="relative">
                <ExternalLink size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  required
                  type="url"
                  value={form.elevenlabs_voice_link}
                  onChange={e => update('elevenlabs_voice_link', e.target.value)}
                  placeholder="https://elevenlabs.io/voice-lab/share/..."
                  className={`w-full pl-10 pr-10 py-3 rounded-xl bg-slate-900 border text-white placeholder-slate-500 focus:outline-none text-sm transition-all ${form.elevenlabs_voice_link && elevenlabsLinkValid ? 'border-emerald-500 focus:border-emerald-400' : form.elevenlabs_voice_link ? 'border-red-500 focus:border-red-400' : 'border-slate-700 focus:border-sky-500'}`}
                />
                {form.elevenlabs_voice_link && (
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    {elevenlabsLinkValid
                      ? <BadgeCheck size={16} className="text-emerald-400" />
                      : <AlertCircle size={16} className="text-red-400" />
                    }
                  </div>
                )}
              </div>
              {form.elevenlabs_voice_link && !elevenlabsLinkValid && (
                <p className="text-red-400 text-xs mt-1.5">Must be a valid ElevenLabs URL (starts with https://elevenlabs.io/...)</p>
              )}
              {elevenlabsLinkValid && (
                <p className="text-emerald-400 text-xs mt-1.5 flex items-center gap-1"><BadgeCheck size={11} /> Valid ElevenLabs link detected</p>
              )}
              <p className="text-slate-500 text-xs mt-2">
                In ElevenLabs: Go to your Professional Voice Clone → More actions → Share voice → Copy link
              </p>
            </div>
          </div>

          {/* Section 3: Voice Details */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-5">Voice Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Accent *</label>
                <select required value={form.accent} onChange={e => update('accent', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:border-sky-500 text-sm transition-all">
                  <option value="">Select accent</option>
                  {ACCENTS.map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Voice Type / Gender</label>
                <select value={form.gender} onChange={e => update('gender', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:border-sky-500 text-sm transition-all">
                  <option value="">Select type</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="neutral">Neutral</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Age Range</label>
                <select value={form.age_range} onChange={e => update('age_range', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:border-sky-500 text-sm transition-all">
                  <option value="">Select range</option>
                  <option>18-25</option><option>25-35</option><option>35-50</option><option>50-65</option><option>65+</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 text-sm font-medium mb-1.5 block">Availability</label>
                <select value={form.availability} onChange={e => update('availability', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:border-sky-500 text-sm transition-all">
                  <option value="available">Available</option>
                  <option value="busy">Currently Busy</option>
                  <option value="unavailable">Unavailable</option>
                </select>
              </div>
            </div>

            {/* Languages */}
            <div className="mb-5">
              <label className="text-slate-300 text-sm font-medium mb-2 block">Languages *</label>
              <div className="flex flex-wrap gap-2">
                {LANGUAGES.map(lang => (
                  <button key={lang} type="button" onClick={() => toggleArray('languages', lang)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${form.languages.includes(lang) ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Genres */}
            <div className="mb-5">
              <label className="text-slate-300 text-sm font-medium mb-2 block">Genres *</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map(genre => (
                  <button key={genre} type="button" onClick={() => toggleArray('genres', genre)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${form.genres.includes(genre) ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                    {genre}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Styles */}
            <div>
              <label className="text-slate-300 text-sm font-medium mb-2 block">Voice Style Tags *</label>
              <div className="flex flex-wrap gap-2">
                {VOICE_STYLES.map(style => (
                  <button key={style} type="button" onClick={() => toggleArray('voice_style_tags', style)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${form.voice_style_tags.includes(style) ? 'bg-emerald-500/80 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                    {style}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Usage Rights */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-4">Usage Rights</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.commercial_use} onChange={e => update('commercial_use', e.target.checked)} className="w-4 h-4 rounded border-slate-600 accent-sky-500" />
              <span className="text-slate-300 text-sm">Available for commercial use</span>
            </label>
          </div>

          {/* Section 5: Social Links */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-5">Social & Portfolio Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: 'social_linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
                { key: 'social_website', label: 'Website', placeholder: 'https://yoursite.com' },
                { key: 'social_tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
                { key: 'social_fiverr', label: 'Fiverr', placeholder: 'https://fiverr.com/...' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="text-slate-300 text-sm font-medium mb-1.5 block">{label}</label>
                  <input type="url" value={(form as Record<string, string>)[key]} onChange={e => update(key, e.target.value)} placeholder={placeholder} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm transition-all" />
                </div>
              ))}
            </div>
          </div>

          {/* Compliance & Confirmation */}
          <div className="bg-slate-800/60 border border-amber-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-5">
              <Shield size={17} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <h2 className="text-white font-bold text-base mb-2">Platform Requirements & Compliance</h2>
                <div className="space-y-2 text-slate-400 text-sm">
                  <p>• This platform is only for voice talent with ElevenLabs Professional Voice Clones.</p>
                  <p>• You must have your own shared ElevenLabs voice link to list here.</p>
                  <p>• This site does not host or create voices. We are a discovery directory only.</p>
                  <p>• Click the shared link to add the voice to your own ElevenLabs account.</p>
                  <p>• Voice owners can remove their shared link at any time.</p>
                  <p>• Admins may reject misleading or unauthorized listings.</p>
                </div>
              </div>
            </div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={e => setConfirmed(e.target.checked)}
                className="w-4 h-4 mt-0.5 rounded border-slate-600 accent-sky-500 cursor-pointer flex-shrink-0"
              />
              <span className="text-slate-300 text-sm leading-relaxed group-hover:text-white transition-colors">
                I confirm that I own an ElevenLabs Professional Voice Clone and have a valid shared voice link.
                I am authorized to share this link on VoiceyPro, and I understand this is a discovery directory only.
              </span>
            </label>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !elevenlabsLinkValid || !confirmed}
            className="w-full py-4 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold text-base transition-all shadow-lg shadow-sky-500/25 hover:shadow-sky-500/40 hover:-translate-y-0.5"
          >
            {loading ? 'Submitting...' : 'Submit Voice for Review'}
          </button>

          {(!elevenlabsLinkValid || !confirmed) && (
            <div className="flex flex-col gap-1.5">
              {!elevenlabsLinkValid && (
                <div className="flex items-center gap-2 text-amber-400 text-xs">
                  <AlertCircle size={12} className="flex-shrink-0" />
                  <span>Enter a valid ElevenLabs shared voice link above to enable submission.</span>
                </div>
              )}
              {!confirmed && (
                <div className="flex items-center gap-2 text-amber-400 text-xs">
                  <AlertCircle size={12} className="flex-shrink-0" />
                  <span>Check the ownership confirmation box above to enable submission.</span>
                </div>
              )}
            </div>
          )}
          <p className="text-center text-slate-500 text-xs">
            Your listing will be reviewed by our team. You'll be notified once approved.
          </p>
        </form>
      </div>
    </div>
  );
}
