<script lang="ts">
  export interface Worker {
    id: string
    name: string
    status: 'idle' | 'working' | 'offline'
    currentTask?: string
    uptime: number
  }

  export let workers: Worker[] = []
</script>

<div class="space-y-2">
  {#each workers as worker (worker.id)}
    <div class="bg-slate-700 rounded px-3 py-2 text-sm">
      <div class="flex items-center justify-between">
        <span class="font-medium">{worker.name}</span>
        <span
          class="inline-block w-2 h-2 rounded-full"
          class:bg-green-500={worker.status === 'idle' || worker.status === 'working'}
          class:bg-red-500={worker.status === 'offline'}
        />
      </div>
      {#if worker.currentTask}
        <div class="text-xs text-slate-400 mt-1">{worker.currentTask}</div>
      {/if}
    </div>
  {/each}
</div>
