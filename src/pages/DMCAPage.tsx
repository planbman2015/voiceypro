import { FileWarning } from 'lucide-react';
import { useSEO } from '../lib/seo';

const EFFECTIVE_DATE = 'May 28, 2026';
const DMCA_EMAIL = 'dmca@voiceypro.com';
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

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-3 border-b border-slate-800 last:border-b-0">
      <span className="text-slate-500 text-sm w-36 flex-shrink-0">{label}</span>
      <span className="text-slate-300 text-sm flex-1">{value}</span>
    </div>
  );
}

export default function DMCAPage() {
  useSEO({ title: 'DMCA Policy', canonical: '/dmca', noindex: true });
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-medium mb-5">
            <FileWarning size={13} />
            Legal
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">DMCA Policy</h1>
          <p className="text-slate-500 text-sm">Effective Date: {EFFECTIVE_DATE}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-10">
          <p className="text-slate-400 text-sm leading-relaxed">
            {SITE} respects the intellectual property rights of others and expects users of our platform to do the same. In accordance with the Digital Millennium Copyright Act of 1998 (17 U.S.C. § 512), we will respond expeditiously to claims of copyright infringement.
          </p>
        </div>

        <Section title="Our Role as a Directory">
          <p>
            {SITE} ({DOMAIN}) is a discovery directory. We do not host, create, or distribute voice audio files. Voice samples displayed on listings are linked from or embedded via ElevenLabs shared links provided by Voice Talent. If you believe content on our platform infringes your copyright, follow the procedure below.
          </p>
        </Section>

        <Section title="Filing a DMCA Takedown Notice">
          <p>To submit a valid DMCA takedown notice, you must provide all of the following in writing to our designated DMCA agent:</p>

          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden mt-4">
            <InfoRow label="1. Identification" value="A description of the copyrighted work you claim has been infringed." />
            <InfoRow label="2. Location" value="The URL(s) or specific location(s) on our platform where the allegedly infringing content appears." />
            <InfoRow label="3. Your Contact" value="Your full legal name, mailing address, telephone number, and email address." />
            <InfoRow label="4. Good Faith" value='A statement that you have a good faith belief that the use of the material is not authorized by the copyright owner, its agent, or the law.' />
            <InfoRow label="5. Accuracy" value="A statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on the owner's behalf." />
            <InfoRow label="6. Signature" value="Your physical or electronic signature." />
          </div>

          <p className="mt-4">Send your notice to our designated DMCA agent at:</p>

          <div className="bg-slate-900 border border-amber-500/20 rounded-xl p-5 mt-2">
            <p className="text-slate-300 text-sm font-medium mb-1">DMCA Agent — {SITE}</p>
            <p className="text-slate-400 text-sm">Email:{' '}
              <a href={`mailto:${DMCA_EMAIL}`} className="text-sky-400 hover:text-sky-300 transition-colors">{DMCA_EMAIL}</a>
            </p>
            <p className="text-slate-500 text-xs mt-3 leading-relaxed">
              Notices sent to other email addresses or that do not contain all required elements may not receive a response. We are not responsible for notices submitted to ElevenLabs or other third-party platforms.
            </p>
          </div>
        </Section>

        <Section title="What Happens After You File">
          <p>Upon receipt of a complete, valid DMCA notice, we will:</p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Review the notice for completeness and validity.</li>
            <li>Remove or disable access to the allegedly infringing content as required by law.</li>
            <li>Notify the Voice Talent whose listing was affected.</li>
            <li>Provide them an opportunity to file a counter-notice if they believe the takedown was in error.</li>
          </ul>
          <p>We aim to act on valid notices within 5 business days.</p>
        </Section>

        <Section title="Counter-Notice Procedure">
          <p>
            If you are a Voice Talent whose listing was removed due to a DMCA notice and you believe it was removed in error, you may file a counter-notice. A valid counter-notice must include:
          </p>
          <ul className="list-disc list-inside space-y-1.5 pl-2">
            <li>Your full legal name, address, phone number, and email address.</li>
            <li>Identification of the content that was removed and its location prior to removal.</li>
            <li>A statement under penalty of perjury that you have a good faith belief the content was removed by mistake or misidentification.</li>
            <li>A statement consenting to the jurisdiction of the federal district court in which your address is located (or any judicial district if outside the US).</li>
            <li>Your physical or electronic signature.</li>
          </ul>
          <p>
            Send counter-notices to{' '}
            <a href={`mailto:${DMCA_EMAIL}`} className="text-sky-400 hover:text-sky-300 transition-colors">{DMCA_EMAIL}</a>.
            If a valid counter-notice is received, we may reinstate the removed content no sooner than 10 and no later than 14 business days after receiving it, unless our designated agent receives notice that the original complainant has filed a court action.
          </p>
        </Section>

        <Section title="Repeat Infringer Policy">
          <p>
            In accordance with the DMCA, {SITE} maintains a policy of terminating, in appropriate circumstances, the accounts of users who are repeat copyright infringers. We reserve the right to terminate any account at our discretion.
          </p>
        </Section>

        <Section title="Misuse of DMCA Notices">
          <p>
            Filing a false DMCA takedown notice is a serious matter. Under 17 U.S.C. § 512(f), any person who knowingly materially misrepresents that content is infringing may be subject to liability for damages, including costs and attorneys' fees.
          </p>
        </Section>

        <Section title="Questions">
          <p>
            For general questions about this policy, contact us at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sky-400 hover:text-sky-300 transition-colors">{CONTACT_EMAIL}</a>.
            For DMCA notices only, use{' '}
            <a href={`mailto:${DMCA_EMAIL}`} className="text-sky-400 hover:text-sky-300 transition-colors">{DMCA_EMAIL}</a>.
          </p>
        </Section>
      </div>
    </div>
  );
}
