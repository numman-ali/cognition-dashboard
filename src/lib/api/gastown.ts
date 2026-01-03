/**
 * Gas Town API Integration
 * Provides TypeScript module to query live Gas Town state
 *
 * - Query polecats and their status
 * - Read beads (work items) and progress
 * - Monitor merge queue
 * - Track escalations
 * - Real-time updates via WebSocket
 */

export interface GasTownAPI {
  polecats: () => Promise<Array<{
    id: string
    name: string
    status: 'idle' | 'working' | 'offline'
  }>>
  
  beads: () => Promise<Array<{
    id: string
    title: string
    status: string
    assignee?: string
  }>>
  
  refinery: {
    queue: () => Promise<Array<{
      id: string
      title: string
      status: string
    }>>
  }
  
  escalations: () => Promise<Array<{
    id: string
    title: string
    priority: number
  }>>
}

// TODO: Implement actual Gas Town API calls
// This will be connected in gm-a2o (Implement Gas Town API integration)
