<script lang="ts">
  export interface MergeJob {
    id: string
    title: string
    status: 'pending' | 'merging' | 'merged' | 'failed'
    progress: number
  }

  export let jobs: MergeJob[] = []
</script>

<div class="space-y-2">
  {#each jobs as job (job.id)}
    <div class="bg-slate-700 rounded p-3">
      <div class="flex items-center justify-between mb-1">
        <span class="text-sm font-medium">{job.title}</span>
        <span class="text-xs px-2 py-1 bg-slate-600 rounded">{job.status}</span>
      </div>
      <div class="w-full bg-slate-600 rounded h-1">
        <div class="bg-green-500 h-1 rounded" style="width: {job.progress}%" />
      </div>
    </div>
  {/each}
</div>
