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

function HallLabel({ text, position }: { text: string; position: [number, number, number] }) {
  return (
    <Html position={position} center transform distanceFactor={15}>
      <span className="pointer-events-none select-none whitespace-nowrap text-[11px] font-bold tracking-[0.16em] text-[#fff4dc] drop-shadow-md">
        {text}
      </span>
    </Html>
  );
}

function DiningTable({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.76, 0]} castShadow>
        <boxGeometry args={[3, 0.08, 0.82]} />
        <meshStandardMaterial color="#ad754d" roughness={0.7} />
      </mesh>
      {[-1, 1].map((end) => (
        <mesh key={end} position={[end * 1.25, 0.38, 0]}>
          <boxGeometry args={[0.07, 0.75, 0.07]} />
          <meshStandardMaterial color="#414443" metalness={0.5} />
        </mesh>
      ))}
      {[-1, 1].map((side) => (
        <group key={side} position={[0, 0, side * 0.8]}>
          <mesh position={[0, 0.52, 0]} castShadow>
            <boxGeometry args={[2.9, 0.08, 0.38]} />
            <meshStandardMaterial color="#cc9b70" roughness={0.7} />
          </mesh>
          {[-1, 1].map((end) => (
            <mesh key={end} position={[end * 1.2, 0.26, 0]}>
              <boxGeometry args={[0.06, 0.52, 0.06]} />
              <meshStandardMaterial color="#414443" />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Planter({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.34, 0]} castShadow>
        <cylinderGeometry args={[0.43, 0.34, 0.68, 10]} />
        <meshStandardMaterial color="#d3cbbb" />
      </mesh>
      <mesh position={[0, 1.03, 0]} castShadow>
        <icosahedronGeometry args={[0.65, 1]} />
        <meshStandardMaterial color="#54846b" roughness={1} />
      </mesh>
      <mesh position={[-0.3, 0.87, 0.12]}>
        <icosahedronGeometry args={[0.35, 1]} />
        <meshStandardMaterial color="#37684f" roughness={1} />
      </mesh>
    </group>
  );
}

// The outline follows the mall-map crop supplied by the user. Coordinates are
// scaled to the scene; the crop does not show individual counter boundaries.
const hallOutline: [number, number][] = [
  [-8.6, -11], [5.5, -11], [5.5, 0.5], [9.3, 2.3],
  [13, 2.3], [13, 10.3], [11.4, 10.7], [8.7, 10.7],
  [7.1, 10.1], [5.8, 10], [4.6, 10.4], [3.2, 10.5],
  [1.8, 10.2], [0.3, 9.5], [-1.5, 9.3], [-3.2, 10.2],
  [-4.9, 10.7], [-7.3, 10.7], [-10.2, 10.1], [-13, 10.1],
  [-13, 2.2], [-10.8, 2.2], [-8.6, -0.3],
];

function FoodDistrictHall() {
  const footprint = useMemo(
    () => new THREE.Shape(hallOutline.map(([x, z]) => new THREE.Vector2(x, -z))),
    []
  );

  return (
    <group>
      <mesh position={[0, -0.045, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[32, 37]} />
        <meshStandardMaterial color="#e4e4de" roughness={1} />
      </mesh>
      <mesh position={[0, -0.025, 14.6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[30, 7]} />
        <meshStandardMaterial color="#628b64" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <shapeGeometry args={[footprint]} />
        <meshStandardMaterial color="#e8e3d9" roughness={0.95} />
      </mesh>
      <Line
        points={[...hallOutline, hallOutline[0]].map(([x, z]) => [x, 0.035, z])}
        color="#a8a092"
        lineWidth={1.2}
      />
      <mesh position={[0, 0.012, -1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3.4, 19]} />
        <meshStandardMaterial color="#cec9bd" roughness={0.95} />
      </mesh>
      {Array.from({ length: 11 }, (_, i) => (
        <mesh key={i} position={[0, 0.018, -10 + i * 1.8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[13, 0.018]} />
          <meshBasicMaterial color="#d3ccbf" />
        </mesh>
      ))}

      {/* Mall-side entrance sits in the narrow northern section. */}
      <group position={[0, 0, -11.05]}>
        {[-3.1, 3.1].map((x) => (
          <mesh key={x} position={[x, 1.9, 0]}>
            <boxGeometry args={[0.22, 3.8, 0.3]} />
            <meshStandardMaterial color="#363a39" metalness={0.4} />
          </mesh>
        ))}
        <mesh position={[0, 3.76, 0]}>
          <boxGeometry args={[6.4, 0.27, 0.4]} />
          <meshStandardMaterial color="#363a39" />
        </mesh>
        <mesh position={[0, 3.34, 0]}>
          <boxGeometry args={[5.8, 0.62, 0.2]} />
          <meshStandardMaterial color="#242827" />
        </mesh>
        <HallLabel text="FOOD DISTRICT" position={[0, 3.35, 0.18]} />
      </group>

      {/* The map places the Forest against this broad southern edge. */}
      {[-7.2, -3.7, 0, 3.7, 7.2].map((x, i) => {
        const z = Math.abs(x) < 1 ? 9.2 : 10.15;
        const color = ["#c74e3e", "#cf823e", "#648564"][i % 3];
        return (
          <group key={x} position={[x, 0, z]}>
            <mesh position={[0, 1.8, 0]}>
              <boxGeometry args={[3.2, 3.6, 0.06]} />
              <meshStandardMaterial color="#c8ded4" transparent opacity={0.12} metalness={0.2} depthWrite={false} />
            </mesh>
            <mesh position={[-1.6, 1.8, 0]}>
              <boxGeometry args={[0.08, 3.6, 0.08]} />
              <meshStandardMaterial color="#424b48" />
            </mesh>
            <mesh position={[0, 2.72, 0.05]}>
              <boxGeometry args={[3, 1.05, 0.07]} />
              <meshStandardMaterial color={color} transparent opacity={0.82} />
            </mesh>
          </group>
        );
      })}
      {[-11, -7, -3, 2, 6, 11].map((x, i) => (
        <mesh key={x} position={[x, 0.35, 13.3 + (i % 2) * 1.5]}>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial color={i % 2 ? "#417447" : "#356d47"} roughness={1} />
        </mesh>
      ))}
      <Html position={[0, 0.4, 14]} center transform distanceFactor={18}>
        <span className="pointer-events-none select-none whitespace-nowrap rounded-full bg-[#e9f3e8]/90 px-3 py-1 text-[11px] font-semibold tracking-[0.12em] text-[#315b3b]">
          1 UTAMA RAINFOREST
        </span>
      </Html>

      {/* Industrial orange pipework and circular ceiling fixtures. */}
      {[-7, -2, 3, 8].map((z, i) => (
        <group key={z} position={[0, 3.9, z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[1.2, 0.09, 8, 32]} />
            <meshStandardMaterial color={i % 2 ? "#be593d" : "#424543"} metalness={0.4} />
          </mesh>
          <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.84, 0.025, 6, 32]} />
            <meshStandardMaterial color="#e3bc78" emissive="#ce9452" emissiveIntensity={0.5} />
          </mesh>
          {i === 1 && <HallLabel text="DINE IN" position={[0, -0.19, 0.1]} />}
        </group>
      ))}
      {[-7.7, 4.6].map((x) => (
        <mesh key={x} position={[x, 4, 0]}>
          <boxGeometry args={[0.09, 0.09, 18]} />
          <meshStandardMaterial color="#b8543b" metalness={0.3} />
        </mesh>
      ))}

      {[-5.3, -2.5, 0.5, 3.5, 6.4].map((z) => (
        <React.Fragment key={z}>
          <DiningTable x={-4.1} z={z} />
          <DiningTable x={4.1} z={z} />
        </React.Fragment>
      ))}
      <Planter x={-7.4} z={-1} />
      <Planter x={-7.4} z={4.3} />
      <Planter x={7.2} z={4.3} />
      <Planter x={7.2} z={8.1} />
    </group>
  );
}

export const FoodCourt3D: React.FC<FoodCourt3DProps> = ({ stalls, activeStall, onSelectStall, onResetView, resetToken }) => {
  const controlsRef = useRef<any>(null);
  const animatingRef = useRef(false);
  return (
    <div className="relative h-[46dvh] min-h-[350px] w-full overflow-hidden rounded-2xl border border-line bg-[#e8e5dc] sm:h-[52dvh] lg:h-[500px] canvas-container">
      <div className="pointer-events-none absolute left-3 top-3 z-10 sm:left-4 sm:top-4">
        <div className="glass-panel flex items-center gap-2 rounded-lg px-3 py-1.5 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-accent" />
          <span className="text-xs font-semibold text-ink sm:text-sm">Food District · 1 Utama</span>
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
