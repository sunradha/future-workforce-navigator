
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Network } from 'lucide-react';

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

const KnowledgeGraph = ({ title, nodes, edges, height = 450, isSchema = false }: KnowledgeGraphProps) => {
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
        // Fix the schema edge parsing to correctly identify source and target
        const parsed = edge.match(/source: (.*), target: (.*), relationship: (.*)/);
        if (!parsed) return { source: '', target: '', relationship: '' };
        return {
          source: parsed[1],
          target: parsed[2],
          relationship: parsed[3]
        };
      })
    : edges as Edge[];

  // Filter out edges with null or invalid source or target
  const validEdges = processedEdges.filter(edge => 
    edge.source && edge.target && 
    // We don't check if nodes exist for the edges because we'll create them when missing
    edge.source !== null && edge.target !== null
  );

  useEffect(() => {
    if (!svgRef.current || !processedNodes.length) return;
    
    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove();

    const containerWidth = svgRef.current.parentElement?.clientWidth || 800;
    const svg = d3.select(svgRef.current)
      .attr("width", containerWidth)
      .attr("height", height)
      .attr("viewBox", [0, 0, containerWidth, height]);

    // Add zoom capability
    const zoom = d3.zoom()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);
    
    // Create a container for the graph
    const g = svg.append("g");

    // Create the graph simulation
    const simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(containerWidth / 2, height / 2));

    // Create a complete set of nodes including all sources and targets from edges
    const nodesMap = new Map();
    
    // Add all existing nodes
    processedNodes.forEach(node => {
      nodesMap.set(node.id, {...node});
    });
    
    // Add missing nodes from edges
    validEdges.forEach(edge => {
      if (!nodesMap.has(edge.source)) {
        nodesMap.set(edge.source, {
          id: edge.source,
          label: edge.source,
          type: "Training Program" // Assuming missing nodes are training programs
        });
      }
      
      // Ensure target exists too (shouldn't be necessary based on the data)
      if (!nodesMap.has(edge.target)) {
        nodesMap.set(edge.target, {
          id: edge.target,
          label: `Unknown (${edge.target})`,
          type: "Unknown"
        });
      }
    });
    
    // Convert nodes map to array
    const nodeData = Array.from(nodesMap.values());
    
    // For the linkData, ensure we're using node objects for source and target
    const linkData = validEdges.map(edge => ({
      source: edge.source,
      target: edge.target,
      relationship: edge.relationship
    }));

    // Add links (edges)
    const link = g.append("g")
      .selectAll("line")
      .data(linkData)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5);

    // Add link labels
    const linkLabels = g.append("g")
      .selectAll("text")
      .data(linkData)
      .enter().append("text")
      .text(d => d.relationship)
      .attr("font-size", "10px")
      .attr("text-anchor", "middle")
      .attr("fill", "#777")
      .attr("dy", "-5");

    // Color scale for node types
    const color = d3.scaleOrdinal(d3.schemeSet2);

    // Add nodes
    const nodeGroup = g.append("g")
      .selectAll("g")
      .data(nodeData)
      .enter()
      .append("g");

    const node = nodeGroup.append("circle")
      .attr("r", 10)  // Increased node size
      .attr("fill", (d: any) => color(d.type || "default"))
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Add node labels
    const nodeLabels = nodeGroup.append("text")
      .text((d: any) => d.label)
      .attr("font-size", "12px")  // Increased font size
      .attr("dx", 15)  // Position label to the right of the node
      .attr("dy", 4)
      .attr("fill", "#333");

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

      nodeGroup
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
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

    // Add a resize event listener
    const handleResize = () => {
      if (!svgRef.current) return;
      
      const newWidth = svgRef.current.parentElement?.clientWidth || 800;
      svg.attr("width", newWidth);
      svg.attr("viewBox", [0, 0, newWidth, height]);
      simulation.force("center", d3.forceCenter(newWidth / 2, height / 2));
      simulation.alpha(0.3).restart();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      simulation.stop();
      window.removeEventListener("resize", handleResize);
    };
  }, [processedNodes, validEdges, height, isSchema]);

  return (
    <div className="w-full h-full p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
      <h3 className="text-base font-medium mb-3 flex items-center gap-2 text-purple-600">
        <Network className="h-5 w-5" />
        {title}
      </h3>
      <div className="w-full overflow-hidden rounded-md bg-white" style={{ height: `${height}px` }}>
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
};

export default KnowledgeGraph;
