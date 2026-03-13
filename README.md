# BagsMCP

BagsMCP is **MCP for non-devs**. It exposes the Bags API through the Model Context Protocol so anyone—community managers, researchers, and VCs—can get full insight into the Bags ecosystem without writing code. List tokens, check token health, see top claimers and fee stats, and export or live-connect to Google Sheets and Docs. One integration works everywhere: Cursor, Claude, spreadsheets, or BI. **Complete insight, zero code.**

## What it does

- **MCP server** — Tools and resources like “list tokens,” “token health,” “top claimers,” “fee stats.” Any client that speaks MCP can pull Bags data.
- **No-code access** — Community managers, researchers, and VCs use Bags data from their existing tools (AI chats, Sheets, Airtable) instead of a custom dashboard.
- **Pluggable** — Fits into the AI/agent ecosystem; one integration works with Cursor, Claude, and other MCP clients.

## Why it matters

- **Wider use** — Expands who can use Bags data (non-devs) and how (natural language, automation, BI).
- **No custom app** — Query and export from the tools you already use.
- **Ecosystem** — MCP makes Bags data available wherever MCP is supported.

## Advantages of the idea

- **No code, full insight** — VCs and analysts get complete Bags ecosystem visibility (tokens, fee distribution, claimer activity) without building or maintaining dashboards or scripts.
- **Use the tools you already have** — Works inside Google Sheets, Google Docs, and AI assistants (Cursor, Claude). No new UI to learn; data flows into existing workflows.
- **MCP for everyone** — Model Context Protocol is no longer dev-only. Non-technical users can ask in plain language or use spreadsheets while the MCP server handles the Bags API.
- **One integration, many surfaces** — A single BagsMCP server can power Sheets, Docs, BI tools, and AI chats. Less duplication, easier updates, and one place to add new Bags API features.
- **Trust and transparency** — Data comes from the official Bags API via a clear MCP layer, so stakeholders can rely on token health, top claimers, and fee stats for research and due diligence.
- **Faster decisions** — No waiting on dev teams for custom reports. Pull live data into Sheets or ask an AI; get answers in minutes instead of days.

## Who it helps

- **VCs & analysts** — Full Bags insight for deal flow and portfolio monitoring, with no code and no custom dashboards.
- **Community managers** — Track token health and claimer activity from Sheets or an AI assistant.
- **Researchers** — Export or query Bags data for analysis without writing API code.
- **Non-technical teams** — Anyone who uses Sheets, Docs, or AI tools can work with Bags data through the same interfaces they already use.

## Tech stack

- **Framework:** Next.js
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **MCP:** Bags API wrapped as MCP server (tools/resources for tokens, health, claimers, fees)

## Design

- **Brand color:** `#20D55A` (green)
- **Theme:** Dark (black background, white/gray text) for clarity and consistency.

## License

Private and proprietary.

---

**BagsMCP** — Bags API via MCP. For everyone.
