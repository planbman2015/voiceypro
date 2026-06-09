import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield, CheckCircle, XCircle, Eye, AlertTriangle, Search,
  BadgeCheck, Mic2, Star, Plus, Pencil, Trash2, X, Save,
  Users, LayoutDashboard, Music, ChevronUp, ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import AvatarUpload from '../components/AvatarUpload';
import AudioSampleUpload from '../components/AudioSampleUpload';
import { useSEO } from '../lib/seo';

type VoiceProfile = {
  id: string;
  user_id: string;
  name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  elevenlabs_voice_link: string;
  voice_style_tags: string[];
  languages: string[];
  accent: string;
  gender: string;
  age_range: string;
  genres: string[];
  commercial_use: boolean;
  pricing_text: string;
  pricing_min: number;
  pricing_max: number;
  availability: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string;
  is_featured: boolean;
  is_verified: boolean;
  is_visible: boolean;
  created_at: string;
  demo_audio_url: string | null;
  sort_order: number;
};

const EMPTY_PROFILE: Omit<VoiceProfile, 'id' | 'created_at'> = {
  user_id: '',
  name: '',
  headline: '',
  bio: '',
  avatar_url: '',
  elevenlabs_voice_link: '',
  voice_style_tags: [],
  languages: ['English'],
  accent: '',
  gender: '',
  age_range: '',
  genres: [],
  commercial_use: true,
  pricing_text: '',
  pricing_min: 0,
  pricing_max: 0,
  availability: 'available',
  status: 'approved',
  rejection_reason: '',
  is_featured: false,
  is_verified: true,
  is_visible: true,
  demo_audio_url: null,
  sort_order: 0,
};

const ELEVENLABS_PATTERN = /^https:\/\/(www\.)?elevenlabs\.io\/.+/i;
const GENDER_OPTIONS = ['', 'male', 'female', 'neutral', 'other'];
const AVAILABILITY_OPTIONS = ['available', 'busy', 'unavailable'];
const STATUS_OPTIONS = ['pending', 'approved', 'rejected'] as const;
const STYLE_TAG_SUGGESTIONS = ['Warm', 'Deep', 'Smooth', 'Energetic', 'Authoritative', 'Conversational', 'Gravelly', 'Bright', 'Soft', 'Dramatic'];
const GENRE_SUGGESTIONS = ['Commercial', 'Narration', 'Character', 'ASMR', 'Corporate', 'Podcast', 'Animation', 'Documentary', 'E-Learning', 'Gaming'];

type Tab = 'moderation' | 'talent';

export default function AdminPage() {
  useSEO({ title: 'Admin', canonical: '/admin', noindex: true });
  const { profile, user } = useAuth();
  const [tab, setTab] = useState<Tab>('moderation');

  // --- Moderation state ---
  const [submissions, setSubmissions] = useState<VoiceProfile[]>([]);
  const [loadingMod, setLoadingMod] = useState(true);
  const [modFilter, setModFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [modQuery, setModQuery] = useState('');
  const [rejectModal, setRejectModal] = useState<{ id: string; name: string } | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [processing, setProcessing] = useState<string | null>(null);

  // --- Talent manager state ---
  const [talents, setTalents] = useState<VoiceProfile[]>([]);
  const [loadingTalents, setLoadingTalents] = useState(false);
  const [talentQuery, setTalentQuery] = useState('');
  const [talentStatusFilter, setTalentStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [editModal, setEditModal] = useState<Partial<VoiceProfile> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [tagInput, setTagInput] = useState('');
  const [genreInput, setGenreInput] = useState('');
  const [langInput, setLangInput] = useState('');

  useEffect(() => {
    if (profile?.role !== 'admin') return;
    if (tab === 'moderation') loadSubmissions();
    else loadTalents();
  }, [profile, tab]);

  async function loadSubmissions() {
    setLoadingMod(true);
    const { data } = await supabase
      .from('voice_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    setSubmissions(data || []);
    setLoadingMod(false);
  }

  async function loadTalents() {
    setLoadingTalents(true);
    const { data } = await supabase
      .from('voice_profiles')
      .select('*')
      .order('sort_order', { ascending: true });
    setTalents(data || []);
    setLoadingTalents(false);
  }

  // --- Moderation actions ---
  async function approve(id: string) {
    setProcessing(id);
    await supabase.from('voice_profiles').update({ status: 'approved', is_verified: true, rejection_reason: '' }).eq('id', id);
    setSubmissions(ss => ss.map(s => s.id === id ? { ...s, status: 'approved', is_verified: true } : s));
    setProcessing(null);
  }

  async function reject(id: string, reason: string) {
    setProcessing(id);
    await supabase.from('voice_profiles').update({ status: 'rejected', rejection_reason: reason }).eq('id', id);
    setSubmissions(ss => ss.map(s => s.id === id ? { ...s, status: 'rejected', rejection_reason: reason } : s));
    setProcessing(null);
    setRejectModal(null);
    setRejectReason('');
  }

  async function toggleFeatured(id: string, current: boolean) {
    await supabase.from('voice_profiles').update({ is_featured: !current }).eq('id', id);
    setSubmissions(ss => ss.map(s => s.id === id ? { ...s, is_featured: !current } : s));
  }

  async function removeAudio(id: string) {
    await supabase.from('voice_profiles').update({ demo_audio_url: null }).eq('id', id);
    setSubmissions(ss => ss.map(s => s.id === id ? { ...s, demo_audio_url: null } : s));
    setTalents(ts => ts.map(t => t.id === id ? { ...t, demo_audio_url: null } : t));
  }

  async function deleteSubmission(id: string) {
    await supabase.from('voice_profiles').delete().eq('id', id);
    setSubmissions(ss => ss.filter(s => s.id !== id));
    setDeleteConfirm(null);
  }

  // --- Talent manager actions ---
  function openNew() {
    setIsNew(true);
    setEditModal({ ...EMPTY_PROFILE });
    setTagInput('');
    setGenreInput('');
    setLangInput('');
  }

  function openEdit(t: VoiceProfile) {
    setIsNew(false);
    setEditModal({ ...t });
    setTagInput('');
    setGenreInput('');
    setLangInput('');
  }

  function closeEdit() {
    setEditModal(null);
    setIsNew(false);
  }

  function setField<K extends keyof VoiceProfile>(key: K, value: VoiceProfile[K]) {
    setEditModal(prev => prev ? { ...prev, [key]: value } : prev);
  }

  function addTag(field: 'voice_style_tags' | 'genres' | 'languages', value: string) {
    if (!value.trim()) return;
    const current = (editModal?.[field] as string[]) ?? [];
    if (!current.includes(value.trim())) {
      setField(field, [...current, value.trim()] as any);
    }
    if (field === 'voice_style_tags') setTagInput('');
    if (field === 'genres') setGenreInput('');
    if (field === 'languages') setLangInput('');
  }

  function removeTag(field: 'voice_style_tags' | 'genres' | 'languages', value: string) {
    const current = (editModal?.[field] as string[]) ?? [];
    setField(field, current.filter(v => v !== value) as any);
  }

  async function saveTalent() {
    if (!editModal) return;
    setSaving(true);
    if (isNew) {
      const payload = { ...editModal };
      if (!payload.user_id) payload.user_id = user?.id ?? '';
      const { data, error } = await supabase.from('voice_profiles').insert(payload).select().maybeSingle();
      if (!error && data) {
        setTalents(prev => [data as VoiceProfile, ...prev]);
        setSubmissions(prev => [data as VoiceProfile, ...prev]);
      }
    } else {
      const { id, created_at, ...rest } = editModal as VoiceProfile;
      const { data, error } = await supabase.from('voice_profiles').update(rest).eq('id', id).select().maybeSingle();
      if (!error && data) {
        setTalents(prev => prev.map(t => t.id === id ? data as VoiceProfile : t));
        setSubmissions(prev => prev.map(s => s.id === id ? data as VoiceProfile : s));
      }
    }
    setSaving(false);
    closeEdit();
  }

  async function deleteTalent(id: string) {
    await supabase.from('voice_profiles').delete().eq('id', id);
    setTalents(prev => prev.filter(t => t.id !== id));
    setDeleteConfirm(null);
  }

  async function moveTalent(index: number, direction: 'up' | 'down') {
    const list = [...filteredTalents];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= list.length) return;

    const a = list[index];
    const b = list[swapIndex];

    // Use positional indices as canonical sort_order values to avoid collisions
    const newAOrder = swapIndex;
    const newBOrder = index;

    await Promise.all([
      supabase.from('voice_profiles').update({ sort_order: newAOrder }).eq('id', a.id),
      supabase.from('voice_profiles').update({ sort_order: newBOrder }).eq('id', b.id),
    ]);

    setTalents(prev => {
      const updated = prev.map(t => {
        if (t.id === a.id) return { ...t, sort_order: newAOrder };
        if (t.id === b.id) return { ...t, sort_order: newBOrder };
        return t;
      });
      return updated.sort((x, y) => x.sort_order - y.sort_order);
    });
  }

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <Shield size={40} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-white text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-slate-400 mb-4">Admin access required.</p>
          <Link to="/" className="px-5 py-2.5 rounded-xl bg-sky-500 text-white font-medium">Go Home</Link>
        </div>
      </div>
    );
  }

  const modCounts = {
    all: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    approved: submissions.filter(s => s.status === 'approved').length,
    rejected: submissions.filter(s => s.status === 'rejected').length,
  };

  const filteredMod = submissions
    .filter(s => modFilter === 'all' || s.status === modFilter)
    .filter(s => !modQuery || s.name.toLowerCase().includes(modQuery.toLowerCase()) || s.headline.toLowerCase().includes(modQuery.toLowerCase()));

  const filteredTalents = talents
    .filter(t => talentStatusFilter === 'all' || t.status === talentStatusFilter)
    .filter(t => !talentQuery || t.name.toLowerCase().includes(talentQuery.toLowerCase()) || t.headline.toLowerCase().includes(talentQuery.toLowerCase()));

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-sky-500/20 flex items-center justify-center">
            <Shield size={20} className="text-sky-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">SuperAdmin Panel</h1>
            <p className="text-slate-400 text-sm">Full control over listings and moderation</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-800/60 border border-slate-700/50 rounded-xl mb-8 w-fit">
          <button
            onClick={() => setTab('moderation')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'moderation' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            <LayoutDashboard size={15} /> Moderation
          </button>
          <button
            onClick={() => setTab('talent')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === 'talent' ? 'bg-sky-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            <Users size={15} /> Talent Manager
          </button>
        </div>

        {/* ── MODERATION TAB ── */}
        {tab === 'moderation' && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Total', count: modCounts.all, color: 'text-white' },
                { label: 'Pending', count: modCounts.pending, color: 'text-amber-400' },
                { label: 'Approved', count: modCounts.approved, color: 'text-emerald-400' },
                { label: 'Rejected', count: modCounts.rejected, color: 'text-red-400' },
              ].map(({ label, count, color }) => (
                <div key={label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
                  <div className={`text-2xl font-bold mb-0.5 ${color}`}>{count}</div>
                  <div className="text-slate-500 text-xs">{label}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={modQuery}
                  onChange={e => setModQuery(e.target.value)}
                  placeholder="Search by name or headline..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 transition-all"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                  <button key={f} onClick={() => setModFilter(f)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors capitalize ${modFilter === f ? 'bg-sky-500 text-white' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'}`}
                  >
                    {f} {modCounts[f] > 0 && <span className="ml-1 opacity-70">({modCounts[f]})</span>}
                  </button>
                ))}
              </div>
            </div>

            {loadingMod ? (
              <div className="text-center py-16"><div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : filteredMod.length === 0 ? (
              <div className="text-center py-16"><p className="text-slate-500">No listings found</p></div>
            ) : (
              <div className="space-y-4">
                {filteredMod.map(s => {
                  const linkValid = ELEVENLABS_PATTERN.test(s.elevenlabs_voice_link);
                  return (
                    <div key={s.id} className={`bg-slate-800/60 border rounded-2xl overflow-hidden ${s.status === 'pending' ? 'border-amber-500/20' : s.status === 'approved' ? 'border-emerald-500/10' : 'border-red-500/10'}`}>
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-shrink-0">
                            {s.avatar_url ? (
                              <img src={s.avatar_url} alt={s.name} className="w-14 h-14 rounded-xl object-cover" />
                            ) : (
                              <div className="w-14 h-14 rounded-xl bg-slate-700 flex items-center justify-center">
                                <Mic2 size={20} className="text-slate-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="text-white font-bold">{s.name}</h3>
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${s.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : s.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                                {s.status}
                              </span>
                              {s.is_featured && <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-xs"><Star size={9} /> Featured</span>}
                            </div>
                            <p className="text-slate-400 text-xs mb-3">{s.headline}</p>
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-2 ${linkValid ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                              {linkValid ? <BadgeCheck size={13} className="text-emerald-400 flex-shrink-0" /> : <AlertTriangle size={13} className="text-red-400 flex-shrink-0" />}
                              <a href={s.elevenlabs_voice_link} target="_blank" rel="noopener noreferrer" className={`text-xs truncate hover:underline ${linkValid ? 'text-emerald-400' : 'text-red-400'}`}>{s.elevenlabs_voice_link || 'NO LINK PROVIDED'}</a>
                              {!linkValid && <span className="text-red-400 text-xs font-semibold flex-shrink-0">INVALID</span>}
                            </div>
                            {s.status === 'rejected' && s.rejection_reason && <p className="text-red-400 text-xs mt-2">Reason: {s.rejection_reason}</p>}
                            <p className="text-slate-600 text-xs mt-2">Submitted: {new Date(s.created_at).toLocaleDateString()}</p>
                            {s.demo_audio_url && (
                              <div className="flex items-center gap-2 mt-2 px-3 py-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 w-fit">
                                <Music size={12} className="text-sky-400 flex-shrink-0" />
                                <span className="text-sky-400 text-xs">Audio sample uploaded</span>
                                <button
                                  onClick={() => removeAudio(s.id)}
                                  className="ml-1 flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/15 hover:bg-red-500/30 text-red-400 text-xs transition-colors"
                                >
                                  <Trash2 size={10} /> Remove
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="flex sm:flex-col gap-2 flex-shrink-0">
                            {s.status === 'approved' && (
                              <Link to={`/voice/${s.id}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-colors">
                                <Eye size={12} /> View
                              </Link>
                            )}
                            <button onClick={() => openEdit(s)}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 text-xs transition-colors">
                              <Pencil size={12} /> Edit
                            </button>
                            {s.status !== 'approved' && (
                              <button onClick={() => approve(s.id)} disabled={!linkValid || processing === s.id}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 text-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                                <CheckCircle size={12} /> {processing === s.id ? '...' : 'Approve'}
                              </button>
                            )}
                            {s.status !== 'rejected' && (
                              <button onClick={() => setRejectModal({ id: s.id, name: s.name })} disabled={processing === s.id}
                                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs transition-colors">
                                <XCircle size={12} /> Reject
                              </button>
                            )}
                            <button onClick={() => toggleFeatured(s.id, s.is_featured)}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs transition-colors ${s.is_featured ? 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30' : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'}`}>
                              <Star size={12} /> {s.is_featured ? 'Unfeature' : 'Feature'}
                            </button>
                            <button onClick={() => setDeleteConfirm({ id: s.id, name: s.name })}
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs transition-colors">
                              <Trash2 size={12} /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── TALENT MANAGER TAB ── */}
        {tab === 'talent' && (
          <>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  value={talentQuery}
                  onChange={e => setTalentQuery(e.target.value)}
                  placeholder="Search talent by name or headline..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 transition-all"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                  <button key={f} onClick={() => setTalentStatusFilter(f)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors capitalize ${talentStatusFilter === f ? 'bg-sky-500 text-white' : 'bg-slate-800 border border-slate-700 text-slate-400 hover:text-white'}`}
                  >
                    {f}
                  </button>
                ))}
                <button onClick={openNew}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-semibold transition-colors shadow-lg shadow-emerald-500/20">
                  <Plus size={15} /> Add Talent
                </button>
              </div>
            </div>

            {loadingTalents ? (
              <div className="text-center py-16"><div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>
            ) : filteredTalents.length === 0 ? (
              <div className="text-center py-16"><p className="text-slate-500">No talent found</p></div>
            ) : (
              <div className="overflow-x-auto rounded-2xl border border-slate-700/50">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-800/80 border-b border-slate-700/50">
                      <th className="text-left px-4 py-3 text-slate-400 font-medium w-20">Order</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium">Talent</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium hidden md:table-cell">Headline</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium hidden sm:table-cell">Status</th>
                      <th className="text-left px-4 py-3 text-slate-400 font-medium hidden lg:table-cell">Flags</th>
                      <th className="text-right px-4 py-3 text-slate-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {filteredTalents.map((t, idx) => (
                      <tr key={t.id} className="bg-slate-800/30 hover:bg-slate-800/60 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex flex-col items-center gap-0.5">
                            <button
                              onClick={() => moveTalent(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronUp size={14} />
                            </button>
                            <span className="text-slate-500 text-xs font-mono w-6 text-center">{idx + 1}</span>
                            <button
                              onClick={() => moveTalent(idx, 'down')}
                              disabled={idx === filteredTalents.length - 1}
                              className="p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                            >
                              <ChevronDown size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {t.avatar_url ? (
                              <img src={t.avatar_url} alt={t.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center flex-shrink-0">
                                <Mic2 size={14} className="text-slate-500" />
                              </div>
                            )}
                            <span className="text-white font-medium truncate max-w-[140px]">{t.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">
                          <span className="text-slate-400 truncate max-w-[200px] block">{t.headline}</span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${t.status === 'pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : t.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'}`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {t.is_featured && <span className="px-1.5 py-0.5 rounded text-xs bg-sky-500/10 text-sky-400 border border-sky-500/20">Featured</span>}
                            {t.is_verified && <span className="px-1.5 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Verified</span>}
                            {!t.is_visible && <span className="px-1.5 py-0.5 rounded text-xs bg-slate-600 text-slate-400">Hidden</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(t)}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 text-xs transition-colors">
                              <Pencil size={11} /> Edit
                            </button>
                            <button onClick={() => setDeleteConfirm({ id: t.id, name: t.name })}
                              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-colors">
                              <Trash2 size={11} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── REJECT MODAL ── */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">Reject Listing</h3>
            <p className="text-slate-400 text-sm mb-4">Rejecting <strong className="text-white">{rejectModal.name}</strong>. Provide a reason shown to the talent.</p>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)} rows={3}
              placeholder="e.g. Invalid ElevenLabs link, broken link..."
              className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-red-500 resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors">Cancel</button>
              <button onClick={() => reject(rejectModal.id, rejectReason)} disabled={!rejectReason.trim()}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-semibold transition-colors">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRM MODAL ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                <Trash2 size={18} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-bold">Delete Talent</h3>
                <p className="text-slate-400 text-sm">This cannot be undone.</p>
              </div>
            </div>
            <p className="text-slate-300 text-sm mb-5">Are you sure you want to permanently delete <strong className="text-white">{deleteConfirm.name}</strong>?</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors">Cancel</button>
              <button onClick={() => tab === 'moderation' ? deleteSubmission(deleteConfirm.id) : deleteTalent(deleteConfirm.id)}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── EDIT / ADD MODAL ── */}
      {editModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl my-4">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500/20 flex items-center justify-center">
                  {isNew ? <Plus size={15} className="text-sky-400" /> : <Pencil size={14} className="text-sky-400" />}
                </div>
                <h2 className="text-white font-bold text-lg">{isNew ? 'Add New Talent' : `Edit — ${editModal.name}`}</h2>
              </div>
              <button onClick={closeEdit} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Basic info */}
              <section>
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">Basic Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Name *</label>
                    <input value={editModal.name ?? ''} onChange={e => setField('name', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Headline</label>
                    <input value={editModal.headline ?? ''} onChange={e => setField('headline', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-all" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 text-xs mb-1.5">Bio</label>
                    <textarea value={editModal.bio ?? ''} onChange={e => setField('bio', e.target.value)} rows={3}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 resize-none transition-all" />
                  </div>
                  <div className="sm:col-span-2">
                    <AvatarUpload
                      value={editModal.avatar_url ?? ''}
                      onChange={url => setField('avatar_url', url)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <AudioSampleUpload
                      value={editModal.demo_audio_url ?? ''}
                      onChange={url => setField('demo_audio_url', url as any)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-slate-400 text-xs mb-1.5">ElevenLabs Voice Link *</label>
                    <input value={editModal.elevenlabs_voice_link ?? ''} onChange={e => setField('elevenlabs_voice_link', e.target.value)}
                      className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 border text-white text-sm focus:outline-none transition-all ${ELEVENLABS_PATTERN.test(editModal.elevenlabs_voice_link ?? '') ? 'border-emerald-500/50 focus:border-emerald-500' : 'border-slate-700 focus:border-sky-500'}`} />
                    {editModal.elevenlabs_voice_link && !ELEVENLABS_PATTERN.test(editModal.elevenlabs_voice_link) && (
                      <p className="text-amber-400 text-xs mt-1">Must be a valid elevenlabs.io URL</p>
                    )}
                  </div>
                </div>
              </section>

              {/* Voice Details */}
              <section>
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">Voice Details</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Gender</label>
                    <select value={editModal.gender ?? ''} onChange={e => setField('gender', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 capitalize">
                      {GENDER_OPTIONS.map(g => <option key={g} value={g}>{g || 'Not specified'}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Age Range</label>
                    <input value={editModal.age_range ?? ''} onChange={e => setField('age_range', e.target.value)} placeholder="e.g. 25–40"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Accent</label>
                    <input value={editModal.accent ?? ''} onChange={e => setField('accent', e.target.value)} placeholder="e.g. American"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-all" />
                  </div>
                </div>

                {/* Style Tags */}
                <div className="mt-4">
                  <label className="block text-slate-400 text-xs mb-1.5">Style Tags</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(editModal.voice_style_tags ?? []).map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-300 text-xs border border-sky-500/20">
                        {tag}
                        <button onClick={() => removeTag('voice_style_tags', tag)} className="hover:text-white ml-0.5"><X size={9} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {STYLE_TAG_SUGGESTIONS.filter(s => !(editModal.voice_style_tags ?? []).includes(s)).map(s => (
                      <button key={s} onClick={() => addTag('voice_style_tags', s)}
                        className="px-2 py-0.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-colors">+ {s}</button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('voice_style_tags', tagInput))}
                      placeholder="Custom tag..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500" />
                    <button onClick={() => addTag('voice_style_tags', tagInput)} className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm transition-colors">Add</button>
                  </div>
                </div>

                {/* Genres */}
                <div className="mt-4">
                  <label className="block text-slate-400 text-xs mb-1.5">Genres</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(editModal.genres ?? []).map(g => (
                      <span key={g} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 text-xs border border-blue-500/20">
                        {g}
                        <button onClick={() => removeTag('genres', g)} className="hover:text-white ml-0.5"><X size={9} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {GENRE_SUGGESTIONS.filter(g => !(editModal.genres ?? []).includes(g)).map(g => (
                      <button key={g} onClick={() => addTag('genres', g)}
                        className="px-2 py-0.5 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs transition-colors">+ {g}</button>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input value={genreInput} onChange={e => setGenreInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('genres', genreInput))}
                      placeholder="Custom genre..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500" />
                    <button onClick={() => addTag('genres', genreInput)} className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm transition-colors">Add</button>
                  </div>
                </div>

                {/* Languages */}
                <div className="mt-4">
                  <label className="block text-slate-400 text-xs mb-1.5">Languages</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {(editModal.languages ?? []).map(l => (
                      <span key={l} className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs border border-emerald-500/20">
                        {l}
                        <button onClick={() => removeTag('languages', l)} className="hover:text-white ml-0.5"><X size={9} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <input value={langInput} onChange={e => setLangInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('languages', langInput))}
                      placeholder="Add language..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500" />
                    <button onClick={() => addTag('languages', langInput)} className="px-3 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-sm transition-colors">Add</button>
                  </div>
                </div>
              </section>

              {/* Pricing & Availability */}
              <section>
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">Pricing & Availability</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Pricing Text</label>
                    <input value={editModal.pricing_text ?? ''} onChange={e => setField('pricing_text', e.target.value)} placeholder="e.g. Starting at $50"
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Min Price ($)</label>
                    <input type="number" value={editModal.pricing_min ?? 0} onChange={e => setField('pricing_min', Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Max Price ($)</label>
                    <input type="number" value={editModal.pricing_max ?? 0} onChange={e => setField('pricing_max', Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-all" />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Availability</label>
                    <select value={editModal.availability ?? 'available'} onChange={e => setField('availability', e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 capitalize">
                      {AVAILABILITY_OPTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 pt-5">
                    <input type="checkbox" id="commercial_use" checked={editModal.commercial_use ?? true} onChange={e => setField('commercial_use', e.target.checked)}
                      className="w-4 h-4 accent-sky-500" />
                    <label htmlFor="commercial_use" className="text-slate-300 text-sm">Commercial Use</label>
                  </div>
                </div>
              </section>

              {/* Admin Controls */}
              <section>
                <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wide mb-3">Admin Controls</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-400 text-xs mb-1.5">Status</label>
                    <select value={editModal.status ?? 'pending'} onChange={e => setField('status', e.target.value as any)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 capitalize">
                      {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-3 pt-1">
                    {[
                      { key: 'is_featured', label: 'Featured' },
                      { key: 'is_verified', label: 'Verified' },
                      { key: 'is_visible', label: 'Visible' },
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2">
                        <input type="checkbox" id={key} checked={(editModal as any)[key] ?? false} onChange={e => setField(key as any, e.target.checked)}
                          className="w-4 h-4 accent-sky-500" />
                        <label htmlFor={key} className="text-slate-300 text-sm">{label}</label>
                      </div>
                    ))}
                  </div>
                  {editModal.status === 'rejected' && (
                    <div className="sm:col-span-2">
                      <label className="block text-slate-400 text-xs mb-1.5">Rejection Reason</label>
                      <input value={editModal.rejection_reason ?? ''} onChange={e => setField('rejection_reason', e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-red-500/30 text-white text-sm focus:outline-none focus:border-red-500 transition-all" />
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-700">
              <button onClick={closeEdit} className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors">Cancel</button>
              <button onClick={saveTalent} disabled={saving || !editModal.name?.trim()}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-sky-500/20">
                <Save size={14} /> {saving ? 'Saving...' : isNew ? 'Create Talent' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
