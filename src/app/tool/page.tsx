import Link from 'next/link';
import Navbar from '../components/Navbar';
import BagsMCPLogo from '../components/BagsMCPLogo';

const GREEN = '#20D55A';

export default function ToolPage() {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: '#000000' }}>
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="lineGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={GREEN} stopOpacity="0" />
              <stop offset="50%" stopColor={GREEN} stopOpacity="0.6" />
              <stop offset="100%" stopColor={GREEN} stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="url(#lineGrad1)" strokeWidth="1" />
          <line x1="0" y1="50%" x2="100%" y2="50%" stroke="url(#lineGrad1)" strokeWidth="1" />
          <line x1="0" y1="80%" x2="100%" y2="80%" stroke="url(#lineGrad1)" strokeWidth="1" />
          <line x1="15%" y1="0" x2="15%" y2="100%" stroke={GREEN} strokeWidth="0.5" opacity="0.15" />
          <line x1="85%" y1="0" x2="85%" y2="100%" stroke={GREEN} strokeWidth="0.5" opacity="0.15" />
        </svg>
      </div>

      <Navbar />

      <main className="flex-1 flex flex-col items-center px-6 py-16 relative z-10">
        <div className="max-w-3xl mx-auto w-full text-center space-y-16">
          {/* Live MCP Server — hero */}
          <section className="flex flex-col items-center gap-6">
            <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Live MCP Server
            </p>
            <div
              className="p-14 rounded-2xl border flex items-center justify-center min-h-[220px]"
              style={{ borderColor: 'rgba(32, 213, 90, 0.35)', backgroundColor: 'rgba(0,0,0,0.4)' }}
            >
              <BagsMCPLogo variant="live" size={160} />
            </div>
            <p className="text-sm max-w-md" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Pulsing node and LIVE badge — for status pages, dashboards, and “server online” indicators.
            </p>
          </section>

          <div className="h-px w-24 mx-auto opacity-50" style={{ backgroundColor: GREEN }} />

          {/* Full lockup */}
          <section className="flex flex-col items-center gap-6">
            <p className="text-xs font-medium uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Full lockup
            </p>
            <div
              className="p-10 rounded-2xl border flex items-center justify-center"
              style={{ borderColor: 'rgba(32, 213, 90, 0.25)', backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <BagsMCPLogo variant="full" size={130} />
            </div>
          </section>

          {/* Icon only + Live side by side */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div
              className="p-8 rounded-xl border flex flex-col items-center gap-4"
              style={{ borderColor: 'rgba(32, 213, 90, 0.2)' }}
            >
              <BagsMCPLogo variant="icon" size={88} />
              <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Icon only
              </span>
            </div>
            <div
              className="p-8 rounded-xl border flex flex-col items-center gap-4"
              style={{ borderColor: 'rgba(32, 213, 90, 0.2)' }}
            >
              <BagsMCPLogo variant="live" size={88} />
              <span className="text-xs uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Live MCP server
              </span>
            </div>
          </section>

          <div className="pt-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border text-white/80 hover:text-white transition-colors"
              style={{ borderColor: 'rgba(32, 213, 90, 0.5)' }}
            >
              <span style={{ color: GREEN }}>←</span> Back home
            </Link>
          </div>
        </div>
      </main>

      <div className="h-1 w-full opacity-40" style={{ backgroundColor: GREEN }} aria-hidden />
    </div>
  );
}
