import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/svelte'
import WorkerStatus from './WorkerStatus.svelte'

describe('WorkerStatus', () => {
  it('renders empty state when no workers', () => {
    render(WorkerStatus, { props: { workers: [] } })
    const container = screen.queryByText(/./);
    expect(container).toBeNull()
  })

  it('renders worker names', () => {
    const workers = [
      { id: '1', name: 'toast', status: 'working' as const, uptime: 3600 },
      { id: '2', name: 'dementus', status: 'idle' as const, uptime: 7200 }
    ]
    render(WorkerStatus, { props: { workers } })

    expect(screen.getByText('toast')).toBeInTheDocument()
    expect(screen.getByText('dementus')).toBeInTheDocument()
  })

  it('shows current task when present', () => {
    const workers = [
      { id: '1', name: 'toast', status: 'working' as const, currentTask: 'Building dashboard', uptime: 3600 }
    ]
    render(WorkerStatus, { props: { workers } })

    expect(screen.getByText('Building dashboard')).toBeInTheDocument()
  })

  it('does not show task text when no current task', () => {
    const workers = [
      { id: '1', name: 'toast', status: 'idle' as const, uptime: 3600 }
    ]
    render(WorkerStatus, { props: { workers } })

    expect(screen.getByText('toast')).toBeInTheDocument()
    expect(screen.queryByText('Building dashboard')).toBeNull()
  })
})
