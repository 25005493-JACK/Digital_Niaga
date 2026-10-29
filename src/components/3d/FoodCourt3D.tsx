"use client";

import React, { Suspense, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { Compass, RotateCcw } from "lucide-react";
import { Stall } from "@/types";
import * as THREE from "three";
import { CameraController } from "./CameraController";
import { StallMesh } from "./StallMesh";

interface FoodCourt3DProps {
  stalls: Stall[];
  activeStall: Stall | null;
  onSelectStall: (stall: Stall) => void;
  onResetView: () => void;
  resetToken: number;
}

function FoodDistrictHall() { return <group><mesh rotation={[-Math.PI/2,0,0]} receiveShadow><planeGeometry args={[28,24]}/><meshStandardMaterial color="#eeeae1"/></mesh>{[[0,-12,28,.2],[-14,0,.2,24],[14,3,.2,18],[14,-10.5,.2,3]].map(([x,z,w,d],i)=><mesh key={i} position={[x,.4,z]}><boxGeometry args={[w,.8,d]}/><meshStandardMaterial color="#65747b"/></mesh>)}{[[-6,-4],[2,-9],[2,-1],[2,5],[2,10]].map(([x,z],i)=><mesh key={i} position={[x,1.5,z]}><boxGeometry args={[1.2,3,1.2]}/><meshStandardMaterial color="#303638"/></mesh>)}{[[-10,-6],[-10,-3],[-6,-6],[-6,-1],[-6,3],[-6,7],[-6,10],[-1,-5],[-1,-2],[-1,0],[4,-5],[4,-2],[8,-5],[8,-2],[8,1],[8,4],[8,7],[8,10]].map(([x,z],i)=><group key={i} position={[x,0,z]}><mesh position={[0,.8,0]}><cylinderGeometry args={[.8,.8,.12,24]}/><meshStandardMaterial color="#cfc9bf"/></mesh><mesh position={[0,.4,0]}><cylinderGeometry args={[.12,.25,.8,12]}/><meshStandardMaterial color="#697777"/></mesh></group>)}<group position={[-1,0,-9]}><mesh position={[0,.5,0]} castShadow><boxGeometry args={[3,1,3]}/><meshStandardMaterial color="#a5b4be"/></mesh><mesh position={[0,1.04,0]}><boxGeometry args={[3.1,.08,3.1]}/><meshStandardMaterial color="#586566"/></mesh><Html position={[0,1.5,0]} center><span className="block rounded bg-white/95 px-2 py-1 text-center text-[10px] whitespace-nowrap">Kim Seng<br/>Beverage Counter</span></Html></group><Html position={[14,0,-7.5]} center><span className="rounded bg-white/95 px-2 py-1 text-xs whitespace-nowrap">Entrance</span></Html><group position={[-2,0,-11]}><mesh position={[0,0.9,0]} castShadow receiveShadow><boxGeometry args={[2.2,1.8,1.6]}/><meshStandardMaterial color="#a5b4be" roughness={0.8}/></mesh><mesh position={[0,0.7,0.81]}><boxGeometry args={[0.65,1.4,0.04]}/><meshStandardMaterial color="#586566"/></mesh><Html position={[0,2.2,0]} center><span className="rounded bg-white/95 px-2 py-1 text-xs whitespace-nowrap">Toilet</span></Html></group><Html position={[-5,0,12]} center><span>Entrance</span></Html></group>; }
export const FoodCourt3D: React.FC<FoodCourt3DProps> = ({ stalls, activeStall, onSelectStall, onResetView, resetToken }) => {
  const controlsRef = useRef<any>(null);
  const animatingRef = useRef(false);
  return (
    <div className="relative h-[46dvh] min-h-[350px] w-full overflow-hidden rounded-2xl border border-line bg-[#e8e5dc] sm:h-[52dvh] lg:h-[500px] canvas-container">
      <div className="pointer-events-none absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
        <div className="glass-panel flex items-center gap-2 rounded-lg px-3 py-1.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-xs font-semibold text-ink sm:text-sm">Kim Seng · Seksyen 17</span>
          <span className="rounded bg-accent-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase text-accent">3D scene</span>
        </div>
      </div>
      <button onClick={onResetView} title="Reset view to overview" className="glass-panel absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-lg p-2 text-xs font-medium text-secondary hover:text-accent sm:right-4 sm:top-4">
        <RotateCcw className="h-3.5 w-3.5 text-accent" />
        <span className="hidden sm:inline">Overview</span>
      </button>
      <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-10 sm:left-auto sm:right-4">
        <div className="glass-panel flex items-center justify-between gap-3 rounded-lg px-3 py-1.5 text-[11px] text-muted sm:justify-start">
          <span className="flex items-center gap-1"><Compass className="h-3 w-3 text-accent" /> Drag to rotate · Scroll to zoom</span>
          {activeStall && <span className="max-w-[150px] truncate font-medium text-accent">Viewing {activeStall.stall_number}</span>}
        </div>
      </div>
      <Canvas shadows camera={{ position: [0, 20, 26], fov: 45 }} dpr={[1, 1.75]} className="h-full w-full cursor-grab active:cursor-grabbing">
        <Suspense fallback={null}>
          <CameraController activeStall={activeStall} controlsRef={controlsRef} animatingRef={animatingRef} resetToken={resetToken} />
          <ambientLight intensity={1.15} />
          <directionalLight position={[-7, 17, 10]} intensity={1.4} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
          <pointLight position={[6, 6, 0]} intensity={0.65} color="#ffe8bf" />
          <FoodDistrictHall />
          {stalls.map((stall) => (
            <StallMesh key={stall.id} stall={stall} isSelected={activeStall?.id === stall.id} onSelect={onSelectStall} />
          ))}
          <OrbitControls ref={controlsRef} onStart={() => { animatingRef.current = false; }} enablePan enableZoom minDistance={5} maxDistance={48} maxPolarAngle={Math.PI / 2.08} minPolarAngle={Math.PI / 8} dampingFactor={0.08} />
        </Suspense>
      </Canvas>
    </div>
  );
};
