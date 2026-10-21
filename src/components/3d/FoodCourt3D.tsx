"use client";

import React, { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Float } from "@react-three/drei";
import { Stall } from "@/types";
import { StallMesh } from "./StallMesh";
import { CameraController } from "./CameraController";
import { Compass, RotateCcw, ZoomIn } from "lucide-react";

interface FoodCourt3DProps {
  stalls: Stall[];
  activeStall: Stall | null;
  onSelectStall: (stall: Stall) => void;
  onResetView: () => void;
}

// Low-poly dining table + 4 stools
function DiningCluster({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Tabletop */}
      <mesh position={[0, 0.72, 0]} receiveShadow>
        <cylinderGeometry args={[0.9, 0.9, 0.06, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.5} />
      </mesh>
      {/* Table Pole & Base */}
      <mesh position={[0, 0.35, 0]}>
        <cylinderGeometry args={[0.06, 0.06, 0.7]} />
        <meshStandardMaterial color="#64748b" metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.04]} />
        <meshStandardMaterial color="#475569" />
      </mesh>

      {/* 4 Stools */}
      {[-0.8, 0.8].map((dx, i) =>
        [-0.8, 0.8].map((dz, j) => (
          <group key={`${i}-${j}`} position={[dx * 0.7, 0, dz * 0.7]}>
            <mesh position={[0, 0.42, 0]}>
              <cylinderGeometry args={[0.22, 0.22, 0.05, 12]} />
              <meshStandardMaterial color="#0f766e" />
            </mesh>
            <mesh position={[0, 0.2, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.4]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
          </group>
        ))
      )}
    </group>
  );
}

// Decorative Indoor Planter (Signature 1 Utama greenery)
function IndoorPlanter({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Planter pot */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.45, 0.35, 0.8, 12]} />
        <meshStandardMaterial color="#1e293b" roughness={0.7} />
      </mesh>
      {/* Foliage */}
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.55, 8, 8]} />
        <meshStandardMaterial color="#15803d" roughness={0.9} />
      </mesh>
    </group>
  );
}

export const FoodCourt3D: React.FC<FoodCourt3DProps> = ({
  stalls,
  activeStall,
  onSelectStall,
  onResetView,
}) => {
  const controlsRef = useRef<any>(null);

  return (
    <div className="relative w-full h-[52dvh] sm:h-[58dvh] lg:h-[620px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950/80 shadow-2xl canvas-container">
      {/* On-screen 3D Overlay Header */}
      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="glass-panel px-3 py-1.5 rounded-xl flex items-center gap-2 pointer-events-auto shadow-lg">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
          </span>
          <span className="text-xs sm:text-sm font-bold text-slate-200">
            1 Utama Food District
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 font-semibold border border-teal-500/30">
            3D Interactive Map
          </span>
        </div>
      </div>

      {/* Camera Quick Controls */}
      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-2">
        <button
          onClick={onResetView}
          title="Reset View to Overview"
          className="glass-panel p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-all active:scale-95 text-xs flex items-center gap-1.5 font-medium shadow-lg"
        >
          <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden sm:inline">Overview</span>
        </button>
      </div>

      {/* Floating User Hint Bar */}
      <div className="absolute bottom-3 left-3 right-3 sm:left-auto sm:right-4 z-10 pointer-events-none">
        <div className="glass-panel px-3 py-1.5 rounded-xl text-[11px] text-slate-400 flex items-center justify-between sm:justify-start gap-3 pointer-events-auto">
          <span className="flex items-center gap-1">
            <Compass className="w-3 h-3 text-teal-400" />
            Drag to rotate • Pinch / Scroll to zoom
          </span>
          {activeStall && (
            <span className="text-teal-300 font-medium truncate max-w-[150px]">
              Viewing {activeStall.stall_number}
            </span>
          )}
        </div>
      </div>

      {/* Three.js Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 13, 16], fov: 46 }}
        dpr={[1, 2]} // Optimize pixel ratio across mobile and retina PC
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <CameraController activeStall={activeStall} controlsRef={controlsRef} />

          {/* Lighting Rig */}
          <ambientLight intensity={0.8} />
          <directionalLight
            position={[10, 20, 15]}
            intensity={1.2}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight position={[-8, 6, -6]} intensity={0.4} color="#38bdf8" />
          <pointLight position={[8, 6, 6]} intensity={0.4} color="#f59e0b" />

          {/* Floor & Walkway Grid */}
          <mesh
            rotation={[-Math.PI / 2, 0, 0]}
            position={[0, -0.01, 0]}
            receiveShadow
            onClick={() => onResetView()}
          >
            <planeGeometry args={[26, 22]} />
            <meshStandardMaterial color="#090e1a" roughness={0.8} />
          </mesh>

          {/* Stylized Modern Floor Grid Lines */}
          <Grid
            position={[0, 0, 0]}
            args={[26, 22]}
            cellSize={1}
            cellThickness={0.6}
            cellColor="#1e293b"
            sectionSize={3}
            sectionThickness={1.2}
            sectionColor="#334155"
            fadeDistance={25}
          />

          {/* Entrance Arch Marker */}
          <group position={[0, 0, 9.5]}>
            <mesh position={[0, 1.8, 0]}>
              <boxGeometry args={[5, 0.4, 0.2]} />
              <meshStandardMaterial
                color="#0f766e"
                emissive="#0f766e"
                emissiveIntensity={0.3}
              />
            </mesh>
            <mesh position={[-2.3, 0.9, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 1.8]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
            <mesh position={[2.3, 0.9, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 1.8]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
          </group>

          {/* Central Dining Seating Clusters */}
          <DiningCluster position={[-3, 0, -0.5]} />
          <DiningCluster position={[3, 0, -0.5]} />
          <DiningCluster position={[-3, 0, 2.2]} />
          <DiningCluster position={[3, 0, 2.2]} />

          {/* Indoor Planters */}
          <IndoorPlanter position={[0, 0, 0.8]} />
          <IndoorPlanter position={[-8.5, 0, 0]} />
          <IndoorPlanter position={[8.5, 0, 0]} />

          {/* Render Stalls */}
          {stalls.map((stall) => (
            <StallMesh
              key={stall.id}
              stall={stall}
              isSelected={activeStall?.id === stall.id}
              onSelect={onSelectStall}
            />
          ))}

          {/* Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enablePan={true}
            enableZoom={true}
            minDistance={4}
            maxDistance={24}
            maxPolarAngle={Math.PI / 2.15} // Restrict camera from going under floor
            minPolarAngle={Math.PI / 8}
            dampingFactor={0.08}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
