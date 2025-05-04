
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { ChartNetwork } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  type?: string;
}

interface Edge {
  source: string;
  target: string;
  relationship: string;
}

interface KnowledgeGraphProps {
  title: string;
  nodes: Node[] | string[];
  edges: Edge[] | string[];
  height?: number;
  isSchema?: boolean;
}

const KnowledgeGraph = ({ title, nodes, edges, height = 350, isSchema = false }: KnowledgeGraphProps) => {
  const svgRef = useRef<SVGSVGElement>(null);

  // Process schema nodes and edges if they are in string format
  const processedNodes = isSchema 
    ? (nodes as string[]).map(node => {
        const [id, type] = node.split(': ');
        return { id, label: id, type };
      })
    : nodes as Node[];

  const processedEdges = isSchema 
    ? (edges as string[]).map(edge => {
        const parsed = edge.match(/source: (.*), target: (.*), relationship: (.*)/);
        if (!parsed) return { source: '', target: '', relationship: '' };
        return {
          source: parsed[1],
          target: parsed[2],
          relationship: parsed[3]
        };
      })
    : edges as Edge[];

  // Filter out edges with null source or target
  const validEdges = processedEdges.filter(edge => edge.source !== null && edge.target !== null);

  useEffect(() => {
    if (!svgRef.current || !processedNodes.length) return;

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Create the graph simulation
    const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2));

    // Prepare the data
    const nodeData = processedNodes.map(node => ({...node}));
    const linkData = validEdges.map(edge => ({
      source: edge.source,
      target: edge.target,
      relationship: edge.relationship
    }));

    // Add links (edges)
    const link = svg.append("g")
      .selectAll("line")
      .data(linkData)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1);

    // Add link labels
    const linkLabels = svg.append("g")
      .selectAll("text")
      .data(linkData)
      .enter().append("text")
      .text(d => d.relationship)
      .attr("font-size", "8px")
      .attr("text-anchor", "middle")
      .attr("fill", "#777");

    // Color scale for node types
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Add nodes
    const node = svg.append("g")
      .selectAll("circle")
      .data(nodeData)
      .enter().append("circle")
      .attr("r", 5)
      .attr("fill", (d: any) => color(d.type || "default"))
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Add node labels
    const nodeLabels = svg.append("g")
      .selectAll("text")
      .data(nodeData)
      .enter().append("text")
      .text((d: any) => d.label)
      .attr("font-size", "10px")
      .attr("dx", 8)
      .attr("dy", 3);

    // Add tooltips for nodes
    node.append("title")
      .text((d: any) => `${d.label} (${d.type || "Unknown Type"})`);

    simulation.nodes(nodeData as any).on("tick", ticked);
    (simulation.force("link") as d3.ForceLink<any, any>).links(linkData);

    function ticked() {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      linkLabels
        .attr("x", (d: any) => (d.source.x + d.target.x) / 2)
        .attr("y", (d: any) => (d.source.y + d.target.y) / 2);

      node
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);

      nodeLabels
        .attr("x", (d: any) => d.x)
        .attr("y", (d: any) => d.y);
    }

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [processedNodes, validEdges, height, isSchema]);

  return (
    <div className="w-full h-full">
      <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
        <ChartNetwork className="h-4 w-4 text-purple-500" />
        {title}
      </h3>
      <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800">
        <svg ref={svgRef} className="w-full" style={{ minHeight: height }}></svg>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
