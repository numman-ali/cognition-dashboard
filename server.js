import express from 'express';
import cors from 'cors';
import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Gas Town workspace path
const GT_PATH = '/Users/numman/gt';
const GT_BIN = '/Users/numman/go/bin/gt';
const BD_BIN = '/Users/numman/go/bin/bd';

// Execute a Gas Town CLI command
function runGtCommand(cmd) {
  // Replace gt and bd with full paths
  const fullCmd = cmd
    .replace(/^gt /, `${GT_BIN} `)
    .replace(/^bd /, `${BD_BIN} `);

  try {
    const stdout = execSync(fullCmd, {
      cwd: GT_PATH,
      encoding: 'utf-8',
      timeout: 15000
    });
    return { success: true, data: stdout, error: null };
  } catch (error) {
    console.error('Command error:', error.message);
    return { success: false, data: null, error: error.message };
  }
}

// Parse gt status output
function parseGtStatus(output) {
  const lines = output.split('\n');
  const result = {
    town: null,
    overseer: null,
    agents: [],
    rigs: []
  };

  let currentRig = null;
  let currentSection = null;

  for (const line of lines) {
    if (line.startsWith('Town:')) {
      result.town = line.replace('Town:', '').trim();
    } else if (line.includes('Overseer:')) {
      result.overseer = line.replace(/.*Overseer:/, '').trim();
    } else if (line.includes('───') && line.includes('/')) {
      // Rig header like "─── cognition/ ───"
      currentRig = line.replace(/[─\s/]/g, '').trim();
      result.rigs.push({ name: currentRig, agents: [] });
    } else if (line.includes('Mayor') || line.includes('Deacon')) {
      currentSection = line.includes('Mayor') ? 'mayor' : 'deacon';
    } else if (line.includes('Witness')) {
      currentSection = 'witness';
    } else if (line.includes('Refinery')) {
      currentSection = 'refinery';
    } else if (line.includes('Polecats')) {
      currentSection = 'polecats';
    } else if (line.includes('gt-') && (line.includes('running') || line.includes('stopped'))) {
      const parts = line.trim().split(/\s+/);
      const name = parts[0];
      const status = parts[1] || 'unknown';
      const agent = {
        id: name,
        name: name.split('-').pop(),
        type: currentSection || 'unknown',
        status: status,
        rig: currentRig,
        hook: null,
        mail: null
      };
      result.agents.push(agent);
      if (currentRig) {
        const rig = result.rigs.find(r => r.name === currentRig);
        if (rig) rig.agents.push(agent);
      }
    } else if (line.includes('hook:')) {
      const hook = line.replace(/.*hook:\s*/, '').replace(/[()]/g, '').trim();
      if (result.agents.length > 0) {
        result.agents[result.agents.length - 1].hook = hook === 'none' ? null : hook;
      }
    } else if (line.includes('mail:')) {
      const mail = line.replace(/.*mail:\s*/, '').trim();
      if (result.agents.length > 0) {
        result.agents[result.agents.length - 1].mail = mail;
      }
    }
  }

  return result;
}

// Parse bd list output
function parseBdList(output) {
  const lines = output.split('\n').filter(l => l.trim());
  const beads = [];

  for (const line of lines) {
    // Format: gm-xxx [P2] [task] open - Title
    const match = line.match(/^(\S+)\s+\[P(\d)\]\s+\[(\w+)\]\s+(\w+)\s+-\s+(.+)$/);
    if (match) {
      beads.push({
        id: match[1],
        priority: parseInt(match[2]),
        type: match[3],
        status: match[4],
        title: match[5]
      });
    }
  }

  return beads;
}

// API Routes

// Get full Gas Town status
app.get('/api/status', async (req, res) => {
  const result = await runGtCommand('gt status');
  if (result.success) {
    const parsed = parseGtStatus(result.data);
    res.json(parsed);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get all beads
app.get('/api/beads', async (req, res) => {
  const result = await runGtCommand('bd list --status=all');
  if (result.success) {
    const beads = parseBdList(result.data);
    res.json(beads);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get open beads only
app.get('/api/beads/open', async (req, res) => {
  const result = await runGtCommand('bd list --status=open');
  if (result.success) {
    const beads = parseBdList(result.data);
    res.json(beads);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get polecats for a specific rig
app.get('/api/rigs/:rig/polecats', async (req, res) => {
  const { rig } = req.params;
  const result = await runGtCommand(`gt status`);
  if (result.success) {
    const parsed = parseGtStatus(result.data);
    const rigData = parsed.rigs.find(r => r.name === rig);
    const polecats = rigData ? rigData.agents.filter(a => a.type === 'polecats') : [];
    res.json(polecats);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get mail inbox for an agent
app.get('/api/mail/:address', async (req, res) => {
  const { address } = req.params;
  const result = await runGtCommand(`gt mail inbox ${address}`);
  if (result.success) {
    res.json({ messages: result.data });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get activity feed (recent events)
app.get('/api/feed', async (req, res) => {
  const feedPath = path.join(GT_PATH, '.feed.jsonl');
  if (existsSync(feedPath)) {
    try {
      const content = readFileSync(feedPath, 'utf-8');
      const events = content.split('\n')
        .filter(l => l.trim())
        .map(l => {
          try { return JSON.parse(l); } catch { return null; }
        })
        .filter(Boolean)
        .slice(-50)
        .reverse();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.json([]);
  }
});

// Get bead details
app.get('/api/beads/:id', async (req, res) => {
  const { id } = req.params;
  const result = await runGtCommand(`bd show ${id}`);
  if (result.success) {
    res.json({ raw: result.data });
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

app.listen(PORT, () => {
  console.log(`Gas Town API server running on http://localhost:${PORT}`);
});
