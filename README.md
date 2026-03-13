# BagsMCP

**Bags data for non-devs: MCP server + spreadsheets / BI**

BagsMCP exposes Bags API data through an **MCP (Model Context Protocol) server** so anyone can query it from AI assistants (e.g. Cursor, Claude), spreadsheets, or BI tools without writing code.

## What it does

- **MCP server** — Tools and resources like “list tokens,” “token health,” “top claimers,” “fee stats.” Any client that speaks MCP can pull Bags data.
- **No-code access** — Community managers, researchers, and VCs use Bags data from their existing tools (AI chats, Sheets, Airtable) instead of a custom dashboard.
- **Pluggable** — Fits into the AI/agent ecosystem; one integration works with Cursor, Claude, and other MCP clients.

## Why it matters

- **Wider use** — Expands who can use Bags data (non-devs) and how (natural language, automation, BI).
- **No custom app** — Query and export from the tools you already use.
- **Ecosystem** — MCP makes Bags data available wherever MCP is supported.

## Tech stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **MCP:** Bags API wrapped as MCP server (tools/resources for tokens, health, claimers, fees)

## Getting started

1. Clone and install:
   ```bash
   git clone <repository-url>
   cd KalshiBags
   npm install
   ```

2. Run the app:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000).

3. (Optional) Run or connect the MCP server per project docs to use Bags data from Cursor, Claude, or other MCP clients.

## Design

- **Brand color:** `#20D55A` (green)
- **Theme:** Dark (black background, white/gray text) for clarity and consistency.

## License

Private and proprietary.

---

**BagsMCP** — Bags API via MCP. For everyone.
