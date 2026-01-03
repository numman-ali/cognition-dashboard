import { writable } from "svelte/store";

export interface GasTownState {
  polecats: Array<{
    id: string;
    name: string;
    status: string;
  }>;
  beads: Array<{
    id: string;
    title: string;
    status: string;
  }>;
  mergeQueue: number;
  escalations: number;
}

// Placeholder store - will be populated by real Gas Town integration
export const gasTownState = writable<GasTownState>({
  polecats: [],
  beads: [],
  mergeQueue: 0,
  escalations: 0,
});

export async function initializeGasTown() {
  // TODO: Connect to Gas Town API
  // - Query live polecats
  // - Subscribe to beads updates
  // - Monitor merge queue
  // - Watch for escalations
}
