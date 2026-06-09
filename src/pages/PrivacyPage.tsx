import { Shield } from 'lucide-react';
import { useSEO } from '../lib/seo';

const EFFECTIVE_DATE = 'May 28, 2026';
const CONTACT_EMAIL = 'support@voiceypro.com';
const SITE = 'VoiceyPro';
const DOMAIN = 'voiceypro.com';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-white mb-4 pb-3 border-b border-slate-800">{title}</h2>
      <div className="space-y-3 text-slate-400 text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  useSEO({ title: 'Privacy Policy', canonical: '/privacy', noindex: true });
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-5">
            <Shield size={13} />
            Legal
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Privacy Policy</h1>
          <p className="text-slate-500 text-sm">Effective Date: {EFFECTIVE_DATE}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-10">
          <p className="text-slate-400 text-sm leading-relaxed">
            This Privacy Policy explains how {SITE} ("{DOMAIN}") collects, uses, and protects your personal information. By using our platform, you agree to the practices described here.
          </p>
        </div>

        <Section title="1. Information We Collect">
          <p><span className="text-white font-medium">Account Information.</span> When you register, we collect your name, email address, and password (hashed). Voice Talent may also provide a bio, location, categories, and an ElevenLabs shared link for their public listing.</p>
          <p><span className="text-white font-medium">Contact Form.</span> When you submit a contact form, we collect your name, email, subject, and message content solely to respond to your inquiry.</p>
          <p><span className="text-white font-medium">Usage Data.</span> We automatically collect standard server logs, including IP addresses, browser type, pages visited, and timestamps for security and performance purposes. We do not sell this data.</p>
          <p><span className="text-white font-medium">Payment Information.</span> Subscription payments are processed by third-party providers. We do not store full credit card numbers on our servers.</p>
        </Section>

        <Section title="2. How We Use Your Information">
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>To create and manage your account.</li>
            <li>To display your public voice listing to Buyers (Voice Talent only).</li>
            <li>To process subscription payments and send receipts.</li>
            <li>To respond to support and contact inquiries.</li>
            <li>To detect and prevent fraud, abuse, or violations of our Terms of Service.</li>
            <li>To send transactional emails (account confirmations, billing notices). We do not send unsolicited marketing emails without your consent.</li>
            <li>To improve and maintain the platform.</li>
          </ul>
        </Section>

        <Section title="3. Information We Share">
          <p>We do not sell your personal information. We may share your information in the following limited circumstances:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><span className="text-slate-300">Public Listings.</span> Voice Talent profile information (name, bio, voice samples, ElevenLabs link, location) is publicly visible to all site visitors by default.</li>
            <li><span className="text-slate-300">Service Providers.</span> We use trusted third-party services (e.g., Supabase for database hosting, payment processors) that process data on our behalf under data processing agreements.</li>
            <li><span className="text-slate-300">Legal Requirements.</span> We may disclose information if required by law, court order, or to protect the rights, property, or safety of {SITE}, its users, or the public.</li>
            <li><span className="text-slate-300">Business Transfers.</span> In the event of a merger, acquisition, or asset sale, your information may be transferred as part of that transaction.</li>
          </ul>
        </Section>

        <Section title="4. Cookies and Tracking">
          <p>
            We use essential cookies to maintain your login session and platform preferences. We do not use advertising or cross-site tracking cookies. Third-party services we embed (e.g., payment processors) may set their own cookies governed by their respective privacy policies.
          </p>
        </Section>

        <Section title="5. Data Retention">
          <p>
            We retain your account data for as long as your account is active or as needed to provide services. If you delete your account, we will remove your personal information within 30 days, except where retention is required by law or for legitimate business purposes such as fraud prevention.
          </p>
          <p>Voice listings that have been publicly visible may persist in third-party search engine caches beyond our control.</p>
        </Section>

        <Section title="6. Your Rights">
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li><span className="text-slate-300">Access.</span> Request a copy of the personal data we hold about you.</li>
            <li><span className="text-slate-300">Correction.</span> Request corrections to inaccurate or incomplete data.</li>
            <li><span className="text-slate-300">Deletion.</span> Request deletion of your personal data ("right to be forgotten").</li>
            <li><span className="text-slate-300">Portability.</span> Request your data in a machine-readable format.</li>
            <li><span className="text-slate-300">Objection.</span> Object to certain processing activities.</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sky-400 hover:text-sky-300 transition-colors">{CONTACT_EMAIL}</a>. We will respond within 30 days.
          </p>
        </Section>

        <Section title="7. Security">
          <p>
            We implement industry-standard security measures including encrypted data transmission (TLS/SSL), hashed passwords, and role-based access controls. However, no system is completely secure. You are responsible for maintaining the confidentiality of your account credentials.
          </p>
        </Section>

        <Section title="8. Children's Privacy">
          <p>
            {SITE} is not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware that a minor has provided us with personal data, we will delete it promptly.
          </p>
        </Section>

        <Section title="9. Third-Party Links">
          <p>
            Our platform contains links to third-party sites including ElevenLabs.io and voice talent external pages. This Privacy Policy does not apply to those sites. We encourage you to review the privacy policies of any third-party services you visit.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy periodically. We will update the Effective Date at the top of this page. Continued use of {SITE} after changes are posted constitutes acceptance of the updated policy.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>
            For privacy-related questions or requests, contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sky-400 hover:text-sky-300 transition-colors">{CONTACT_EMAIL}</a>.
          </p>
        </Section>
      </div>
    </div>
  );
}
