
export interface Node {
  id: string;
  label: string;
  type?: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
  index?: number;
  vx?: number;
  vy?: number;
}

export interface Edge {
  source: string | Node;
  target: string | Node;
  relationship: string;
}

export interface KnowledgeGraphProps {
  title: string;
  nodes: Node[] | string[];
  edges: Edge[] | string[];
  height?: number;
  isSchema?: boolean;
}
