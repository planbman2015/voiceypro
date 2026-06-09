import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Mic2, Eye, MousePointerClick, Trash2, ExternalLink,
  BadgeCheck, Clock, XCircle, CheckCircle, Plus, AlertCircle,
  EyeOff, Edit2, Save, X, Shield, ChevronDown, ChevronUp
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import AvatarUpload from '../components/AvatarUpload';
import AudioSampleUpload from '../components/AudioSampleUpload';
import { ACCENTS, LANGUAGES, GENRES, VOICE_STYLES } from '../lib/demoData';
import { useSEO } from '../lib/seo';

type VoiceProfile = {
  id: string;
  name: string;
  headline: string;
  bio: string;
  avatar_url: string;
  elevenlabs_voice_link: string;
  accent: string;
  gender: string;
  age_range: string;
  languages: string[];
  genres: string[];
  voice_style_tags: string[];
  commercial_use: boolean;
  availability: string;
  social_links: Record<string, string>;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string;
  views: number;
  contact_clicks: number;
  is_visible: boolean;
  is_featured: boolean;
  is_verified: boolean;
  created_at: string;
  demo_audio_url: string | null;
};

type EditForm = Omit<VoiceProfile, 'id' | 'status' | 'rejection_reason' | 'views' | 'contact_clicks' | 'is_featured' | 'is_verified' | 'created_at'> & { demo_audio_url: string };

const ELEVENLABS_LINK_PATTERN = /^https:\/\/(www\.)?elevenlabs\.io\/.+/i;

const statusConfig = {
  pending: { label: 'Under Review', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
  approved: { label: 'Live', icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
  rejected: { label: 'Rejected', icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

function profileToForm(p: VoiceProfile): EditForm {
  return {
    name: p.name,
    headline: p.headline,
    bio: p.bio,
    avatar_url: p.avatar_url,
    elevenlabs_voice_link: p.elevenlabs_voice_link,
    accent: p.accent,
    gender: p.gender,
    age_range: p.age_range,
    languages: p.languages || [],
    genres: p.genres || [],
    voice_style_tags: p.voice_style_tags || [],
    commercial_use: p.commercial_use,
    availability: p.availability,
    is_visible: p.is_visible,
    social_links: p.social_links || {},
    demo_audio_url: p.demo_audio_url || '',
  };
}

export default function DashboardPage() {
  useSEO({ title: 'Dashboard', canonical: '/dashboard', noindex: true });
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [profiles, setProfiles] = useState<VoiceProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Edit modal
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditForm | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const [originalLink, setOriginalLink] = useState('');

  // Account deletion
  const [showDeleteAccount, setShowDeleteAccount] = useState(false);
  const [deleteAccountConfirm, setDeleteAccountConfirm] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [deleteAccountError, setDeleteAccountError] = useState('');

  const justSubmitted = searchParams.get('submitted') === 'true';

  useEffect(() => {
    if (user) loadProfiles();
  }, [user]);

  async function loadProfiles() {
    const { data } = await supabase
      .from('voice_profiles')
      .select('id, name, headline, bio, avatar_url, elevenlabs_voice_link, accent, gender, age_range, languages, genres, voice_style_tags, commercial_use, availability, social_links, status, rejection_reason, views, contact_clicks, is_visible, is_featured, is_verified, created_at, demo_audio_url')
      .eq('user_id', user!.id)
      .order('created_at', { ascending: false });
    setProfiles(data || []);
    setLoading(false);
  }

  async function toggleVisibility(id: string, current: boolean) {
    await supabase.from('voice_profiles').update({ is_visible: !current }).eq('id', id);
    setProfiles(ps => ps.map(p => p.id === id ? { ...p, is_visible: !current } : p));
  }

  async function deleteProfile(id: string) {
    await supabase.from('voice_profiles').delete().eq('id', id);
    setProfiles(ps => ps.filter(p => p.id !== id));
    setDeleteConfirm(null);
  }

  function openEdit(p: VoiceProfile) {
    setEditId(p.id);
    setEditForm(profileToForm(p));
    setOriginalLink(p.elevenlabs_voice_link);
    setEditError('');
  }

  function closeEdit() {
    setEditId(null);
    setEditForm(null);
    setEditError('');
  }

  function setField(key: keyof EditForm, value: string | boolean | string[] | Record<string, string>) {
    setEditForm(f => f ? { ...f, [key]: value } : f);
  }

  function toggleArray(key: 'languages' | 'genres' | 'voice_style_tags', val: string) {
    if (!editForm) return;
    const arr = editForm[key] as string[];
    setField(key, arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  }

  async function saveEdit() {
    if (!editForm || !editId) return;
    const linkValid = ELEVENLABS_LINK_PATTERN.test(editForm.elevenlabs_voice_link);
    if (!linkValid) { setEditError('Please enter a valid ElevenLabs shared voice link.'); return; }

    setEditSaving(true);
    setEditError('');

    const linkChanged = editForm.elevenlabs_voice_link !== originalLink;
    const updatePayload: Record<string, unknown> = {
      name: editForm.name,
      headline: editForm.headline,
      bio: editForm.bio,
      avatar_url: editForm.avatar_url,
      elevenlabs_voice_link: editForm.elevenlabs_voice_link,
      accent: editForm.accent,
      gender: editForm.gender,
      age_range: editForm.age_range,
      languages: editForm.languages,
      genres: editForm.genres,
      voice_style_tags: editForm.voice_style_tags,
      commercial_use: editForm.commercial_use,
      availability: editForm.availability,
      is_visible: editForm.is_visible,
      social_links: editForm.social_links,
      demo_audio_url: editForm.demo_audio_url || null,
    };

    // Changing the ElevenLabs link resets to pending for re-review
    if (linkChanged) updatePayload.status = 'pending';

    const { error } = await supabase.from('voice_profiles').update(updatePayload).eq('id', editId);

    setEditSaving(false);
    if (error) { setEditError(error.message); return; }

    await loadProfiles();
    closeEdit();
  }

  async function handleDeleteAccount() {
    if (deleteAccountConfirm !== 'DELETE') return;
    setDeletingAccount(true);
    setDeleteAccountError('');

    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-account`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setDeleteAccountError(body.error || 'Failed to delete account. Please try again.');
      setDeletingAccount(false);
      return;
    }

    await signOut();
    navigate('/');
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-3">Sign in required</h2>
          <Link to="/login" className="px-5 py-2.5 rounded-xl bg-sky-500 text-white font-medium">Sign In</Link>
        </div>
      </div>
    );
  }

  const elevenlabsLinkValid = editForm ? ELEVENLABS_LINK_PATTERN.test(editForm.elevenlabs_voice_link) : false;

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">
              Welcome, {profile?.full_name?.split(' ')[0] || 'there'}
            </h1>
            <p className="text-slate-400 text-sm">Manage your ElevenLabs voice listings</p>
          </div>
          <Link to="/submit" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-500/25">
            <Plus size={15} /> Add Voice
          </Link>
        </div>

        {/* Submitted Banner */}
        {justSubmitted && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 mb-6 flex items-center gap-3">
            <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
            <div>
              <p className="text-emerald-300 font-semibold text-sm">Voice Listing Submitted!</p>
              <p className="text-emerald-400/70 text-xs">Your listing is under review. You'll see the status below once approved.</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-2 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400 text-sm">Loading your listings...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="text-center py-20 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
            <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-5">
              <Mic2 size={28} className="text-slate-600" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">No listings yet</h3>
            <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">
              Submit your ElevenLabs Professional Voice Clone to get discovered by clients.
            </p>
            <Link to="/submit" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-colors">
              <Plus size={15} /> List Your ElevenLabs Voice
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {profiles.map(p => {
              const statusInfo = statusConfig[p.status];
              const StatusIcon = statusInfo.icon;
              return (
                <div key={p.id} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-shrink-0">
                        {p.avatar_url ? (
                          <img src={p.avatar_url} alt={p.name} className="w-14 h-14 rounded-xl object-cover" />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-slate-700 flex items-center justify-center">
                            <Mic2 size={20} className="text-slate-500" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-white font-bold text-base">{p.name}</h3>
                          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs font-medium ${statusInfo.bg} ${statusInfo.border} ${statusInfo.color}`}>
                            <StatusIcon size={10} />
                            {statusInfo.label}
                          </span>
                          {!p.is_visible && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-700 border border-slate-600 text-slate-400 text-xs">
                              <EyeOff size={10} /> Hidden
                            </span>
                          )}
                          {p.is_featured && (
                            <span className="px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs">Featured</span>
                          )}
                          {p.is_verified && (
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 text-xs">
                              <BadgeCheck size={10} /> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-slate-400 text-xs line-clamp-1 mb-3">{p.headline}</p>

                        <div className="flex flex-wrap gap-4 mb-3">
                          <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <Eye size={12} /> <span className="text-white font-medium">{p.views}</span> views
                          </span>
                          <span className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <MousePointerClick size={12} /> <span className="text-white font-medium">{p.contact_clicks}</span> contacts
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <ExternalLink size={12} className="text-sky-400 flex-shrink-0" />
                          <a href={p.elevenlabs_voice_link} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:text-sky-300 text-xs truncate transition-colors">
                            {p.elevenlabs_voice_link}
                          </a>
                        </div>

                        {p.status === 'rejected' && p.rejection_reason && (
                          <div className="mt-3 flex items-start gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                            <AlertCircle size={13} className="text-red-400 mt-0.5 flex-shrink-0" />
                            <p className="text-red-400 text-xs">{p.rejection_reason}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex sm:flex-col gap-2 flex-shrink-0">
                        {p.status === 'approved' && (
                          <Link to={`/voice/${p.id}`} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs transition-colors">
                            <Eye size={13} /> View
                          </Link>
                        )}
                        <button
                          onClick={() => openEdit(p)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 text-xs transition-colors border border-sky-500/20"
                        >
                          <Edit2 size={13} /> Edit
                        </button>
                        <button
                          onClick={() => toggleVisibility(p.id, p.is_visible)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white text-xs transition-colors"
                        >
                          {p.is_visible ? <><EyeOff size={13} /> Hide</> : <><Eye size={13} /> Show</>}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs transition-colors"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Account Settings */}
        <div className="mt-12 border-t border-slate-800 pt-10">
          <h2 className="text-white font-bold text-lg mb-1">Account Settings</h2>
          <p className="text-slate-500 text-sm mb-6">Manage your account preferences and data.</p>

          <div className="bg-slate-800/40 border border-red-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <Shield size={15} className="text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm mb-0.5">Delete Account</h3>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Permanently remove your account, all voice listings, and associated data. This cannot be undone.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteAccount(v => !v)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-medium transition-colors border border-red-500/20"
            >
              {showDeleteAccount ? <><ChevronUp size={13} /> Cancel</> : <><Trash2 size={13} /> Delete My Account</>}
            </button>

            {showDeleteAccount && (
              <div className="mt-5 p-4 bg-slate-900/80 rounded-xl border border-red-500/20 space-y-4">
                <div className="flex items-start gap-2 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <div className="text-red-300 text-xs leading-relaxed">
                    <strong>This is permanent.</strong> Your account, all voice listings, inquiries, and profile data will be deleted immediately and cannot be recovered.
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-2 block">
                    Type <span className="font-mono font-bold text-white">DELETE</span> to confirm
                  </label>
                  <input
                    type="text"
                    value={deleteAccountConfirm}
                    onChange={e => setDeleteAccountConfirm(e.target.value)}
                    placeholder="DELETE"
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-red-500 transition-all font-mono"
                  />
                </div>

                {deleteAccountError && (
                  <div className="flex items-center gap-2 text-red-400 text-xs">
                    <AlertCircle size={12} className="flex-shrink-0" />
                    <span>{deleteAccountError}</span>
                  </div>
                )}

                <button
                  onClick={handleDeleteAccount}
                  disabled={deleteAccountConfirm !== 'DELETE' || deletingAccount}
                  className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all"
                >
                  {deletingAccount ? 'Deleting account...' : 'Permanently Delete My Account'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete listing confirm modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">Delete Listing?</h3>
            <p className="text-slate-400 text-sm mb-6">This will permanently remove your voice listing. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors">Cancel</button>
              <button onClick={() => deleteProfile(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-semibold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit profile modal */}
      {editId && editForm && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl my-8 shadow-2xl">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-sky-500/15 flex items-center justify-center">
                  <Edit2 size={15} className="text-sky-400" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-base">Edit Voice Listing</h2>
                  <p className="text-slate-500 text-xs">Changes save immediately. Changing the ElevenLabs link sends it back for review.</p>
                </div>
              </div>
              <button onClick={closeEdit} className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors">
                <X size={15} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic info */}
              <section>
                <h3 className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">Basic Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block">Full Name *</label>
                    <input value={editForm.name} onChange={e => setField('name', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block">Professional Headline *</label>
                    <input value={editForm.headline} onChange={e => setField('headline', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-all" />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block">Bio *</label>
                    <textarea rows={4} value={editForm.bio} onChange={e => setField('bio', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm focus:outline-none focus:border-sky-500 transition-all resize-none" />
                  </div>
                  <AvatarUpload value={editForm.avatar_url} onChange={url => setField('avatar_url', url)} />
                  <AudioSampleUpload value={editForm.demo_audio_url} onChange={url => setField('demo_audio_url', url)} />
                </div>
              </section>

              {/* ElevenLabs link */}
              <section>
                <h3 className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">ElevenLabs Voice Link</h3>
                <div>
                  <label className="text-slate-400 text-xs mb-1.5 block">Shared Voice Link *</label>
                  <input
                    type="url"
                    value={editForm.elevenlabs_voice_link}
                    onChange={e => setField('elevenlabs_voice_link', e.target.value)}
                    className={`w-full px-3 py-2.5 rounded-xl bg-slate-800 border text-white text-sm focus:outline-none transition-all ${editForm.elevenlabs_voice_link && elevenlabsLinkValid ? 'border-emerald-500' : editForm.elevenlabs_voice_link ? 'border-red-500' : 'border-slate-700 focus:border-sky-500'}`}
                  />
                  {editForm.elevenlabs_voice_link !== originalLink && elevenlabsLinkValid && (
                    <p className="text-amber-400 text-xs mt-1.5 flex items-center gap-1">
                      <AlertCircle size={11} /> Changing this link will reset your listing to pending review.
                    </p>
                  )}
                </div>
              </section>

              {/* Voice details */}
              <section>
                <h3 className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">Voice Details</h3>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block">Accent</label>
                    <select value={editForm.accent} onChange={e => setField('accent', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-sky-500 transition-all">
                      <option value="">Select accent</option>
                      {ACCENTS.map(a => <option key={a}>{a}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block">Voice Type / Gender</label>
                    <select value={editForm.gender} onChange={e => setField('gender', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-sky-500 transition-all">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="neutral">Neutral</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block">Age Range</label>
                    <select value={editForm.age_range} onChange={e => setField('age_range', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-sky-500 transition-all">
                      <option value="">Select</option>
                      <option>18-25</option><option>25-35</option><option>35-50</option><option>50-65</option><option>65+</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block">Availability</label>
                    <select value={editForm.availability} onChange={e => setField('availability', e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-sm focus:outline-none focus:border-sky-500 transition-all">
                      <option value="available">Available</option>
                      <option value="busy">Currently Busy</option>
                      <option value="unavailable">Unavailable</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-slate-400 text-xs mb-2 block">Languages</label>
                  <div className="flex flex-wrap gap-1.5">
                    {LANGUAGES.map(lang => (
                      <button key={lang} type="button" onClick={() => toggleArray('languages', lang)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${editForm.languages.includes(lang) ? 'bg-sky-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                        {lang}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-slate-400 text-xs mb-2 block">Genres</label>
                  <div className="flex flex-wrap gap-1.5">
                    {GENRES.map(genre => (
                      <button key={genre} type="button" onClick={() => toggleArray('genres', genre)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${editForm.genres.includes(genre) ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 text-xs mb-2 block">Voice Style Tags</label>
                  <div className="flex flex-wrap gap-1.5">
                    {VOICE_STYLES.map(style => (
                      <button key={style} type="button" onClick={() => toggleArray('voice_style_tags', style)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${editForm.voice_style_tags.includes(style) ? 'bg-emerald-500/80 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Usage rights */}
              <section>
                <h3 className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-3">Usage Rights</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={editForm.commercial_use} onChange={e => setField('commercial_use', e.target.checked)} className="w-4 h-4 rounded border-slate-600 accent-sky-500" />
                  <span className="text-slate-300 text-sm">Available for commercial use</span>
                </label>
              </section>

              {/* Social links */}
              <section>
                <h3 className="text-slate-300 text-xs font-semibold uppercase tracking-wider mb-4">Social & Portfolio Links</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: 'linkedin', label: 'LinkedIn', placeholder: 'https://linkedin.com/in/...' },
                    { key: 'website', label: 'Website', placeholder: 'https://yoursite.com' },
                    { key: 'tiktok', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
                    { key: 'fiverr', label: 'Fiverr', placeholder: 'https://fiverr.com/...' },
                  ].map(({ key, label, placeholder }) => (
                    <div key={key}>
                      <label className="text-slate-400 text-xs mb-1.5 block">{label}</label>
                      <input
                        type="url"
                        value={editForm.social_links[key] || ''}
                        onChange={e => setField('social_links', { ...editForm.social_links, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 transition-all"
                      />
                    </div>
                  ))}
                </div>
              </section>

              {editError && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{editError}</p>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex gap-3 px-6 py-5 border-t border-slate-700/60 bg-slate-900/60">
              <button onClick={closeEdit} className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition-colors">
                Cancel
              </button>
              <button
                onClick={saveEdit}
                disabled={editSaving || !editForm.name || !elevenlabsLinkValid}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-lg shadow-sky-500/20"
              >
                <Save size={14} />
                {editSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
