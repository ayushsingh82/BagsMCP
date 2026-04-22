'use client';

import { useMemo, useState } from 'react';

const GREEN = '#20D55A';

const cursorConfig = `{
  "mcpServers": {
    "bagsmcp": {
      "command": "bash",
      "args": ["\${workspaceFolder}/mcp-server/run-mcp.sh"]
    }
  }
}`;

const claudeConfig = `{
  "mcpServers": {
    "bagsmcp": {
      "command": "bash",
      "args": ["/absolute/path/to/BagsMCP/mcp-server/run-mcp.sh"]
    }
  }
}`;

const endpointsText =
  'Bags API base URL:\n' +
  'https://public-api-v2.bags.fm/api/v1\n' +
  '\n' +
  'Read-only endpoints exposed as MCP tools:\n' +
  '- bags_get_token_launch_feed (no input)\n' +
  '- bags_get_token_launch_creators (input: tokenMint optional)\n' +
  '- bags_get_token_lifetime_fees (input: tokenMint required)\n' +
  '- bags_get_token_claim_stats (input: tokenMint required)\n' +
  '- bags_list_pools (no input)\n' +
  '- bags_get_claimable_positions (input: wallet optional)\n' +
  '\n' +
  'Input examples:\n' +
  '- tokenMint: "6XzJn2n5thof2FMdff9gize4FHCSmK5KnJnCF9PEBAGS"\n' +
  '- wallet/creator address: "D2vFMLdk9UV1AGpCZvEtarr2sPrE58Ht3gQxogLttZMq"\n' +
  '\n' +
  'Useful prompts in Cursor:\n' +
  '- Call bags_get_token_lifetime_fees with tokenMint "6Xz...BAGS"\n' +
  '- Call bags_get_token_launch_creators with tokenMint "6Xz...BAGS"\n' +
  '- Call bags_get_claimable_positions with wallet "D2vF...tZMq"\n' +
  '\n' +
  'Notes:\n' +
  '- Keep BAGS_API_KEY in project .env (run-mcp.sh loads it automatically)\n' +
  '- Cursor config above assumes workspace root is BagsMCP.\n' +
  '- If your workspace root is the parent folder, use ${workspaceFolder}/BagsMCP/mcp-server/run-mcp.sh instead.\n' +
  '- For Claude Desktop, replace /absolute/path/to/BagsMCP with your real local path.';

const endpointCards = [
  {
    title: 'API base URL',
    items: ['https://public-api-v2.bags.fm/api/v1'],
  },
  {
    title: 'Read-only endpoints exposed as MCP tools',
    items: [
      'bags_get_token_launch_feed (no input)',
      'bags_get_token_launch_creators (input: tokenMint optional)',
      'bags_get_token_lifetime_fees (input: tokenMint required)',
      'bags_get_token_claim_stats (input: tokenMint required)',
      'bags_list_pools (no input)',
      'bags_get_claimable_positions (input: wallet optional)',
    ],
  },
  {
    title: 'Input examples',
    items: [
      'tokenMint: "6XzJn2n5thof2FMdff9gize4FHCSmK5KnJnCF9PEBAGS"',
      'wallet/creator address: "D2vFMLdk9UV1AGpCZvEtarr2sPrE58Ht3gQxogLttZMq"',
    ],
  },
  {
    title: 'Useful prompts in Cursor',
    items: [
      'Call bags_get_token_lifetime_fees with tokenMint "6Xz...BAGS"',
      'Call bags_get_token_launch_creators with tokenMint "6Xz...BAGS"',
      'Call bags_get_claimable_positions with wallet "D2vF...tZMq"',
    ],
  },
];

const noteItems = [
  'Keep BAGS_API_KEY in project .env (run-mcp.sh loads it automatically)',
  'Cursor config above assumes workspace root is BagsMCP.',
  'If your workspace root is the parent folder, use ${workspaceFolder}/BagsMCP/mcp-server/run-mcp.sh instead.',
  'For Claude Desktop, replace /absolute/path/to/BagsMCP with your real local path.',
];

export default function McpSetupPanel() {
  const [target, setTarget] = useState<'cursor' | 'claude'>('cursor');
  const [copied, setCopied] = useState<'config' | 'endpoints' | null>(null);

  const config = useMemo(() => (target === 'cursor' ? cursorConfig : claudeConfig), [target]);

  async function copyText(kind: 'config' | 'endpoints') {
    const text = kind === 'config' ? config : endpointsText;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  }

  return (
    <section id="mcp-setup" className="mb-24 md:mb-32">
      <h2 className="text-sm font-medium uppercase tracking-wider mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
        MCP Setup
      </h2>

      <div className="rounded-xl border p-4 md:p-6" style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="inline-flex rounded-lg border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.15)' }}>
            <button
              type="button"
              onClick={() => setTarget('cursor')}
              className="px-4 py-2 text-sm font-medium transition-colors"
              style={{
                backgroundColor: target === 'cursor' ? GREEN : 'transparent',
                color: target === 'cursor' ? '#000000' : 'rgba(255,255,255,0.8)',
              }}
            >
              Cursor
            </button>
            <button
              type="button"
              onClick={() => setTarget('claude')}
              className="px-4 py-2 text-sm font-medium transition-colors"
              style={{
                backgroundColor: target === 'claude' ? GREEN : 'transparent',
                color: target === 'claude' ? '#000000' : 'rgba(255,255,255,0.8)',
              }}
            >
              Claude
            </button>
          </div>

          <button
            type="button"
            onClick={() => copyText('config')}
            className="px-3 py-2 rounded-lg text-xs font-semibold border transition-colors hover:border-[#20D55A]"
            style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}
          >
            {copied === 'config' ? 'Copied config' : `Copy ${target} config`}
          </button>
        </div>

        <pre className="rounded-lg p-4 text-xs md:text-sm overflow-x-auto border" style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', backgroundColor: '#070707' }}>
          <code>{config}</code>
        </pre>

        <div className="mt-6 pt-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h3 className="text-sm font-semibold text-white">Endpoints and transport</h3>
            <button
              type="button"
              onClick={() => copyText('endpoints')}
              className="px-3 py-2 rounded-lg text-xs font-semibold border transition-colors hover:border-[#20D55A]"
              style={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.85)' }}
            >
              {copied === 'endpoints' ? 'Copied endpoints' : 'Copy endpoints'}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {endpointCards.map((card) => (
              <div
                key={card.title}
                className="rounded-xl border p-4"
                style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}
              >
                <h4 className="text-sm font-semibold text-white mb-3">{card.title}</h4>
                <ul className="space-y-2">
                  {card.items.map((item) => (
                    <li key={item} className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div
            className="mt-4 rounded-xl border p-4"
            style={{ borderColor: 'rgba(255,255,255,0.08)', backgroundColor: 'rgba(255,255,255,0.02)' }}
          >
            <h4 className="text-sm font-semibold text-white mb-3">Notes</h4>
            <ul className="space-y-2">
              {noteItems.map((item) => (
                <li key={item} className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.72)' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
