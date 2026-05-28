"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface NeuralNetProps {
  layers?: number[];
  activations?: number[][]; // [layerIdx][nodeIdx]
  dropoutMask?: boolean[][]; // [layerIdx][nodeIdx] true if dropped out
  mode?: "static" | "forward" | "backward";
  className?: string;
}

export function NeuralNet({ 
  layers = [3, 4, 4, 2], 
  activations = [], 
  dropoutMask = [],
  mode = "static",
  className 
}: NeuralNetProps) {
  const width = 600;
  const height = 400;
  const padding = 40;
  
  const prefersReducedMotion = useReducedMotion();
  const effectiveMode = prefersReducedMotion ? "static" : mode;

  const numLayers = layers.length;
  const layerSpacing = (width - padding * 2) / (numLayers - 1 || 1);

  // Compute node positions
  const nodes = layers.flatMap((nodeCount, layerIdx) => {
    const x = padding + layerIdx * layerSpacing;
    const nodeSpacing = (height - padding * 2) / Math.max(1, nodeCount);
    const startY = (height - (nodeCount - 1) * nodeSpacing) / 2;
    
    return Array.from({ length: nodeCount }).map((_, nodeIdx) => {
      const activation = activations[layerIdx]?.[nodeIdx] ?? 0;
      const isDropped = dropoutMask[layerIdx]?.[nodeIdx] ?? false;
      return {
        id: `L${layerIdx}-N${nodeIdx}`,
        x,
        y: startY + nodeIdx * nodeSpacing,
        layerIdx,
        activation,
        isDropped,
      };
    });
  });

  // Compute edges between consecutive layers
  const edges = [];
  for (let l = 0; l < numLayers - 1; l++) {
    const currentLayerNodes = nodes.filter((n) => n.layerIdx === l);
    const nextLayerNodes = nodes.filter((n) => n.layerIdx === l + 1);
    
    for (const source of currentLayerNodes) {
      for (const target of nextLayerNodes) {
        edges.push({ id: `${source.id}-${target.id}`, source, target, layerIdx: l });
      }
    }
  }

  // Animation variants
  const edgeVariants = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static: (custom: any) => ({ pathLength: 1, opacity: custom.isDropped ? 0.06 : 0.28, stroke: "#4c0519" }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    forward: (custom: any) => {
      if (custom.isDropped) return { pathLength: 1, opacity: 0.06, stroke: "#4c0519" };
      return {
        pathLength: [0, 1],
        opacity: [0.2, 0.8, 0.2],
        stroke: "#06b6d4", // Cyan
        transition: { duration: 0.8, delay: custom.layerIdx * 0.8, repeat: Infinity, repeatType: "loop" as const }
      };
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    backward: (custom: any) => {
      if (custom.isDropped) return { pathLength: 1, opacity: 0.06, stroke: "#4c0519" };
      return {
        pathLength: [1, 0],
        opacity: [0.2, 0.8, 0.2],
        stroke: "#f59e0b", // Amber
        transition: { duration: 0.8, delay: (numLayers - custom.layerIdx - 2) * 0.8, repeat: Infinity, repeatType: "loop" as const }
      };
    }
  };

  return (
    <div className={cn("relative aspect-video w-full overflow-hidden rounded-lg border border-rose-200 bg-rose-50/80", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full" aria-label="Neural Network Diagram">
        {/* Edges */}
        {edges.map((edge) => {
          const isDropped = edge.source.isDropped || edge.target.isDropped;
          return (
            <motion.line
              key={edge.id}
              x1={edge.source.x}
              y1={edge.source.y}
              x2={edge.target.x}
              y2={edge.target.y}
              strokeWidth={1.5}
              custom={{ layerIdx: edge.layerIdx, isDropped }}
              variants={edgeVariants}
              initial="static"
              animate={effectiveMode}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map((node) => {
          // Determine color based on activation if provided, else use layer-based defaults
          const hasActivation = activations.length > 0;
          let nodeColor = hasActivation 
            ? `rgba(99, 102, 241, ${0.2 + Math.abs(node.activation) * 0.8})` // Indigo opacity scales with activation
            : node.layerIdx === 0 ? "#06b6d4" : node.layerIdx === numLayers - 1 ? "#f59e0b" : "#6366f1";
            
          if (node.isDropped) {
            nodeColor = "#374151"; // Gray-700
          }
            
          return (
            <motion.g key={node.id} transform={`translate(${node.x},${node.y})`}>
              <motion.circle
                r={8}
                fill={nodeColor}
                stroke="#fff"
                strokeWidth={hasActivation ? 2.5 + Math.abs(node.activation) * 1.5 : 2.5}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              />
              {/* Optional activation value text on hover, simplified for now */}
              <title>{`Layer ${node.layerIdx}, Node ${node.id}: ${node.activation.toFixed(2)}`}</title>
            </motion.g>
          );
        })}
      </svg>
    </div>
  );
}
