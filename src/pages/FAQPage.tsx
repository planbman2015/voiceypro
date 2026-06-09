import { useState } from 'react';
import { ChevronDown, Mic2, ExternalLink, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSEO } from '../lib/seo';

const FAQS = [
  {
    category: 'About VoiceyPro',
    questions: [
      {
        q: 'What is VoiceyPro?',
        a: 'VoiceyPro is a discovery directory exclusively for voice talent who own ElevenLabs Professional Voice Clones with shared public links. We are NOT a voice cloning tool, a voice hosting service, or a general voice-over marketplace. We simply connect clients with ElevenLabs voice professionals.',
      },
      {
        q: 'Is this an official ElevenLabs product?',
        a: 'No. VoiceyPro is an independent platform and is not affiliated with, endorsed by, or sponsored by ElevenLabs, Inc. ElevenLabs® is a trademark of ElevenLabs, Inc. We simply list voice talent who use ElevenLabs\' technology.',
      },
      {
        q: 'Does VoiceyPro host, create, or clone voices?',
        a: 'Absolutely not. VoiceyPro does not host any audio, create any voice clones, or process any voice data. We are purely a discovery directory. All voices are owned entirely by the talent who list them, and the actual voice technology lives in ElevenLabs\' platform.',
      },
    ],
  },
  {
    category: 'For ElevenLabs Voice Talent',
    questions: [
      {
        q: 'Who can list on VoiceyPro?',
        a: 'Only voice talent who have an ElevenLabs account with a Professional Voice Clone (not an Instant Clone) and have generated a shared public link via "More actions → Share voice" in their ElevenLabs account. Human voice actors without ElevenLabs or Instant Clone users are not eligible.',
      },
      {
        q: 'What is the difference between a Professional Voice Clone and an Instant Clone in ElevenLabs?',
        a: 'An ElevenLabs Professional Voice Clone requires extended training on a large sample of your voice (often 30+ minutes of studio-quality audio) and produces a much higher-fidelity clone. An Instant Clone uses just a short clip and produces a lower-quality result. VoiceyPro only accepts Professional Voice Clones.',
      },
      {
        q: 'How do I generate a shared ElevenLabs link?',
        a: 'In your ElevenLabs account: navigate to your Professional Voice Clone → click "More actions" → select "Share voice" → copy the public share link. This is the URL you\'ll paste into your VoiceyPro listing.',
      },
      {
        q: 'What happens after I submit my listing?',
        a: 'Our admin team reviews your listing to verify that your ElevenLabs shared link is valid and points to a Professional Voice Clone. This typically takes 1-2 business days. You\'ll see the status in your dashboard.',
      },
      {
        q: 'Can I remove my listing?',
        a: 'Yes, at any time. You can delete your listing from your dashboard. Additionally, if you revoke your ElevenLabs shared link in your ElevenLabs account, the link in your listing will stop working — and our admins can remove the listing upon flagging.',
      },
    ],
  },
  {
    category: 'For Clients & Producers',
    questions: [
      {
        q: 'How do I use a voice I find on VoiceyPro?',
        a: 'Click the "Open in ElevenLabs" button on any profile. This opens the talent\'s ElevenLabs shared link, which lets you add their Professional Voice Clone to your own ElevenLabs account. You\'ll need an ElevenLabs account to use the voice.',
      },
      {
        q: 'Can I contact voice talent directly?',
        a: 'Yes. Every profile has a "Contact" button that opens a lead form. Your inquiry is sent directly to the talent for project discussions, custom quotes, and licensing arrangements.',
      },
      {
        q: 'Are all listings verified?',
        a: 'Yes. Every listing is reviewed by our admin team to confirm a valid ElevenLabs shared link exists. Listings with invalid, broken, or non-Professional Clone links are rejected. You\'ll see a "Verified ElevenLabs Professional Clone" badge on approved profiles.',
      },
    ],
  },
  {
    category: 'Safety & Compliance',
    questions: [
      {
        q: 'Who owns the voices listed here?',
        a: 'The individual voice talent own their voices and their ElevenLabs Professional Voice Clones. VoiceyPro does not own, license, or control any voice. All talent self-submit and retain full ownership.',
      },
      {
        q: 'What if I find a fraudulent or unauthorized listing?',
        a: 'Contact us immediately via the Contact page. We take unauthorized listings seriously and will investigate and remove any listing that violates our terms or ElevenLabs\' policies.',
      },
    ],
  },
];

export default function FAQPage() {
  useSEO({
    title: 'Frequently Asked Questions',
    description: 'Common questions about VoiceyPro — the ElevenLabs Professional Voice Clone directory. Learn how to list your voice, find talent, and how the platform works.',
    canonical: '/faq',
  });
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({});

  function toggle(key: string) {
    setOpenMap(m => ({ ...m, [key]: !m[key] }));
  }

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-5">
            <Mic2 size={13} />
            Frequently Asked Questions
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">FAQ</h1>
          <p className="text-slate-400">Everything you need to know about VoiceyPro and our ElevenLabs voice directory</p>
        </div>

        {/* Important disclaimer */}
        <div className="bg-sky-500/10 border border-sky-500/20 rounded-2xl p-5 mb-10 flex items-start gap-3">
          <Shield size={18} className="text-sky-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sky-300 font-semibold text-sm mb-1">This is an ElevenLabs-Only Discovery Platform</p>
            <p className="text-sky-400/80 text-sm">
              VoiceyPro is exclusively for ElevenLabs Professional Voice Clone owners.
              We do not host, create, or clone voices. We are a discovery directory only.
              All talent must have their own ElevenLabs shared voice link to list.
            </p>
            <a href="https://try.elevenlabs.io/xht4ezzxoclw" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 mt-2 text-sky-300 hover:text-sky-200 text-xs font-medium transition-colors">
              Get ElevenLabs Professional Voice Clone <ExternalLink size={10} />
            </a>
          </div>
        </div>

        {/* FAQ sections */}
        <div className="space-y-8">
          {FAQS.map(section => (
            <div key={section.category}>
              <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <div className="w-1.5 h-5 rounded-full bg-sky-500" />
                {section.category}
              </h2>
              <div className="space-y-2">
                {section.questions.map((item, i) => {
                  const key = `${section.category}-${i}`;
                  const isOpen = openMap[key];
                  return (
                    <div key={key} className={`rounded-xl border transition-all overflow-hidden ${isOpen ? 'bg-slate-800/80 border-sky-500/20' : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-700'}`}>
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-center justify-between px-5 py-4 text-left"
                      >
                        <span className="text-white text-sm font-medium pr-4">{item.q}</span>
                        <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4">
                          <p className="text-slate-400 text-sm leading-relaxed">{item.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center bg-slate-900 border border-slate-800 rounded-2xl p-8">
          <h3 className="text-white font-bold text-lg mb-2">Still have questions?</h3>
          <p className="text-slate-400 text-sm mb-5">Our team is happy to help with any questions about listings, ElevenLabs requirements, or the platform.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-semibold text-sm transition-colors">Contact Us</Link>
            <Link to="/submit" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm border border-slate-700 transition-colors">List Your Voice</Link>
            <a href="https://try.elevenlabs.io/xht4ezzxoclw" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm border border-slate-700 transition-colors">
              Get ElevenLabs <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
