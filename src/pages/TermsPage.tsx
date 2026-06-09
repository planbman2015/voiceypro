import { Scale } from 'lucide-react';
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

export default function TermsPage() {
  useSEO({ title: 'Terms of Service', canonical: '/terms', noindex: true });
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-5">
            <Scale size={13} />
            Legal
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-slate-500 text-sm">Effective Date: {EFFECTIVE_DATE}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-10">
          <p className="text-slate-400 text-sm leading-relaxed">
            Please read these Terms of Service carefully before using {SITE} ({DOMAIN}). By accessing or using our platform, you agree to be bound by these Terms. If you do not agree, do not use this platform.
          </p>
        </div>

        <Section title="1. About VoiceyPro">
          <p>
            {SITE} is an independent discovery directory that allows ElevenLabs Professional Voice Clone owners ("Voice Talent") to list their voice for hire by businesses and creators ("Buyers"). We are not affiliated with, endorsed by, or sponsored by ElevenLabs, Inc.
          </p>
          <p>
            We do not host, create, clone, modify, or distribute any voice data. All voice samples and ElevenLabs shared links are provided directly by Voice Talent. We are a marketplace directory only.
          </p>
        </Section>

        <Section title="2. Eligibility">
          <p>You must be at least 18 years of age to create an account or list a voice on {SITE}. By using this platform you represent and warrant that you meet this requirement.</p>
          <p>Voice Talent must be the sole and exclusive owner of the voice they list. Listing another person's voice — including AI-generated voice clones of other people — without explicit written consent is strictly prohibited and may result in immediate removal and legal action.</p>
        </Section>

        <Section title="3. Voice Talent Listings">
          <p>By submitting a voice listing, you represent and warrant that:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>The voice is your own natural voice professionally cloned via ElevenLabs Professional Voice Clone.</li>
            <li>You own a valid, active ElevenLabs Professional Voice Clone subscription tied to that voice.</li>
            <li>The ElevenLabs shared link provided is accurate and belongs to your account.</li>
            <li>All listing content (bio, samples, categories) is truthful and does not misrepresent your voice or capabilities.</li>
            <li>Your listing does not infringe any third-party intellectual property rights.</li>
          </ul>
          <p>
            {SITE} reserves the right to remove any listing that violates these Terms, is reported as fraudulent, or is otherwise deemed inappropriate at our sole discretion, without prior notice.
          </p>
        </Section>

        <Section title="4. Buyer Conduct">
          <p>Buyers who license voice talent through {SITE} agree to:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Use licensed voice output only in accordance with any agreement reached directly with the Voice Talent.</li>
            <li>Not use voice output to create misleading, defamatory, illegal, or harmful content.</li>
            <li>Not impersonate any real person using licensed voice output without proper consent.</li>
            <li>Comply with all applicable laws including those governing synthetic media, deepfakes, and AI-generated content.</li>
          </ul>
        </Section>

        <Section title="5. Transactions and Payments">
          <p>
            {SITE} facilitates discovery between Voice Talent and Buyers. All agreements, pricing, and payment arrangements are made directly between Voice Talent and Buyers. {SITE} is not a party to these transactions and assumes no liability for disputes, non-payment, or unsatisfactory work product.
          </p>
          <p>
            Subscription fees for listing plans on {SITE} are billed as described on our Pricing page. All fees are non-refundable except where required by applicable law.
          </p>
        </Section>

        <Section title="6. Prohibited Content and Conduct">
          <p>You may not use {SITE} to:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>List or solicit voices that are clones of other real, identifiable individuals without documented consent.</li>
            <li>Create, distribute, or facilitate non-consensual intimate deepfakes or synthetic media.</li>
            <li>Generate content that is defamatory, harassing, threatening, or incites violence.</li>
            <li>Violate any applicable local, national, or international law or regulation.</li>
            <li>Attempt to reverse-engineer, scrape, or extract data from the platform in bulk.</li>
            <li>Misrepresent your identity, credentials, or affiliation.</li>
          </ul>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            All platform content — including design, code, logos, and copy — is the property of {SITE} and may not be reproduced without written permission.
          </p>
          <p>
            Voice Talent retain all ownership of their voice, voice clone, and any deliverables they produce. By listing on {SITE}, Voice Talent grant us a limited, non-exclusive, royalty-free license to display their listing content (name, bio, sample audio) for the purpose of operating and promoting the directory.
          </p>
        </Section>

        <Section title="8. Disclaimer of Warranties">
          <p>
            {SITE} is provided "as is" and "as available" without warranties of any kind, express or implied. We do not warrant that the platform will be uninterrupted, error-free, or free of harmful components. We make no warranty regarding the accuracy, quality, or legality of any voice listing.
          </p>
        </Section>

        <Section title="9. Limitation of Liability">
          <p>
            To the fullest extent permitted by law, {SITE} and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, including but not limited to disputes between Voice Talent and Buyers, unauthorized use of voice output, or platform downtime.
          </p>
          <p>
            Our total aggregate liability for any claim relating to these Terms shall not exceed the total fees you paid to {SITE} in the twelve months preceding the claim.
          </p>
        </Section>

        <Section title="10. Indemnification">
          <p>
            You agree to indemnify, defend, and hold harmless {SITE} and its operators from and against any claims, liabilities, damages, losses, and expenses (including legal fees) arising out of or in any way connected to your use of the platform, your listings, your voice output, or your violation of these Terms.
          </p>
        </Section>

        <Section title="11. Termination">
          <p>
            We reserve the right to suspend or terminate your account at any time, with or without notice, for any violation of these Terms or for conduct we determine to be harmful to the platform or its users.
          </p>
        </Section>

        <Section title="12. Changes to These Terms">
          <p>
            We may update these Terms at any time. Continued use of the platform after changes are posted constitutes your acceptance of the updated Terms. We will update the Effective Date at the top of this page when changes are made.
          </p>
        </Section>

        <Section title="13. Contact">
          <p>
            For questions about these Terms, contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sky-400 hover:text-sky-300 transition-colors">{CONTACT_EMAIL}</a>.
          </p>
        </Section>
      </div>
    </div>
  );
}
