"use client";

import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { cn } from "@/lib/utils";
import { useOptimizerStore } from "@/lib/store/optimizer";

interface TrainingChartProps {
  width?: number;
  height?: number;
  className?: string;
}

export function TrainingChart({ width = 600, height = 300, className }: TrainingChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  
  const history = useOptimizerStore(state => state.history);
  const currentIndex = useOptimizerStore(state => state.currentStepIndex);
  
  // Only plot up to the scrubbed index
  const data = history.slice(0, currentIndex + 1);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Dynamic domains based on data, but keep a minimum range
    const maxStep = Math.max(10, data[data.length - 1]?.step || 10);
    const maxLoss = Math.max(1.0, d3.max(data, (d) => Math.min(100, d.loss)) || 1.0); // cap display at 100 for divergence

    const xScale = d3
      .scaleLinear()
      .domain([0, maxStep])
      .range([0, innerWidth]);

    const yScale = d3
      .scaleLinear()
      .domain([0, maxLoss])
      .range([innerHeight, 0]);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3.axisBottom(xScale)
          .tickSize(-innerHeight)
          .tickFormat(() => "")
      )
      .attr("color", "#1f2937")
      .attr("stroke-opacity", 0.5);

    g.append("g")
      .attr("class", "grid")
      .call(
        d3.axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      )
      .attr("color", "#1f2937")
      .attr("stroke-opacity", 0.5);

    // Axes
    const xAxis = d3.axisBottom(xScale).ticks(5);
    const yAxis = d3.axisLeft(yScale).ticks(5);

    g.append("g")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(xAxis)
      .attr("color", "#9ca3af")
      .attr("font-family", "var(--font-jetbrains-mono)");

    g.append("g")
      .call(yAxis)
      .attr("color", "#9ca3af")
      .attr("font-family", "var(--font-jetbrains-mono)");

    // Labels
    g.append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 35)
      .attr("fill", "#9ca3af")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .text("Steps");

    g.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -45)
      .attr("fill", "#9ca3af")
      .attr("font-size", "12px")
      .attr("text-anchor", "middle")
      .text("Loss");

    // Line
    const line = d3
      .line<{ step: number, loss: number }>()
      .x((d) => xScale(d.step))
      .y((d) => yScale(Math.min(100, d.loss))) // Cap y to avoid blowing up the chart visually
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#f59e0b")
      .attr("stroke-width", 2)
      .attr("d", line);

  }, [data, width, height]);

  return (
    <div className={cn("w-full flex justify-center bg-rose-50 rounded-xl border border-rose-200 p-4", className)}>
      <svg ref={svgRef} width={width} height={height} className="max-w-full h-auto" aria-label="Loss training curve" />
    </div>
  );
}
