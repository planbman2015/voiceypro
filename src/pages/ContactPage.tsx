import { useState } from 'react';
import { Mail, Mic2, BadgeCheck, AlertCircle } from 'lucide-react';
import { useSEO } from '../lib/seo';

const EDGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-contact-email`;

export default function ContactPage() {
  useSEO({
    title: 'Contact Us',
    description: 'Get in touch with the VoiceyPro team for questions about listings, partnerships, or support.',
    canonical: '/contact',
  });
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(EDGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send');
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to send. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-5">
            <Mail size={13} />
            Get in Touch
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Contact VoiceyPro</h1>
          <p className="text-slate-400">Questions about listings, ElevenLabs requirements, or anything else</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info sidebar */}
          <div className="lg:col-span-2 space-y-5">
            {[
              { icon: Mic2, title: 'Voice Talent', desc: 'Questions about listing your ElevenLabs Professional Voice Clone on our platform.' },
              { icon: BadgeCheck, title: 'Moderation', desc: 'Disputes, removal requests, or flagging invalid or unauthorized listings.' },
              { icon: AlertCircle, title: 'General', desc: 'Any other questions, partnership inquiries, or feedback about the platform.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-sky-500/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="text-sky-400" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{title}</p>
                  <p className="text-slate-400 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <p className="text-slate-500 text-xs leading-relaxed">
                VoiceyPro is a discovery directory for ElevenLabs Professional Voice Clone owners.
                We are not affiliated with ElevenLabs, Inc. For ElevenLabs platform support, visit elevenlabs.io.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-7">
              {submitted ? (
                <div className="text-center py-10">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                    <BadgeCheck size={26} className="text-emerald-400" />
                  </div>
                  <h3 className="text-white font-bold text-xl mb-2">Message Received</h3>
                  <p className="text-slate-400 text-sm">We'll get back to you within 1-2 business days.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="mt-5 px-5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm transition-colors">
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-300 text-sm font-medium mb-1.5 block">Name *</label>
                      <input required value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm transition-all" />
                    </div>
                    <div>
                      <label className="text-slate-300 text-sm font-medium mb-1.5 block">Email *</label>
                      <input required type="email" value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm font-medium mb-1.5 block">Subject *</label>
                    <select required value={form.subject} onChange={e => setForm(f => ({...f, subject: e.target.value}))} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 focus:outline-none focus:border-sky-500 text-sm transition-all">
                      <option value="">Select a subject</option>
                      <option>Listing my ElevenLabs voice</option>
                      <option>ElevenLabs link requirements</option>
                      <option>Moderation / flagging a listing</option>
                      <option>Removal request</option>
                      <option>Account help</option>
                      <option>Partnership inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-300 text-sm font-medium mb-1.5 block">Message *</label>
                    <textarea required rows={5} value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))} className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 text-sm transition-all resize-none" />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                      <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                      <p className="text-red-400 text-sm">{error}</p>
                    </div>
                  )}
                  <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold text-sm transition-all shadow-lg shadow-sky-500/25">
                    {loading ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
