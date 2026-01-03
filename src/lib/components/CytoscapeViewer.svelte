<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { createVisualizer, type GasTopology } from '$lib/visualizer';

  let container: HTMLDivElement;
  let visualizer = createVisualizer();
  let isInitialized = false;

  export let topology: GasTopology = { nodes: [], edges: [] };
  export let height = '600px';
  export let autoLayout = true;

  onMount(() => {
    if (container) {
      visualizer.initialize(container);
      isInitialized = true;
      if (topology.nodes.length > 0) {
        visualizer.loadTopology(topology);
      }
    }
  });

  onDestroy(() => {
    visualizer.destroy();
  });

  // Reactive: Update visualization when topology changes
  $: if (isInitialized && topology.nodes.length > 0) {
    visualizer.loadTopology(topology);
  }

  const handleFitGraph = () => {
    visualizer.fitGraph();
  };

  const handleRunLayout = () => {
    visualizer.runLayout();
  };

  const handleExport = (format: 'png' | 'jpg' | 'json' = 'json') => {
    const data = visualizer.export(format);

    if (format === 'json') {
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `topology-${new Date().getTime()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      const link = document.createElement('a');
      link.href = data;
      link.download = `topology-${new Date().getTime()}.${format}`;
      link.click();
    }
  };
</script>

<div class="cytoscape-viewer">
  <div class="toolbar">
    <button on:click={handleFitGraph} class="btn btn-primary">
      <span class="icon">⊡</span>
      Fit Graph
    </button>
    <button on:click={handleRunLayout} class="btn btn-primary">
      <span class="icon">⟳</span>
      Layout
    </button>
    <button on:click={() => handleExport('json')} class="btn btn-secondary">
      <span class="icon">↓</span>
      Export JSON
    </button>
    <button on:click={() => handleExport('png')} class="btn btn-secondary">
      <span class="icon">🖼</span>
      Export PNG
    </button>
  </div>

  <div class="graph-container" style="height: {height}" bind:this={container} />

  <div class="info-panel">
    <div class="stats">
      <div class="stat-item">
        <span class="label">Nodes:</span>
        <span class="value">{topology.nodes.length}</span>
      </div>
      <div class="stat-item">
        <span class="label">Edges:</span>
        <span class="value">{topology.edges.length}</span>
      </div>
    </div>
  </div>
</div>

<style>
  .cytoscape-viewer {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: #0f172a;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #334155;
  }

  .toolbar {
    display: flex;
    gap: 8px;
    padding: 12px;
    background-color: #1e293b;
    border-bottom: 1px solid #334155;
    flex-wrap: wrap;
  }

  .btn {
    padding: 8px 16px;
    border: 1px solid #475569;
    border-radius: 4px;
    background-color: #334155;
    color: #f8fafc;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
  }

  .btn:hover {
    background-color: #475569;
    border-color: #64748b;
  }

  .btn.btn-primary {
    background-color: #8b5cf6;
    border-color: #a78bfa;
  }

  .btn.btn-primary:hover {
    background-color: #a78bfa;
    border-color: #c4b5fd;
  }

  .btn.btn-secondary {
    background-color: #06b6d4;
    border-color: #22d3ee;
  }

  .btn.btn-secondary:hover {
    background-color: #22d3ee;
    border-color: #06e6eb;
  }

  .btn .icon {
    font-size: 16px;
  }

  .graph-container {
    flex: 1;
    position: relative;
    background-color: #0f172a;
    border: 1px solid #334155;
    margin: 8px;
    border-radius: 4px;
    overflow: hidden;
  }

  .info-panel {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background-color: #1e293b;
    border-top: 1px solid #334155;
    font-size: 12px;
  }

  .stats {
    display: flex;
    gap: 16px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .stat-item .label {
    color: #94a3b8;
    font-weight: 500;
  }

  .stat-item .value {
    color: #f8fafc;
    font-weight: bold;
  }
</style>
