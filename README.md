# Cognition Dashboard

**Real-time Gas Town Visualization Engine**

A modern, interactive web dashboard for monitoring and visualizing Gas Town operations. Watch polecats work, see the merge pipeline, track convoys, and understand your distributed task orchestration system at a glance.

## Features

### Core Visualization
- **Town Overview** - Interactive network diagram of your Gas Town workspace
- **Worker Status** - Real-time monitoring of polecats and crew members
- **Merge Pipeline** - Visualize work flowing through the Refinery queue
- **Convoy Dashboard** - Track batched work items and their progress
- **Escalation Tree** - Monitor what issues need attention
- **Mail/Messages** - See inter-agent communication in real-time

### Monitoring
- ✨ Real-time updates via WebSocket
- 📊 Historical activity timeline
- 🎯 Work item details and status
- 🔄 Refinery merge queue visualization
- 📈 Performance metrics and throughput stats
- 🚨 Escalation alerts and incident tracking

### Architecture
- **Frontend**: SvelteKit + TypeScript
- **Visualization**: Cytoscape.js for network graphs
- **Real-time**: WebSocket + Server-Sent Events
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites
- Node.js 18+
- Gas Town installation (`gt`)
- GitHub CLI (`gh`)

### Installation

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to see the dashboard.

## Project Structure

```
src/
├── routes/              # SvelteKit routes
│   ├── +page.svelte    # Main dashboard
│   └── api/            # API endpoints for Gas Town
├── lib/
│   ├── components/     # Reusable Svelte components
│   ├── stores/         # State management
│   ├── gas-town.ts     # Gas Town integration
│   └── visualizer.ts   # Cytoscape visualization
└── styles/             # Global styles
```

## Gas Town Integration

The dashboard reads live data from your Gas Town installation:

- Polecats and their worktree status
- Beads (work items) and their progress
- Witness monitoring data
- Refinery merge queue
- Escalation events
- Mail messages

```typescript
// Example: Query Gas Town state
import { queryGasTown } from '$lib/gas-town';

const polecats = await queryGasTown.polecats();
const mergeQueue = await queryGasTown.refinery.queue();
const escalations = await queryGasTown.escalations();
```

## Development

### Build

```bash
npm run build
```

### Test

```bash
npm test
```

### Lint

```bash
npm run lint
```

## Features Roadmap

- [ ] Interactive polecat lifecycle visualization
- [ ] Molecule step-by-step progress tracking
- [ ] Real-time merge queue animation
- [ ] Escalation drill-down details
- [ ] Performance timeline graph
- [ ] Custom alert thresholds
- [ ] Export/report generation
- [ ] Multi-town support

## License

MIT

## Built with Gas Town

This dashboard is built using Gas Town itself. Watch polecats work on these features in real-time!
