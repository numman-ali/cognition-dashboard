<script lang="ts">
  export interface Convoy {
    id: string
    name: string
    totalItems: number
    completedItems: number
    inProgressItems: number
  }

  export let convoys: Convoy[] = []
</script>

<div class="space-y-3">
  {#each convoys as convoy (convoy.id)}
    <div class="bg-slate-700 rounded p-3">
      <div class="flex items-center justify-between mb-2">
        <span class="font-medium">{convoy.name}</span>
        <span class="text-xs text-slate-400">
          {convoy.completedItems}/{convoy.totalItems}
        </span>
      </div>
      <div class="flex gap-1">
        <div class="flex-1 bg-slate-600 rounded h-2">
          <div
            class="bg-green-500 h-2 rounded"
            style="width: {(convoy.completedItems / convoy.totalItems) * 100}%"
          />
        </div>
      </div>
      <div class="text-xs text-slate-400 mt-1">
        {convoy.inProgressItems} in progress
      </div>
    </div>
  {/each}
</div>
