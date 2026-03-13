import Navbar from './components/Navbar';

const GREEN = '#20D55A';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#000000' }}>
      <Navbar />

      <main className="flex-1 px-6 py-16 md:py-24" style={{ backgroundColor: '#000000' }}>
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <section className="text-center mb-20 md:mb-28">
            <p
              className="text-xs font-medium uppercase tracking-[0.25em] mb-6"
              style={{ color: 'rgba(255,255,255,0.45)' }}
            >
              Bags API via MCP
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white tracking-tight leading-[1.1] mb-5">
              Bags data for
              <span style={{ color: GREEN }}> non-devs</span>
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Query tokens, health, claimers, and fee stats from AI assistants, spreadsheets, and BI tools. No code required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                className="px-6 py-3 rounded-lg text-sm font-semibold text-black transition-opacity hover:opacity-90"
                style={{ backgroundColor: GREEN }}
              >
                Get started
              </button>
              <a
                href="#features"
                className="px-6 py-3 rounded-lg text-sm font-semibold border transition-colors hover:border-[#20D55A]"
                style={{ color: 'rgba(255,255,255,0.8)', borderColor: 'rgba(255,255,255,0.15)' }}
              >
                Features
              </a>
            </div>
          </section>

          {/* What you get */}
          <section className="mb-24 md:mb-32">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
              What you get
            </h2>
            <div
              className="rounded-xl border p-6 md:p-8 text-left"
              style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}
            >
              <ul className="space-y-4 text-sm md:text-base" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <li className="flex items-start gap-3">
                  <span style={{ color: GREEN }} className="mt-0.5">—</span>
                  <span><strong className="text-white">List tokens</strong> — Discover and filter the Bags ecosystem</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: GREEN }} className="mt-0.5">—</span>
                  <span><strong className="text-white">Token health</strong> — Fee distribution, claimers, concentration</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: GREEN }} className="mt-0.5">—</span>
                  <span><strong className="text-white">Top claimers & fee stats</strong> — For research and due diligence</span>
                </li>
                <li className="flex items-start gap-3">
                  <span style={{ color: GREEN }} className="mt-0.5">—</span>
                  <span><strong className="text-white">Export to Sheets / Airtable</strong> — Or use from your AI assistant</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="mb-24 md:mb-32">
            <h2 className="text-sm font-medium uppercase tracking-wider mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
              Why BagsMCP
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <div
                className="rounded-xl border p-6 md:p-7"
                style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}
              >
                <h3 className="text-base font-semibold text-white mb-2">No code</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Community managers, researchers, and VCs use Bags data from AI chats, Sheets, or BI—no custom dashboard to build.
                </p>
              </div>
              <div
                className="rounded-xl border p-6 md:p-7"
                style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}
              >
                <h3 className="text-base font-semibold text-white mb-2">MCP everywhere</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  One integration works with Cursor, Claude, and any client that speaks Model Context Protocol.
                </p>
              </div>
              <div
                className="rounded-xl border p-6 md:p-7"
                style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}
              >
                <h3 className="text-base font-semibold text-white mb-2">Your tools</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Pull tokens, health, and fee stats into Google Sheets, Airtable, or natural-language queries.
                </p>
              </div>
            </div>
          </section>

          {/* How it works - compact, no navbar link */}
          <section className="pt-16 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <h2 className="text-sm font-medium uppercase tracking-wider mb-10" style={{ color: 'rgba(255,255,255,0.4)' }}>
              How it works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              <div className="text-center md:text-left">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-black mb-4"
                  style={{ backgroundColor: GREEN }}
                >
                  1
                </div>
                <h3 className="text-white font-semibold mb-2">Connect</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Add the BagsMCP server to your AI assistant or connect to Sheets / BI.
                </p>
              </div>
              <div className="text-center md:text-left">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-black mb-4"
                  style={{ backgroundColor: GREEN }}
                >
                  2
                </div>
                <h3 className="text-white font-semibold mb-2">Query</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Use tools: list tokens, token health, top claimers, fee stats.
                </p>
              </div>
              <div className="text-center md:text-left">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-black mb-4"
                  style={{ backgroundColor: GREEN }}
                >
                  3
                </div>
                <h3 className="text-white font-semibold mb-2">Use</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Export to spreadsheets, feed reports, or let your AI use Bags data in context.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
