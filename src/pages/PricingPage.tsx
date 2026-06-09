import { Link } from 'react-router-dom';
import { CheckCircle, Mic2, Star, Zap, ArrowRight, ExternalLink } from 'lucide-react';
import { useSEO } from '../lib/seo';

const ELEVENLABS_AFFILIATE = 'https://try.elevenlabs.io/xht4ezzxoclw';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    price: 'Free',
    subPrice: 'Always',
    description: 'Get discovered with a standard listing',
    features: [
      'One voice listing',
      'Public profile page',
      'ElevenLabs shared link display',
      'Contact form for clients',
      'Basic search visibility',
      'Profile view analytics',
    ],
    cta: 'Get Started Free',
    ctaLink: '/signup',
    highlight: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$12',
    subPrice: '/month',
    description: 'More exposure and premium placement',
    features: [
      'Everything in Basic',
      'Priority search placement',
      'Detailed analytics dashboard',
      'Up to 3 voice listings',
      'Pro badge on profile',
      'Monthly performance report',
    ],
    cta: 'Start Pro',
    ctaLink: '/signup?plan=pro',
    highlight: true,
    badge: 'Most Popular',
  },
  {
    id: 'featured',
    name: 'Featured',
    price: '$29',
    subPrice: '/month',
    description: 'Maximum visibility for serious talent',
    features: [
      'Everything in Pro',
      'Featured listing on homepage',
      'Sponsored search placement',
      'Unlimited voice listings',
      'Featured badge',
      'Priority support',
      'Newsletter feature (quarterly)',
    ],
    cta: 'Go Featured',
    ctaLink: '/signup?plan=featured',
    highlight: false,
  },
];

export default function PricingPage() {
  useSEO({
    title: 'Pricing — List Your ElevenLabs Voice',
    description: 'See VoiceyPro listing plans for ElevenLabs voice talent. Start for free and get discovered by studios, brands, and content creators.',
    canonical: '/pricing',
  });
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-5">
            <Mic2 size={13} />
            ElevenLabs Voice Talent Pricing
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Start free. Upgrade when you're ready for more visibility.
            All plans require an ElevenLabs Professional Voice Clone to list.
          </p>
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {PLANS.map(plan => (
            <div key={plan.id} className={`relative rounded-2xl border overflow-hidden transition-all ${plan.highlight ? 'bg-gradient-to-b from-sky-500/10 to-slate-800/80 border-sky-500/40 shadow-xl shadow-sky-500/10' : 'bg-slate-800/50 border-slate-700/50'}`}>
              {plan.badge && (
                <div className="bg-sky-500 text-white text-xs font-bold uppercase tracking-wide text-center py-1.5">
                  {plan.badge}
                </div>
              )}
              <div className="p-7">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-xl">{plan.name}</h3>
                  {plan.id === 'featured' && <Star size={16} className="text-amber-400 fill-amber-400" />}
                  {plan.id === 'pro' && <Zap size={16} className="text-sky-400" />}
                </div>
                <p className="text-slate-400 text-sm mb-6">{plan.description}</p>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-slate-400 text-sm mb-1">{plan.subPrice}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle size={14} className="text-sky-400 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-300 text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to={plan.ctaLink}
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all ${plan.highlight ? 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/25' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'}`}
                >
                  {plan.cta}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="text-center bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-white font-bold mb-2">All Plans Require an ElevenLabs Professional Voice Clone</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto mb-4">
            VoiceyPro is exclusively for ElevenLabs Professional Voice Clone owners with a shared voice link.
            Listings without a valid ElevenLabs shared link will not be approved regardless of plan.
          </p>
          <a
            href={ELEVENLABS_AFFILIATE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 text-sm font-medium border border-sky-500/20 transition-all"
          >
            Get ElevenLabs Professional Voice Clone <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}
