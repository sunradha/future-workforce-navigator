
import { RefObject } from 'react';
import { Node, Edge } from '../../types/knowledgeGraphTypes';

export interface UseD3GraphProps {
  svgRef: RefObject<SVGSVGElement>;
  nodes: Node[];
  edges: Edge[];
  height: number;
}

export interface GraphSimulationOptions {
  linkDistance?: number;
  chargeStrength?: number;
  collideRadius?: number;
  centerForce?: boolean;
}
