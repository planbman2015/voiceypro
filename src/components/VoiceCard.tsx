import { Link } from 'react-router-dom';
import { BadgeCheck, ExternalLink, Globe, Clock, Star } from 'lucide-react';
import type { VoiceProfile } from '../lib/demoData';

const availabilityConfig = {
  available: { label: 'Available', color: 'text-emerald-400', dot: 'bg-emerald-400' },
  busy: { label: 'Busy', color: 'text-amber-400', dot: 'bg-amber-400' },
  unavailable: { label: 'Unavailable', color: 'text-slate-500', dot: 'bg-slate-500' },
};

export default function VoiceCard({ voice }: { voice: VoiceProfile }) {
  const avail = availabilityConfig[voice.availability];

  return (
    <div className="group bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-sky-500/40 hover:bg-slate-800 transition-all duration-300 hover:shadow-xl hover:shadow-sky-500/5">
      {voice.is_featured && (
        <div className="bg-gradient-to-r from-sky-500/20 to-blue-600/20 border-b border-sky-500/20 px-4 py-1.5 flex items-center gap-1.5">
          <Star size={11} className="text-sky-400 fill-sky-400" />
          <span className="text-sky-400 text-xs font-semibold tracking-wide uppercase">Featured</span>
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start gap-4 mb-4">
          <div className="relative flex-shrink-0">
            <img
              src={voice.avatar_url}
              alt={voice.name}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-700 group-hover:ring-sky-500/40 transition-all"
            />
            {voice.is_verified && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center">
                <BadgeCheck size={14} className="text-sky-400" />
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-white font-semibold text-base truncate">{voice.name}</h3>
            </div>
            <p className="text-slate-400 text-xs leading-snug line-clamp-2">{voice.headline}</p>
          </div>
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-3 mb-3 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <Globe size={11} />
            {voice.accent}
          </span>
          <span>·</span>
          <span className="capitalize">{voice.gender}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <div className={`w-1.5 h-1.5 rounded-full ${avail.dot}`} />
            <span className={avail.color}>{avail.label}</span>
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {voice.voice_style_tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300 text-xs">{tag}</span>
          ))}
          {voice.genres.slice(0, 2).map(genre => (
            <span key={genre} className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs">{genre}</span>
          ))}
        </div>

        {/* Languages */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {voice.languages.map(lang => (
            <span key={lang} className="px-2 py-0.5 rounded-md bg-slate-700/50 text-slate-400 text-xs border border-slate-700/50">{lang}</span>
          ))}
        </div>

        <div className="flex items-center justify-between mb-4">
          {voice.commercial_use && (
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">Commercial</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            to={`/voice/${voice.id}`}
            className="flex-1 px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-sm font-medium text-center transition-colors"
          >
            View Profile
          </Link>
          <a
            href={voice.elevenlabs_voice_link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-sm transition-colors flex items-center gap-1.5"
            title="Open in ElevenLabs"
          >
            <ExternalLink size={13} />
            <span className="text-xs">ElevenLabs</span>
          </a>
        </div>
      </div>
    </div>
  );
}
