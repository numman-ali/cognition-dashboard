<script lang="ts">
  import './app.css';
  import { onMount, onDestroy } from 'svelte';
  import CytoscapeViewer from '$lib/components/CytoscapeViewer.svelte';
  import { api, type GasTownStatus, type Bead, type Agent } from '$lib/api/client';
  import { GasTownIntegration, createMockTopology } from '$lib/gas-town';
  import type { GasTopology } from '$lib/visualizer';

  let status: GasTownStatus | null = null;
  let beads: Bead[] = [];
  let connected = false;
  let loading = true;
  let error: string | null = null;
  let topology: GasTopology = { nodes: [], edges: [] };
  let lastUpdate: Date | null = null;
  let selectedBead: string | null = null;

  // Convert API data to topology for visualization
  function buildTopology(status: GasTownStatus, beads: Bead[]): GasTopology {
    const nodes: GasTopology['nodes'] = [];
    const edges: GasTopology['edges'] = [];

    // Add rig nodes
    status.rigs.forEach(rig => {
      nodes.push({
        id: `rig-${rig.name}`,
        label: rig.name,
        type: 'town',
        status: 'active'
      });
    });

    // Add agent nodes
    status.agents.forEach(agent => {
      let type: 'polecat' | 'refinery' | 'witness' | 'bead' | 'town' = 'polecat';
      if (agent.type === 'refinery') type = 'refinery';
      else if (agent.type === 'witness') type = 'witness';

      const agentStatus = agent.status === 'running' ? 'active' : 'idle';

      nodes.push({
        id: `agent-${agent.id}`,
        label: agent.name,
        type,
        status: agent.hook ? 'active' : agentStatus
      });

      // Connect to rig
      if (agent.rig) {
        edges.push({
          source: `rig-${agent.rig}`,
          target: `agent-${agent.id}`,
          type: 'work',
          label: 'member'
        });
      }

      // Connect to hooked work
      if (agent.hook && agent.hook !== 'none') {
        edges.push({
          source: `agent-${agent.id}`,
          target: `bead-${agent.hook}`,
          type: 'work',
          label: 'working'
        });
      }
    });

    // Add bead nodes
    beads.forEach(bead => {
      let beadStatus: 'active' | 'idle' | 'blocked' | 'complete' = 'idle';
      if (bead.status === 'in_progress' || bead.status === 'hooked') beadStatus = 'active';
      else if (bead.status === 'blocked') beadStatus = 'blocked';
      else if (bead.status === 'complete' || bead.status === 'closed') beadStatus = 'complete';

      nodes.push({
        id: `bead-${bead.id}`,
        label: bead.title.substring(0, 25),
        type: 'bead',
        status: beadStatus
      });
    });

    return { nodes, edges };
  }

  async function loadData() {
    try {
      const [statusData, beadsData] = await Promise.all([
        api.getStatus(),
        api.getBeads()
      ]);
      status = statusData;
      beads = beadsData;
      topology = buildTopology(statusData, beadsData);
      connected = true;
      error = null;
      lastUpdate = new Date();
    } catch (e) {
      error = e instanceof Error ? e.message : 'Connection failed';
      connected = false;
      // Use mock data for demo
      topology = createMockTopology();
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    loadData();
    // Poll every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  });

  function getStatusColor(status: string): string {
    switch (status) {
      case 'running': return 'text-green-400';
      case 'stopped': return 'text-gray-500';
      case 'open': return 'text-blue-400';
      case 'in_progress': case 'hooked': return 'text-yellow-400';
      case 'complete': case 'closed': return 'text-green-400';
      case 'blocked': return 'text-red-400';
      default: return 'text-gray-400';
    }
  }

  function getPriorityBadge(priority: number): string {
    switch (priority) {
      case 0: return 'bg-red-600';
      case 1: return 'bg-orange-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  }

  function getAgentIcon(type: string): string {
    switch (type) {
      case 'polecats': return '🐱';
      case 'witness': return '🦉';
      case 'refinery': return '🏭';
      case 'mayor': return '🎩';
      case 'deacon': return '🐺';
      default: return '🤖';
    }
  }

  $: polecats = status?.agents.filter(a => a.type === 'polecats') || [];
  $: witnesses = status?.agents.filter(a => a.type === 'witness') || [];
  $: refineries = status?.agents.filter(a => a.type === 'refinery') || [];
  $: openBeads = beads.filter(b => b.status === 'open' || b.status === 'in_progress' || b.status === 'hooked');
  $: activeCount = polecats.filter(p => p.status === 'running').length;
  $: hookedCount = polecats.filter(p => p.hook).length;
</script>

<main class="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
  <!-- Header -->
  <header class="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-xl">
              🏭
            </div>
            <div>
              <h1 class="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Gas Town Dashboard
              </h1>
              <p class="text-xs text-slate-500">Real-time Orchestration Visualization</p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-6">
          <!-- Stats -->
          <div class="hidden md:flex items-center gap-6 text-sm">
            <div class="flex items-center gap-2">
              <span class="text-slate-500">Polecats:</span>
              <span class="font-mono text-violet-400">{activeCount}/{polecats.length}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-slate-500">Hooked:</span>
              <span class="font-mono text-cyan-400">{hookedCount}</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-slate-500">Open Tasks:</span>
              <span class="font-mono text-amber-400">{openBeads.length}</span>
            </div>
          </div>

          <!-- Connection Status -->
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-full {connected ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'}">
            <div class="w-2 h-2 rounded-full {connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}"></div>
            <span class="text-xs {connected ? 'text-green-400' : 'text-red-400'}">
              {connected ? 'Live' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    </div>
  </header>

  <div class="container mx-auto px-6 py-6">
    {#if loading}
      <div class="flex items-center justify-center h-96">
        <div class="text-center">
          <div class="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-slate-400">Connecting to Gas Town...</p>
        </div>
      </div>
    {:else}
      <div class="grid grid-cols-12 gap-6">
        <!-- Main Visualization -->
        <div class="col-span-12 lg:col-span-8">
          <div class="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <h2 class="font-semibold text-slate-200">Network Topology</h2>
              {#if lastUpdate}
                <span class="text-xs text-slate-500">Updated {lastUpdate.toLocaleTimeString()}</span>
              {/if}
            </div>
            <CytoscapeViewer {topology} height="500px" />
          </div>
        </div>

        <!-- Sidebar -->
        <div class="col-span-12 lg:col-span-4 space-y-6">
          <!-- Agents Panel -->
          <div class="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-800">
              <h2 class="font-semibold text-slate-200">Active Agents</h2>
            </div>
            <div class="p-4 space-y-3 max-h-80 overflow-y-auto">
              {#if status}
                {#each status.agents as agent}
                  <div class="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors">
                    <div class="flex items-center gap-3">
                      <span class="text-lg">{getAgentIcon(agent.type)}</span>
                      <div>
                        <div class="font-medium text-sm">{agent.name}</div>
                        <div class="text-xs text-slate-500">{agent.type}</div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      {#if agent.hook}
                        <span class="px-2 py-0.5 text-xs rounded bg-violet-900/50 text-violet-300 font-mono">
                          {agent.hook}
                        </span>
                      {/if}
                      <div class="w-2 h-2 rounded-full {agent.status === 'running' ? 'bg-green-400' : 'bg-gray-500'}"></div>
                    </div>
                  </div>
                {/each}
              {:else}
                <p class="text-slate-500 text-sm text-center py-4">No agents available</p>
              {/if}
            </div>
          </div>

          <!-- Tasks Panel -->
          <div class="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
            <div class="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <h2 class="font-semibold text-slate-200">Tasks</h2>
              <span class="text-xs text-slate-500">{beads.length} total</span>
            </div>
            <div class="p-4 space-y-2 max-h-80 overflow-y-auto">
              {#each beads.slice(0, 15) as bead}
                <div
                  class="p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors cursor-pointer"
                  class:ring-2={selectedBead === bead.id}
                  class:ring-violet-500={selectedBead === bead.id}
                  on:click={() => selectedBead = selectedBead === bead.id ? null : bead.id}
                  on:keydown={(e) => e.key === 'Enter' && (selectedBead = selectedBead === bead.id ? null : bead.id)}
                  role="button"
                  tabindex="0"
                >
                  <div class="flex items-start justify-between gap-2">
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2">
                        <span class="font-mono text-xs text-slate-500">{bead.id}</span>
                        <span class="px-1.5 py-0.5 text-xs rounded {getPriorityBadge(bead.priority)}">
                          P{bead.priority}
                        </span>
                      </div>
                      <div class="text-sm font-medium mt-1 truncate">{bead.title}</div>
                    </div>
                    <span class="text-xs {getStatusColor(bead.status)} whitespace-nowrap">
                      {bead.status}
                    </span>
                  </div>
                </div>
              {/each}
              {#if beads.length === 0}
                <p class="text-slate-500 text-sm text-center py-4">No tasks found</p>
              {/if}
            </div>
          </div>
        </div>

        <!-- Bottom Stats Row -->
        <div class="col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
            <div class="text-slate-500 text-sm">Total Rigs</div>
            <div class="text-2xl font-bold text-violet-400">{status?.rigs.length || 0}</div>
          </div>
          <div class="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
            <div class="text-slate-500 text-sm">Active Polecats</div>
            <div class="text-2xl font-bold text-green-400">{activeCount}</div>
          </div>
          <div class="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
            <div class="text-slate-500 text-sm">Work in Progress</div>
            <div class="text-2xl font-bold text-amber-400">{hookedCount}</div>
          </div>
          <div class="bg-slate-900/50 rounded-xl border border-slate-800 p-4">
            <div class="text-slate-500 text-sm">Town</div>
            <div class="text-xl font-bold text-cyan-400 truncate">{status?.town || 'N/A'}</div>
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Footer -->
  <footer class="border-t border-slate-800 mt-8 py-4">
    <div class="container mx-auto px-6 text-center text-sm text-slate-600">
      Gas Town Cognition Dashboard &middot; Real-time distributed task orchestration
    </div>
  </footer>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }
</style>
