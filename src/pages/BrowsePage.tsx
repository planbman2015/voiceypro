import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { useSEO } from '../lib/seo';

const PAGE_SIZE = 12;
import { ACCENTS, LANGUAGES, GENRES, VOICE_STYLES } from '../lib/demoData';
import VoiceCard from '../components/VoiceCard';
import { supabase } from '../lib/supabase';
import type { VoiceProfile } from '../lib/demoData';

const GENDERS = ['male', 'female', 'neutral', 'other'];
const AVAILABILITY = ['available', 'busy', 'unavailable'];

export default function BrowsePage() {
  useSEO({
    title: 'Browse ElevenLabs Voice Talent',
    description: 'Browse and filter professional ElevenLabs voice talent with verified Professional Voice Clone shared links. Find voices by accent, language, style, genre, and more.',
    canonical: '/browse',
  });
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    accent: searchParams.get('accent') || '',
    language: searchParams.get('language') || '',
    genre: searchParams.get('genre') || '',
    gender: searchParams.get('gender') || '',
    availability: '',
    commercialUse: false,
    verifiedOnly: false,
    featured: searchParams.get('featured') === 'true',
    style: '',
  });
  const [sortBy, setSortBy] = useState<'default' | 'newest' | 'popular'>('default');
  const [page, setPage] = useState(1);
  const [voices, setVoices] = useState<VoiceProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from('voice_profiles')
        .select('*')
        .eq('status', 'approved')
        .eq('is_visible', true)
        .order('sort_order', { ascending: true });
      setVoices((data as VoiceProfile[]) || []);
      setLoading(false);
    }
    load();
  }, []);

  function updateFilter(key: string, value: string | boolean | number) {
    setFilters(f => ({ ...f, [key]: value }));
    setPage(1);
  }

  function clearFilters() {
    setFilters({ accent: '', language: '', genre: '', gender: '', availability: '', commercialUse: false, verifiedOnly: false, featured: false, style: '' });
    setQuery('');
    setPage(1);
  }

  const activeFilterCount = Object.entries(filters).filter(([, v]) => {
    if (typeof v === 'boolean') return v;
    return v !== '';
  }).length;

  const filtered = useMemo(() => {
    let results = [...voices];

    if (query.trim()) {
      const q = query.toLowerCase();
      results = results.filter(v =>
        v.name.toLowerCase().includes(q) ||
        v.headline.toLowerCase().includes(q) ||
        v.bio.toLowerCase().includes(q) ||
        v.accent.toLowerCase().includes(q) ||
        v.languages.some(l => l.toLowerCase().includes(q)) ||
        v.genres.some(g => g.toLowerCase().includes(q)) ||
        v.voice_style_tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (filters.accent) results = results.filter(v => v.accent.toLowerCase().includes(filters.accent.toLowerCase()));
    if (filters.language) results = results.filter(v => v.languages.some(l => l.toLowerCase() === filters.language.toLowerCase()));
    if (filters.genre) results = results.filter(v => v.genres.some(g => g.toLowerCase() === filters.genre.toLowerCase()));
    if (filters.gender) results = results.filter(v => v.gender === filters.gender);
    if (filters.availability) results = results.filter(v => v.availability === filters.availability);
    if (filters.commercialUse) results = results.filter(v => v.commercial_use);
    if (filters.verifiedOnly) results = results.filter(v => v.is_verified);
    if (filters.featured) results = results.filter(v => v.is_featured);
    if (filters.style) results = results.filter(v => v.voice_style_tags.some(t => t.toLowerCase() === filters.style.toLowerCase()));
    if (sortBy === 'popular') results = [...results].sort((a, b) => (b.views ?? 0) - (a.views ?? 0));
    if (sortBy === 'newest') results = [...results].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    // 'default' keeps the sort_order from the DB fetch

    return results;
  }, [query, filters, sortBy, voices]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function goToPage(p: number) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-white mb-1">Browse ElevenLabs Voices</h1>
          <p className="text-slate-400 text-sm mb-6">All talent have ElevenLabs Professional Voice Clone shared links</p>

          {/* Search bar */}
          <div className="flex gap-3 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={e => { setQuery(e.target.value); setPage(1); }}
                placeholder="Search voices, accents, styles, genres..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500/30 text-sm transition-all"
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  <X size={14} />
                </button>
              )}
            </div>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${filtersOpen || activeFilterCount > 0 ? 'bg-sky-500/10 border-sky-500/40 text-sky-400' : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600'}`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-xs flex items-center justify-center">{activeFilterCount}</span>
              )}
            </button>
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none pl-4 pr-8 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-sky-500 transition-all cursor-pointer"
              >
                <option value="default">Featured Order</option>
                <option value="popular">Most Popular</option>
                <option value="newest">Newest</option>
              </select>
              <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters Panel */}
        {filtersOpen && (
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold">Filter Voices</h3>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1">
                  <X size={11} /> Clear all
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">Accent</label>
                <select value={filters.accent} onChange={e => updateFilter('accent', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-sky-500 transition-all">
                  <option value="">All Accents</option>
                  {ACCENTS.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">Language</label>
                <select value={filters.language} onChange={e => updateFilter('language', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-sky-500 transition-all">
                  <option value="">All Languages</option>
                  {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">Genre</label>
                <select value={filters.genre} onChange={e => updateFilter('genre', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-sky-500 transition-all">
                  <option value="">All Genres</option>
                  {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">Voice Type</label>
                <select value={filters.gender} onChange={e => updateFilter('gender', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-sky-500 transition-all">
                  <option value="">All Types</option>
                  {GENDERS.map(g => <option key={g} value={g} className="capitalize">{g.charAt(0).toUpperCase() + g.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">Availability</label>
                <select value={filters.availability} onChange={e => updateFilter('availability', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-sky-500 transition-all">
                  <option value="">Any</option>
                  {AVAILABILITY.map(a => <option key={a} value={a} className="capitalize">{a.charAt(0).toUpperCase() + a.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-slate-400 text-xs font-medium mb-1.5 block">Voice Style</label>
                <select value={filters.style} onChange={e => updateFilter('style', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-sky-500 transition-all">
                  <option value="">All Styles</option>
                  {VOICE_STYLES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-3 justify-center">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={filters.commercialUse} onChange={e => updateFilter('commercialUse', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 accent-sky-500 cursor-pointer" />
                  <span className="text-slate-300 text-sm">Commercial use</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={filters.verifiedOnly} onChange={e => updateFilter('verifiedOnly', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 accent-sky-500 cursor-pointer" />
                  <span className="text-slate-300 text-sm">Verified only</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={filters.featured} onChange={e => updateFilter('featured', e.target.checked)}
                    className="w-4 h-4 rounded border-slate-600 bg-slate-900 accent-sky-500 cursor-pointer" />
                  <span className="text-slate-300 text-sm">Featured only</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-400 text-sm">
            {loading ? (
              <span className="text-slate-500">Loading voices...</span>
            ) : (
              <>Showing <span className="text-white font-medium">{filtered.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> of <span className="text-white font-medium">{filtered.length}</span> ElevenLabs voice{filtered.length !== 1 ? 's' : ''}
              {activeFilterCount > 0 && <span className="text-slate-500"> (filtered)</span>}</>
            )}
          </p>
          {!loading && totalPages > 1 && (
            <p className="text-slate-500 text-sm">Page {page} of {totalPages}</p>
          )}
        </div>

        {/* Results grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginated.map(voice => (
                <VoiceCard key={voice.id} voice={voice} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12">
                <button onClick={() => goToPage(page - 1)} disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  <ChevronLeft size={15} /> Prev
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => {
                    const isEllipsisBefore = p === 2 && page > 4;
                    const isEllipsisAfter = p === totalPages - 1 && page < totalPages - 3;
                    const isVisible = p === 1 || p === totalPages || Math.abs(p - page) <= 1;
                    if (!isVisible && !isEllipsisBefore && !isEllipsisAfter) return null;
                    if (isEllipsisBefore || isEllipsisAfter) {
                      return <span key={p} className="px-1 text-slate-600 text-sm select-none">…</span>;
                    }
                    return (
                      <button key={p} onClick={() => goToPage(p)}
                        className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${p === page ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25' : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                        {p}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => goToPage(page + 1)} disabled={page === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium hover:bg-slate-700 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                  Next <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-slate-600" />
            </div>
            <h3 className="text-white font-semibold mb-2">No voices found</h3>
            <p className="text-slate-500 text-sm mb-4">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors">
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
