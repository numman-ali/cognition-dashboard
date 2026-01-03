<script lang="ts">
  import { onMount } from 'svelte'
  
  interface DashboardMetrics {
    activePolicats: number
    openIssues: number
    inProgress: number
    mergeQueueSize: number
    escalations: number
    totalMessages: number
  }

  let metrics: DashboardMetrics = {
    activePolicats: 0,
    openIssues: 0,
    inProgress: 0,
    mergeQueueSize: 0,
    escalations: 0,
    totalMessages: 0
  }

  let loading = true
  let error: string | null = null

  onMount(async () => {
    try {
      // Placeholder for real Gas Town integration
      // await fetchGasTownData()
      metrics = {
        activePolicats: 3,
        openIssues: 12,
        inProgress: 5,
        mergeQueueSize: 2,
        escalations: 1,
        totalMessages: 8
      }
      loading = false
    } catch (err) {
      error = 'Failed to load dashboard data'
      loading = false
    }
  })
</script>

<svelte:head>
  <title>Gas Town Dashboard</title>
</svelte:head>

<div class="min-h-screen bg-slate-950 text-white">
  <!-- Header -->
  <header class="border-b border-slate-800 bg-slate-900 px-8 py-6">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold mb-2">Gas Town Dashboard</h1>
      <p class="text-slate-400">Real-time visualization of distributed task orchestration</p>
    </div>
  </header>

  <!-- Main Content -->
  <main class="p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Status Overview Cards -->
      <section class="mb-8">
        <h2 class="text-2xl font-bold mb-4">System Overview</h2>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <!-- Active Polecats Card -->
          <div class="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition">
            <div class="text-slate-400 text-sm font-medium">Active Polecats</div>
            <div class="text-3xl font-bold mt-2">{metrics.activePolicats}</div>
            <div class="text-xs text-slate-500 mt-1">Workers online</div>
          </div>

          <!-- Open Issues Card -->
          <div class="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition">
            <div class="text-slate-400 text-sm font-medium">Open Issues</div>
            <div class="text-3xl font-bold mt-2">{metrics.openIssues}</div>
            <div class="text-xs text-slate-500 mt-1">Total beads</div>
          </div>

          <!-- In Progress Card -->
          <div class="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition">
            <div class="text-slate-400 text-sm font-medium">In Progress</div>
            <div class="text-3xl font-bold text-blue-400 mt-2">{metrics.inProgress}</div>
            <div class="text-xs text-slate-500 mt-1">Active tasks</div>
          </div>

          <!-- Merge Queue Card -->
          <div class="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition">
            <div class="text-slate-400 text-sm font-medium">Merge Queue</div>
            <div class="text-3xl font-bold text-green-400 mt-2">{metrics.mergeQueueSize}</div>
            <div class="text-xs text-slate-500 mt-1">Pending merges</div>
          </div>

          <!-- Escalations Card -->
          <div class="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition">
            <div class="text-slate-400 text-sm font-medium">Escalations</div>
            <div class="text-3xl font-bold {metrics.escalations > 0 ? 'text-red-400' : 'text-slate-400'} mt-2">
              {metrics.escalations}
            </div>
            <div class="text-xs text-slate-500 mt-1">Requires attention</div>
          </div>

          <!-- Messages Card -->
          <div class="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-slate-600 transition">
            <div class="text-slate-400 text-sm font-medium">Messages</div>
            <div class="text-3xl font-bold mt-2">{metrics.totalMessages}</div>
            <div class="text-xs text-slate-500 mt-1">Inter-agent comms</div>
          </div>
        </div>
      </section>

      <!-- Main Visualization Grid -->
      <section class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- Town Overview -->
        <div class="lg:col-span-2">
          <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div class="px-6 py-4 border-b border-slate-700 bg-slate-900">
              <h3 class="text-lg font-semibold">Town Overview</h3>
              <p class="text-sm text-slate-400 mt-1">
                Interactive network diagram of Gas Town workspace topology
              </p>
            </div>
            <div class="p-6 min-h-[400px] bg-slate-950 flex items-center justify-center">
              <div id="cytoscape-container" class="w-full h-full" />
              <div class="text-slate-500 text-center">
                <p class="text-sm">Cytoscape visualization component</p>
                <p class="text-xs text-slate-600 mt-1">Network graph rendering here</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Worker Status Panel -->
        <div>
          <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden h-full flex flex-col">
            <div class="px-6 py-4 border-b border-slate-700 bg-slate-900">
              <h3 class="text-lg font-semibold">Worker Status</h3>
              <p class="text-sm text-slate-400 mt-1">Active polecats</p>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-2">
              <div class="bg-slate-700 rounded px-3 py-2 text-sm">
                <div class="flex items-center justify-between">
                  <span class="font-medium">rictus</span>
                  <span class="inline-block w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <div class="text-xs text-slate-400 mt-1">Building dashboard</div>
              </div>
              <div class="bg-slate-700 rounded px-3 py-2 text-sm">
                <div class="flex items-center justify-between">
                  <span class="font-medium">furiosa</span>
                  <span class="inline-block w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <div class="text-xs text-slate-400 mt-1">Idle</div>
              </div>
              <div class="bg-slate-700 rounded px-3 py-2 text-sm">
                <div class="flex items-center justify-between">
                  <span class="font-medium">nux</span>
                  <span class="inline-block w-2 h-2 bg-green-500 rounded-full" />
                </div>
                <div class="text-xs text-slate-400 mt-1">Idle</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Secondary Visualizations -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Merge Pipeline -->
        <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-700 bg-slate-900">
            <h3 class="text-lg font-semibold">Merge Pipeline</h3>
            <p class="text-sm text-slate-400 mt-1">Refinery queue visualization</p>
          </div>
          <div class="p-6 min-h-[300px] bg-slate-950 flex items-center justify-center">
            <div class="text-slate-500 text-center">
              <p class="text-sm">Merge pipeline component</p>
              <p class="text-xs text-slate-600 mt-1">Work flowing through refinery</p>
            </div>
          </div>
        </div>

        <!-- Convoy Dashboard -->
        <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-700 bg-slate-900">
            <h3 class="text-lg font-semibold">Convoy Dashboard</h3>
            <p class="text-sm text-slate-400 mt-1">Batched work tracking</p>
          </div>
          <div class="p-6 min-h-[300px] bg-slate-950 flex items-center justify-center">
            <div class="text-slate-500 text-center">
              <p class="text-sm">Convoy component</p>
              <p class="text-xs text-slate-600 mt-1">Batched work items and progress</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Additional Panels -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <!-- Escalation Tree -->
        <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-700 bg-slate-900">
            <h3 class="text-lg font-semibold">Escalation Tree</h3>
            <p class="text-sm text-slate-400 mt-1">Issues requiring attention</p>
          </div>
          <div class="p-6 min-h-[250px] bg-slate-950 flex items-center justify-center">
            <div class="text-slate-500 text-center">
              <p class="text-sm">Escalation visualization</p>
              <p class="text-xs text-slate-600 mt-1">Hierarchical issue tree</p>
            </div>
          </div>
        </div>

        <!-- Activity Timeline -->
        <div class="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div class="px-6 py-4 border-b border-slate-700 bg-slate-900">
            <h3 class="text-lg font-semibold">Activity Timeline</h3>
            <p class="text-sm text-slate-400 mt-1">Recent events and messages</p>
          </div>
          <div class="p-6 min-h-[250px] bg-slate-950 overflow-y-auto">
            <div class="space-y-3 text-sm">
              <div class="flex gap-3">
                <div class="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <div class="font-medium">Dashboard initialized</div>
                  <div class="text-xs text-slate-500">Just now</div>
                </div>
              </div>
              <div class="flex gap-3">
                <div class="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <div class="font-medium">Polecat rictus started</div>
                  <div class="text-xs text-slate-500">A few seconds ago</div>
                </div>
              </div>
              <div class="flex gap-3">
                <div class="w-2 h-2 bg-slate-600 rounded-full mt-2 flex-shrink-0" />
                <div>
                  <div class="font-medium">Project created</div>
                  <div class="text-xs text-slate-500">2026-01-03 00:01</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>

  <!-- Footer -->
  <footer class="border-t border-slate-800 bg-slate-900 px-8 py-4 mt-12">
    <div class="max-w-7xl mx-auto text-center text-slate-400 text-sm">
      <p>Gas Town Dashboard • Real-time visualization engine</p>
    </div>
  </footer>
</div>

<style>
  :global(body) {
    margin: 0;
    overflow-x: hidden;
  }
</style>
