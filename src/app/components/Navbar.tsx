import Link from 'next/link';
import BagsMCPLogo from './BagsMCPLogo';

export default function Navbar() {
  return (
    <header className="w-full py-4 px-6 border-b border-white/10" style={{ backgroundColor: '#080808' }}>
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <BagsMCPLogo variant="icon" size={28} />
          <span className="text-lg font-semibold tracking-tight" style={{ color: '#20D55A' }}>
            BagsMCP
          </span>
        </Link>
        <div className="flex items-center">
          <button className="px-4 py-2 bg-[#20D55A] text-black text-sm font-semibold rounded-lg transition-colors hover:opacity-90">
            Get started
          </button>
        </div>
      </div>
    </header>
  );
}

