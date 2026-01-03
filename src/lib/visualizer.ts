import cytoscape, { type Core, type ElementDefinition } from "cytoscape";

export interface GasNode {
  id: string;
  label: string;
  type: "polecat" | "refinery" | "witness" | "bead" | "town";
  status?: "active" | "idle" | "blocked" | "complete";
}

export interface GasEdge {
  source: string;
  target: string;
  label?: string;
  type?: "work" | "dependency" | "communication";
}

export interface GasTopology {
  nodes: GasNode[];
  edges: GasEdge[];
}

export class GasTownVisualizer {
  private cy: Core | null = null;
  private container: HTMLElement | null = null;

  initialize(container: HTMLElement): Core {
    this.container = container;

    // Initialize Cytoscape with Gas Town styling
    this.cy = cytoscape({
      container,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      style: this.getStyles() as any,
      layout: {
        name: "cose",
        animate: true,
        animationDuration: 500,
        padding: 30,
        nodeDimensionsIncludeLabels: true,
        spacingFactor: 1.5,
      },
    });

    // Add interactive features
    this.setupInteractions();

    return this.cy;
  }

  loadTopology(topology: GasTopology): void {
    if (!this.cy) {
      throw new Error("Visualizer not initialized. Call initialize() first.");
    }

    // Convert nodes and edges to Cytoscape format
    const elements: ElementDefinition[] = [
      ...topology.nodes.map((node) => ({
        data: {
          id: node.id,
          label: node.label,
          type: node.type,
          status: node.status || "idle",
        },
      })),
      ...topology.edges.map((edge) => ({
        data: {
          id: `${edge.source}-${edge.target}`,
          source: edge.source,
          target: edge.target,
          label: edge.label,
          type: edge.type || "work",
        },
      })),
    ];

    this.cy.elements().remove();
    this.cy.add(elements);
    this.runLayout();
  }

  private getStyles() {
    return [
      {
        selector: "node",
        style: {
          "background-color": "#8b5cf6",
          label: "data(label)",
          "text-valign": "center",
          "text-halign": "center",
          width: "60px",
          height: "60px",
          "font-size": "12px",
          "text-wrap": "wrap",
          "text-max-width": "50px",
          "text-background-color": "#1e293b",
          "text-background-padding": "4px",
          "text-background-opacity": 0.8,
          "text-background-shape": "rounded-rectangle",
          color: "#f8fafc",
        },
      },
      // Polecat nodes
      {
        selector: 'node[type="polecat"]',
        style: {
          "background-color": "#8b5cf6",
          width: "70px",
          height: "70px",
        },
      },
      // Refinery nodes
      {
        selector: 'node[type="refinery"]',
        style: {
          "background-color": "#06b6d4",
          shape: "square",
          width: "70px",
          height: "70px",
        },
      },
      // Witness nodes
      {
        selector: 'node[type="witness"]',
        style: {
          "background-color": "#f59e0b",
          shape: "diamond",
          width: "60px",
          height: "60px",
        },
      },
      // Bead/Work item nodes
      {
        selector: 'node[type="bead"]',
        style: {
          "background-color": "#6366f1",
          shape: "rectangle",
          width: "50px",
          height: "50px",
        },
      },
      // Town/Rig nodes
      {
        selector: 'node[type="town"]',
        style: {
          "background-color": "#64748b",
          shape: "hexagon",
          width: "80px",
          height: "80px",
        },
      },
      // Status-based styling
      {
        selector: 'node[status="active"]',
        style: {
          "border-width": 3,
          "border-color": "#4ade80",
          "box-shadow": "0 0 10px rgba(74, 222, 128, 0.5)",
        },
      },
      {
        selector: 'node[status="blocked"]',
        style: {
          "border-width": 3,
          "border-color": "#ef4444",
          "box-shadow": "0 0 10px rgba(239, 68, 68, 0.5)",
        },
      },
      {
        selector: 'node[status="complete"]',
        style: {
          "border-width": 2,
          "border-color": "#22c55e",
          opacity: 0.8,
        },
      },
      // Edges
      {
        selector: "edge",
        style: {
          "line-color": "#64748b",
          "target-arrow-color": "#64748b",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier",
          width: 2,
          label: "data(label)",
          "font-size": "10px",
          "text-background-color": "#1e293b",
          "text-background-padding": "2px",
          "text-background-opacity": 0.8,
        },
      },
      // Work dependency edges
      {
        selector: 'edge[type="dependency"]',
        style: {
          "line-style": "dashed",
          "line-color": "#f97316",
        },
      },
      // Communication edges
      {
        selector: 'edge[type="communication"]',
        style: {
          "line-style": "dotted",
          "line-color": "#a78bfa",
        },
      },
      // Selected elements
      {
        selector: ":selected",
        style: {
          "border-width": 4,
          "border-color": "#fbbf24",
          "box-shadow": "0 0 15px rgba(251, 191, 36, 0.8)",
        },
      },
      // Highlighted elements
      {
        selector: ".highlighted",
        style: {
          "background-color": "#fbbf24",
          "line-color": "#fbbf24",
          "target-arrow-color": "#fbbf24",
          "transition-property": "background-color, border-color, line-color",
          "transition-duration": 200,
        },
      },
    ];
  }

  private setupInteractions(): void {
    if (!this.cy) return;

    // Tap event for node selection
    this.cy.on("tap", "node", (event) => {
      const node = event.target;
      this.cy?.elements().removeClass("highlighted");
      node.addClass("highlighted");
      node.predecessors().addClass("highlighted");
      node.successors().addClass("highlighted");
    });

    // Deselect on background click
    this.cy.on("tap", (event) => {
      if (event.target === this.cy) {
        this.cy?.elements().removeClass("highlighted");
      }
    });

    // Hover effects
    this.cy.on("mouseover", "node", (event) => {
      const node = event.target;
      node.style("border-width", 3);
    });

    this.cy.on("mouseout", "node", (event) => {
      const node = event.target;
      if (!node.selected()) {
        node.style("border-width", node.data("status") ? 2 : 0);
      }
    });
  }

  runLayout(): void {
    if (!this.cy) return;
    const layout = this.cy.layout({
      name: "cose",
      animate: true,
      animationDuration: 500,
      padding: 30,
      spacingFactor: 1.5,
    });
    layout.run();
  }

  fitGraph(): void {
    if (!this.cy) return;
    this.cy.fit(this.cy.elements(), 20);
  }

  destroy(): void {
    if (this.cy) {
      this.cy.destroy();
      this.cy = null;
    }
  }

  getCore(): Core | null {
    return this.cy;
  }

  export(format: "png" | "jpg" | "json" = "png"): string {
    if (!this.cy) throw new Error("Visualizer not initialized");

    if (format === "json") {
      return JSON.stringify(this.cy.json());
    }

    return this.cy.png({
      full: true,
      maxWidth: 4096,
      maxHeight: 4096,
    });
  }
}

export function createVisualizer(): GasTownVisualizer {
  return new GasTownVisualizer();
}
