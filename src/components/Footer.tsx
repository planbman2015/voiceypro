import { Link } from 'react-router-dom';
import { Mic2, Twitter, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center">
                <Mic2 size={16} className="text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">
                Voicey<span className="text-sky-400">Pro</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              Discovery directory for ElevenLabs Professional Voice Clone owners.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <Twitter size={14} />
              </a>
              <a href="#" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <Linkedin size={14} />
              </a>
              <Link to="/contact" className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                <Mail size={14} />
              </Link>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[['Browse Voices', '/browse'], ['Submit Your Voice', '/submit'], ['Featured Voices', '/browse?featured=true']].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="text-slate-400 text-sm hover:text-sky-400 transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Resources</h4>
            <ul className="space-y-2.5">
              {[['FAQ', '/faq'], ['Contact', '/contact'], ['ElevenLabs', 'https://try.elevenlabs.io/xht4ezzxoclw']].map(([label, href]) => (
                <li key={href}>
                  {href.startsWith('http') ? (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-slate-400 text-sm hover:text-sky-400 transition-colors">{label} ↗</a>
                  ) : (
                    <Link to={href} className="text-slate-400 text-sm hover:text-sky-400 transition-colors">{label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-2.5">
              <li><Link to="/terms" className="text-slate-400 text-sm hover:text-sky-400 transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-slate-400 text-sm hover:text-sky-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/dmca" className="text-slate-400 text-sm hover:text-sky-400 transition-colors">DMCA</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-slate-800 pt-6">
          <div className="bg-slate-900 rounded-xl p-4 mb-5">
            <p className="text-slate-500 text-xs leading-relaxed text-center">
              VoiceyPro is an independent discovery directory. We are not affiliated with, endorsed by, or sponsored by ElevenLabs.
              All voice talent listed here own their own ElevenLabs Professional Voice Clones and shared links.
              We do not host, create, or clone any voices. ElevenLabs® is a trademark of ElevenLabs, Inc.
            </p>
          </div>
          <p className="text-center text-slate-600 text-xs">
            © 2026 VoiceyPro. a division of On Cue Productions. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
