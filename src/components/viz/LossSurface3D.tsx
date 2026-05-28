"use client";

import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Line } from "@react-three/drei";
import * as THREE from "three";
import { cn } from "@/lib/utils";
import { useOptimizerStore } from "@/lib/store/optimizer";
import { getSurface } from "@/lib/math/surfaces";

function Surface() {
  const surfaceType = useOptimizerStore((state) => state.surfaceType);
  const surfaceDef = getSurface(surfaceType);
  
  const geometry = useMemo(() => {
    const size = surfaceDef.scaleX;
    const segments = 40;
    const geom = new THREE.PlaneGeometry(size, size, segments, segments);
    const pos = geom.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const { loss } = surfaceDef.compute(x, y);
      pos.setZ(i, loss * surfaceDef.scaleZ);
    }
    geom.computeVertexNormals();
    return geom;
  }, [surfaceDef]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      {/* Solid fill for the surface */}
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial 
          color="#334155" // Slate-700 for a lighter base
          side={THREE.DoubleSide} 
          polygonOffset 
          polygonOffsetFactor={1} 
        />
      </mesh>
      {/* Wireframe overlay */}
      <mesh geometry={geometry}>
        <meshStandardMaterial 
          color="#818cf8" // Brighter indigo
          wireframe={true} 
          transparent 
          opacity={0.6} 
          side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  );
}

function Trajectory() {
  const history = useOptimizerStore((state) => state.history);
  const currentIndex = useOptimizerStore((state) => state.currentStepIndex);
  const surfaceType = useOptimizerStore((state) => state.surfaceType);
  const surfaceDef = getSurface(surfaceType);

  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= currentIndex; i++) {
      const p = history[i];
      if (!p) continue;
      pts.push(new THREE.Vector3(p.x, -2 + p.loss * surfaceDef.scaleZ + 0.1, p.y));
    }
    return pts;
  }, [history, currentIndex, surfaceDef]);

  if (points.length < 2) return null;

  return (
    <Line
      points={points}
      color="#fcd34d" // Bright amber-200 for trajectory
      lineWidth={4}
      transparent
      opacity={0.9}
    />
  );
}

function OptimizerBall() {
  const history = useOptimizerStore((state) => state.history);
  const currentIndex = useOptimizerStore((state) => state.currentStepIndex);
  const surfaceType = useOptimizerStore((state) => state.surfaceType);
  const surfaceDef = getSurface(surfaceType);
  
  const current = history[currentIndex] || history[0];
  if (!current) return null;

  const yPos = -2 + current.loss * surfaceDef.scaleZ + 0.2;

  return (
    <group position={[current.x, yPos, current.y]}>
      <mesh castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#f59e0b" emissive="#b45309" emissiveIntensity={0.8} />
      </mesh>
      
      {/* Gradient Vector (pointing downhill = -gradient) */}
      <arrowHelper 
        args={[
          new THREE.Vector3(-current.gx, 0, -current.gy).normalize(),
          new THREE.Vector3(0, 0, 0),
          1.5,
          0x06b6d4, // Cyan arrow for contrast
          0.4,
          0.3
        ]} 
      />
    </group>
  );
}

export default function LossSurface3D({ className }: { className?: string }) {
  // We export as default for next/dynamic lazy loading
  const current = useOptimizerStore((state) => state.history[state.currentStepIndex]);

  return (
    <div className={cn("w-full aspect-video bg-rose-50 rounded-xl border border-rose-200 overflow-hidden relative", className)}>
      
      {/* Textual accessibility fallback */}
      <div className="sr-only" aria-live="polite">
        {current ? `Current optimization step: ${current.step}. Loss is ${current.loss.toFixed(4)}. Coordinates: X=${current.x.toFixed(2)}, Y=${current.y.toFixed(2)}.` : "3D visualization of loss surface."}
      </div>

      <Canvas shadows camera={{ position: [6, 4, 6], fov: 45 }} gl={{ antialias: true }}>
        <color attach="background" args={['#0f1115']} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-bias={-0.0001} />
        <pointLight position={[-10, 10, -10]} intensity={0.5} color="#6366f1" />
        
        <Surface />
        <Trajectory />
        <OptimizerBall />
        
        <Grid position={[0, -2.1, 0]} args={[20, 20]} cellColor="#4b5563" sectionColor="#374151" fadeDistance={20} />
        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2 - 0.1} minDistance={5} maxDistance={30} />
      </Canvas>
    </div>
  );
}
