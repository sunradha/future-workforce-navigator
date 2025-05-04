
import { useEffect, RefObject } from 'react';
import * as d3 from 'd3';
import { Node, Edge } from '../types/knowledgeGraphTypes';

interface UseD3GraphProps {
  svgRef: RefObject<SVGSVGElement>;
  nodes: Node[];
  edges: Edge[];
  height: number;
}

export const useD3Graph = ({ svgRef, nodes, edges, height }: UseD3GraphProps) => {
  useEffect(() => {
    if (!svgRef.current || !nodes.length) return;
    
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

    // Add links (edges)
    const link = g.append("g")
      .selectAll("line")
      .data(edges)
      .enter().append("line")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 1.5);

    // Add link labels
    const linkLabels = g.append("g")
      .selectAll("text")
      .data(edges)
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
      .data(nodes)
      .enter()
      .append("g");

    const node = nodeGroup.append("circle")
      .attr("r", 10)
      .attr("fill", (d: any) => color(d.type || "default"))
      .call(d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended) as any);

    // Add node labels
    const nodeLabels = nodeGroup.append("text")
      .text((d: any) => d.label)
      .attr("font-size", "12px")
      .attr("dx", 15)
      .attr("dy", 4)
      .attr("fill", "#333");

    // Add tooltips for nodes
    node.append("title")
      .text((d: any) => `${d.label} (${d.type || "Unknown Type"})`);

    simulation.nodes(nodes as any).on("tick", ticked);
    (simulation.force("link") as d3.ForceLink<any, any>).links(edges);

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
  }, [svgRef, nodes, edges, height]);
};
