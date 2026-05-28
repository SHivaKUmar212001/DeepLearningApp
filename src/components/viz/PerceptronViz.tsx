"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

interface Point {
  x: number;
  y: number;
  label: number;
}

interface PerceptronVizProps {
  w1: number;
  w2: number;
  b: number;
  points: Point[];
  className?: string;
}

export function PerceptronViz({ w1, w2, b, points, className }: PerceptronVizProps) {
  const width = 400;
  const height = 400;
  const range = 5; // -5 to 5
  
  const scale = width / (range * 2);
  const cx = width / 2;
  const cy = height / 2;
  
  const toSvgX = (x: number) => cx + x * scale;
  const toSvgY = (y: number) => cy - y * scale;

  // The decision boundary is w1*x + w2*y + b = 0
  // Solving for y: y = (-w1/w2)*x - (b/w2)
  // We need to draw a line across the bounding box x in [-5, 5]
  let linePoints = null;
  if (Math.abs(w2) > 0.001) {
    const y1 = (-w1 * -range - b) / w2;
    const y2 = (-w1 * range - b) / w2;
    linePoints = { x1: toSvgX(-range), y1: toSvgY(y1), x2: toSvgX(range), y2: toSvgY(y2) };
  } else if (Math.abs(w1) > 0.001) {
    // Vertical line x = -b/w1
    const x = -b / w1;
    linePoints = { x1: toSvgX(x), y1: toSvgY(-range), x2: toSvgX(x), y2: toSvgY(range) };
  }

  // Generate grid lines
  const gridLines = useMemo(() => {
    const lines = [];
    for (let i = -range; i <= range; i++) {
      lines.push(i);
    }
    return lines;
  }, [range]);

  // Compute shading polygon for the positive region (w1*x + w2*y + b > 0)
  // A simple way to shade the half-plane in SVG is a very large polygon or clip path.
  // Instead, let's just calculate the corners of the box that satisfy the equation.
  const corners = [
    { x: -range, y: -range },
    { x: range, y: -range },
    { x: range, y: range },
    { x: -range, y: range }
  ];

  const positiveCorners = corners.filter(c => w1 * c.x + w2 * c.y + b > 0);
  const negativeCorners = corners.filter(c => w1 * c.x + w2 * c.y + b <= 0);

  // Calculate intersection points on the border
  const getIntersections = () => {
    const pts = [];
    if (Math.abs(w2) > 0.001) {
      const yLeft = (-w1 * -range - b) / w2;
      if (yLeft >= -range && yLeft <= range) pts.push({ x: -range, y: yLeft });
      const yRight = (-w1 * range - b) / w2;
      if (yRight >= -range && yRight <= range) pts.push({ x: range, y: yRight });
    }
    if (Math.abs(w1) > 0.001) {
      const xBottom = (-w2 * -range - b) / w1;
      if (xBottom > -range && xBottom < range) pts.push({ x: xBottom, y: -range });
      const xTop = (-w2 * range - b) / w1;
      if (xTop > -range && xTop < range) pts.push({ x: xTop, y: range });
    }
    return pts;
  };

  const intersections = getIntersections();

  // Construct polygons for the background shading
  // We need to order the vertices correctly. Since we only have max 6 vertices (corners + intersections),
  // we can sort them radially.
  const buildPolygon = (regionCorners: {x:number, y:number}[], inters: {x:number, y:number}[]) => {
    if (inters.length < 2) {
      // If no line crosses the box, the whole box is either positive or negative
      if (w1*0 + w2*0 + b > 0) return regionCorners.length === 4 ? corners : [];
      return regionCorners.length === 0 ? corners : [];
    }
    
    const pts = [...regionCorners, ...inters];
    // Find centroid
    const center = { x: 0, y: 0 };
    pts.forEach(p => { center.x += p.x; center.y += p.y; });
    center.x /= pts.length;
    center.y /= pts.length;
    
    // Sort radially
    pts.sort((a, b) => {
      return Math.atan2(a.y - center.y, a.x - center.x) - Math.atan2(b.y - center.y, b.x - center.x);
    });
    
    return pts;
  };

  const posPolygon = buildPolygon(positiveCorners, intersections);
  const negPolygon = buildPolygon(negativeCorners, intersections);

  const pointsToString = (pts: {x:number, y:number}[]) => pts.map(p => `${toSvgX(p.x)},${toSvgY(p.y)}`).join(" ");

  // Metrics calculation
  let correctCount = 0;
  points.forEach(p => {
    const pred = w1 * p.x + w2 * p.y + b > 0 ? 1 : 0;
    if (pred === p.label) correctCount++;
  });
  const accuracy = (correctCount / points.length) * 100;

  return (
    <div className={cn("w-full aspect-square bg-rose-50 rounded-xl border border-rose-200 overflow-hidden relative font-mono", className)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
        
        {/* Background Regions */}
        {posPolygon.length > 0 && (
          <polygon points={pointsToString(posPolygon)} fill="#06b6d4" fillOpacity={0.15} className="transition-all duration-300" />
        )}
        {negPolygon.length > 0 && (
          <polygon points={pointsToString(negPolygon)} fill="#f59e0b" fillOpacity={0.15} className="transition-all duration-300" />
        )}

        {/* Grid */}
        <g className="grid-lines">
          {gridLines.map((val) => (
            <React.Fragment key={val}>
              <line x1={toSvgX(val)} y1={0} x2={toSvgX(val)} y2={height} stroke={val === 0 ? "#4b5563" : "#1f2937"} strokeWidth={val === 0 ? 2 : 1} />
              <line x1={0} y1={toSvgY(val)} x2={width} y2={toSvgY(val)} stroke={val === 0 ? "#4b5563" : "#1f2937"} strokeWidth={val === 0 ? 2 : 1} />
            </React.Fragment>
          ))}
        </g>

        {/* Decision Boundary */}
        {linePoints && (
          <line 
            x1={linePoints.x1} y1={linePoints.y1} 
            x2={linePoints.x2} y2={linePoints.y2} 
            stroke="#ffffff" strokeWidth={3} 
            strokeDasharray="8,4"
            className="transition-all duration-300 shadow-sm"
          />
        )}
        
        {/* Normal Vector (w1, w2) - pointing to the positive side */}
        <g className="transition-all duration-300">
          <line 
            x1={cx} y1={cy} 
            x2={toSvgX(w1)} y2={toSvgY(w2)} 
            stroke="#06b6d4" strokeWidth={3} 
            markerEnd="url(#arrow-w)"
          />
          <defs>
            <marker id="arrow-w" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
            </marker>
          </defs>
        </g>

        {/* Scatter Points */}
        {points.map((p, i) => {
          const isCorrect = (w1 * p.x + w2 * p.y + b > 0 ? 1 : 0) === p.label;
          return (
            <circle
              key={i}
              cx={toSvgX(p.x)}
              cy={toSvgY(p.y)}
              r={6}
              fill={p.label === 1 ? "#06b6d4" : "#f59e0b"} // 1 = Cyan, 0 = Amber
              stroke={isCorrect ? "#ffffff" : "#ef4444"} // Red stroke if misclassified
              strokeWidth={isCorrect ? 1 : 3}
            />
          );
        })}
      </svg>
      
      {/* Accuracy Readout */}
      <div className="absolute top-4 right-4 bg-rose-100/90 p-2 px-4 rounded border border-rose-300 font-mono shadow-xl backdrop-blur-md">
        <div className="text-xs text-rose-700 uppercase tracking-wider mb-1">Accuracy</div>
        <div className={`text-2xl font-bold ${accuracy === 100 ? "text-emerald-600" : "text-rose-950"}`}>
          {accuracy.toFixed(0)}%
        </div>
      </div>

      <div className="absolute top-4 left-4 bg-rose-100/90 p-3 rounded border border-rose-300 font-mono shadow-xl backdrop-blur-md text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-500 inline-block" />
          <span className="text-rose-800">Class 1 (y &gt; 0)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-500 inline-block" />
          <span className="text-rose-800">Class 0 (y &le; 0)</span>
        </div>
      </div>
    </div>
  );
}
