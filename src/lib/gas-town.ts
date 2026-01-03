import type { GasTopology, GasNode, GasEdge } from "./visualizer";

export interface Polecat {
  id: string;
  name: string;
  rig: string;
  status: "active" | "idle" | "blocked";
  workOnHook?: string;
}

export interface Bead {
  id: string;
  title: string;
  type: "task" | "bug" | "feature" | "epic";
  status: "open" | "in_progress" | "blocked" | "complete";
  assignee?: string;
  dependencies?: string[];
}

export interface Rig {
  id: string;
  name: string;
  projectPath: string;
}

export interface GasTownState {
  rigs: Rig[];
  polecats: Polecat[];
  beads: Bead[];
  messages?: Array<{
    from: string;
    to: string;
    timestamp: number;
  }>;
}

export class GasTownIntegration {
  /**
   * Convert Gas Town state to visualization topology
   */
  static stateToTopology(state: GasTownState): GasTopology {
    const nodes: GasNode[] = [];
    const edges: GasEdge[] = [];
    const edgeMap = new Set<string>();

    // Add rig nodes (town level)
    state.rigs.forEach((rig) => {
      nodes.push({
        id: `rig-${rig.id}`,
        label: rig.name,
        type: "town",
        status: "active",
      });
    });

    // Add polecat nodes
    state.polecats.forEach((polecat) => {
      nodes.push({
        id: `polecat-${polecat.id}`,
        label: polecat.name,
        type: "polecat",
        status: polecat.status,
      });

      // Connect polecat to its rig
      const edgeId = `rig-${polecat.rig}-to-polecat-${polecat.id}`;
      if (!edgeMap.has(edgeId)) {
        edges.push({
          source: `rig-${polecat.rig}`,
          target: `polecat-${polecat.id}`,
          type: "work",
          label: "member",
        });
        edgeMap.add(edgeId);
      }

      // Connect polecat to hooked work
      if (polecat.workOnHook) {
        const workEdgeId = `polecat-${polecat.id}-to-bead-${polecat.workOnHook}`;
        if (!edgeMap.has(workEdgeId)) {
          edges.push({
            source: `polecat-${polecat.id}`,
            target: `bead-${polecat.workOnHook}`,
            type: "work",
            label: "working on",
          });
          edgeMap.add(workEdgeId);
        }
      }
    });

    // Add bead nodes
    state.beads.forEach((bead) => {
      nodes.push({
        id: `bead-${bead.id}`,
        label: bead.title.substring(0, 20),
        type: "bead",
        status: this.mapBeadStatus(bead.status),
      });
    });

    // Add bead dependency edges
    state.beads.forEach((bead) => {
      if (bead.dependencies && bead.dependencies.length > 0) {
        bead.dependencies.forEach((dep) => {
          const depEdgeId = `bead-${bead.id}-dep-bead-${dep}`;
          if (!edgeMap.has(depEdgeId)) {
            edges.push({
              source: `bead-${dep}`,
              target: `bead-${bead.id}`,
              type: "dependency",
              label: "blocks",
            });
            edgeMap.add(depEdgeId);
          }
        });
      }
    });

    // Add communication edges from messages
    if (state.messages) {
      state.messages.forEach((msg) => {
        const msgEdgeId = `${msg.from}-to-${msg.to}`;
        if (!edgeMap.has(msgEdgeId)) {
          edges.push({
            source: this.normalizeNodeId(msg.from),
            target: this.normalizeNodeId(msg.to),
            type: "communication",
            label: "mail",
          });
          edgeMap.add(msgEdgeId);
        }
      });
    }

    return { nodes, edges };
  }

  /**
   * Map bead status to visualization status
   */
  private static mapBeadStatus(
    beadStatus: "open" | "in_progress" | "blocked" | "complete",
  ): "active" | "idle" | "blocked" | "complete" {
    switch (beadStatus) {
      case "in_progress":
        return "active";
      case "blocked":
        return "blocked";
      case "complete":
        return "complete";
      case "open":
      default:
        return "idle";
    }
  }

  /**
   * Normalize various node ID formats to consistent format
   */
  private static normalizeNodeId(id: string): string {
    if (id.includes("/")) {
      // It's an agent path like "cognition/polecats/nux"
      const parts = id.split("/");
      return `polecat-${parts[parts.length - 1]}`;
    }
    return id;
  }

  /**
   * Fetch polecats from Gas Town (stub for real implementation)
   */
  static async getPolecats(): Promise<Polecat[]> {
    // This would call actual Gas Town CLI commands
    // For now, return empty array
    return [];
  }

  /**
   * Fetch beads from Gas Town (stub for real implementation)
   */
  static async getBeads(): Promise<Bead[]> {
    // This would call actual Gas Town CLI commands via API
    // For now, return empty array
    return [];
  }

  /**
   * Fetch rigs from Gas Town (stub for real implementation)
   */
  static async getRigs(): Promise<Rig[]> {
    // This would call actual Gas Town CLI commands via API
    // For now, return empty array
    return [];
  }

  /**
   * Get complete Gas Town state
   */
  static async getGasTownState(): Promise<GasTownState> {
    const [rigs, polecats, beads] = await Promise.all([
      this.getRigs(),
      this.getPolecats(),
      this.getBeads(),
    ]);

    return {
      rigs,
      polecats,
      beads,
    };
  }
}

/**
 * Create sample/mock topology for development and testing
 */
export function createMockTopology(): GasTopology {
  return {
    nodes: [
      // Rigs
      {
        id: "rig-cognition",
        label: "Cognition",
        type: "town",
        status: "active",
      },
      { id: "rig-security", label: "Security", type: "town", status: "active" },

      // Polecats
      {
        id: "polecat-nux",
        label: "polecat: nux",
        type: "polecat",
        status: "active",
      },
      {
        id: "polecat-spike",
        label: "polecat: spike",
        type: "polecat",
        status: "idle",
      },
      {
        id: "polecat-alpha",
        label: "polecat: alpha",
        type: "polecat",
        status: "blocked",
      },

      // Refineries
      {
        id: "refinery-cognition",
        label: "Refinery (cognition)",
        type: "refinery",
        status: "active",
      },

      // Witnesses
      {
        id: "witness-cognition",
        label: "Witness (cognition)",
        type: "witness",
        status: "active",
      },

      // Beads
      {
        id: "bead-gm-8xz",
        label: "Create Cytoscape viz",
        type: "bead",
        status: "active",
      },
      {
        id: "bead-gm-abc",
        label: "Add WebSocket stream",
        type: "bead",
        status: "idle",
      },
      {
        id: "bead-gm-def",
        label: "Real-time updates",
        type: "bead",
        status: "blocked",
      },
      {
        id: "bead-gm-ghi",
        label: "Dashboard page",
        type: "bead",
        status: "active",
      },
    ],
    edges: [
      // Rig membership
      {
        source: "rig-cognition",
        target: "polecat-nux",
        type: "work",
        label: "member",
      },
      {
        source: "rig-cognition",
        target: "polecat-spike",
        type: "work",
        label: "member",
      },
      {
        source: "rig-cognition",
        target: "polecat-alpha",
        type: "work",
        label: "member",
      },
      {
        source: "rig-cognition",
        target: "refinery-cognition",
        type: "work",
        label: "merge",
      },
      {
        source: "rig-cognition",
        target: "witness-cognition",
        type: "work",
        label: "monitor",
      },

      // Work assignments
      {
        source: "polecat-nux",
        target: "bead-gm-8xz",
        type: "work",
        label: "working on",
      },
      {
        source: "polecat-spike",
        target: "bead-gm-abc",
        type: "work",
        label: "assigned",
      },
      {
        source: "polecat-alpha",
        target: "bead-gm-def",
        type: "work",
        label: "blocked on",
      },

      // Dependencies
      {
        source: "bead-gm-def",
        target: "bead-gm-8xz",
        type: "dependency",
        label: "blocks",
      },
      {
        source: "bead-gm-ghi",
        target: "bead-gm-abc",
        type: "dependency",
        label: "blocks",
      },

      // Communication
      {
        source: "polecat-nux",
        target: "witness-cognition",
        type: "communication",
        label: "report",
      },
    ],
  };
}
