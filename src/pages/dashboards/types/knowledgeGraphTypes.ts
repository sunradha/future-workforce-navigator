
export interface Node {
  id: string;
  label: string;
  type?: string;
}

export interface Edge {
  source: string;
  target: string;
  relationship: string;
}

export interface KnowledgeGraphProps {
  title: string;
  nodes: Node[] | string[];
  edges: Edge[] | string[];
  height?: number;
  isSchema?: boolean;
}
