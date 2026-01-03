const API_BASE = 'http://localhost:3001/api';

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: 'running' | 'stopped' | 'unknown';
  rig: string | null;
  hook: string | null;
  mail: string | null;
}

export interface Rig {
  name: string;
  agents: Agent[];
}

export interface GasTownStatus {
  town: string | null;
  overseer: string | null;
  agents: Agent[];
  rigs: Rig[];
}

export interface Bead {
  id: string;
  priority: number;
  type: string;
  status: string;
  title: string;
}

export interface FeedEvent {
  type: string;
  timestamp: string;
  data: Record<string, unknown>;
}

class GasTownAPI {
  private polling = false;
  private pollInterval: ReturnType<typeof setInterval> | null = null;

  async getStatus(): Promise<GasTownStatus> {
    const response = await fetch(`${API_BASE}/status`);
    if (!response.ok) throw new Error('Failed to fetch status');
    return response.json();
  }

  async getBeads(): Promise<Bead[]> {
    const response = await fetch(`${API_BASE}/beads`);
    if (!response.ok) throw new Error('Failed to fetch beads');
    return response.json();
  }

  async getOpenBeads(): Promise<Bead[]> {
    const response = await fetch(`${API_BASE}/beads/open`);
    if (!response.ok) throw new Error('Failed to fetch open beads');
    return response.json();
  }

  async getRigPolecats(rig: string): Promise<Agent[]> {
    const response = await fetch(`${API_BASE}/rigs/${rig}/polecats`);
    if (!response.ok) throw new Error('Failed to fetch polecats');
    return response.json();
  }

  async getFeed(): Promise<FeedEvent[]> {
    const response = await fetch(`${API_BASE}/feed`);
    if (!response.ok) throw new Error('Failed to fetch feed');
    return response.json();
  }

  async getBeadDetails(id: string): Promise<{ raw: string }> {
    const response = await fetch(`${API_BASE}/beads/${id}`);
    if (!response.ok) throw new Error('Failed to fetch bead details');
    return response.json();
  }

  async healthCheck(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  startPolling(callback: (data: { status: GasTownStatus; beads: Bead[] }) => void, intervalMs = 5000): void {
    if (this.polling) return;
    this.polling = true;

    const poll = async () => {
      try {
        const [status, beads] = await Promise.all([
          this.getStatus(),
          this.getBeads()
        ]);
        callback({ status, beads });
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    poll();
    this.pollInterval = setInterval(poll, intervalMs);
  }

  stopPolling(): void {
    this.polling = false;
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }
}

export const api = new GasTownAPI();
