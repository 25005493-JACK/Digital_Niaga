"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { Stall } from "@/types";

interface StallMeshProps {
  stall: Stall;
  isSelected: boolean;
  onSelect: (stall: Stall) => void;
}

export const StallMesh: React.FC<StallMeshProps> = ({
  stall,
  isSelected,
  onSelect,
}) => {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { x, y, z, rotationY = 0, boothWidth = 2.2, boothDepth = 2, color = "#14b8a6" } = stall.coord_3d;

  // Gentle pulse animation when selected
  useFrame((state) => {
    if (meshRef.current && isSelected) {
      const t = state.clock.getElapsedTime();
      meshRef.current.position.y = y + Math.sin(t * 3) * 0.08;
    } else if (meshRef.current) {
      meshRef.current.position.y = y;
    }
  });

  return (
    <group
      ref={meshRef}
      position={[x, y, z]}
      rotation={[0, rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(stall);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* 1. Base Counter / Lower Booth */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[boothWidth, 0.9, boothDepth]} />
        <meshStandardMaterial
          color={hovered || isSelected ? "#1e293b" : "#0f172a"}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>

      {/* Countertop */}
      <mesh position={[0, 0.92, 0.1]}>
        <boxGeometry args={[boothWidth + 0.1, 0.06, boothDepth * 0.7]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.2} />
      </mesh>

      {/* 2. Rear Kitchen Wall & Menu Backboard */}
      <mesh position={[0, 1.4, -boothDepth * 0.45]}>
        <boxGeometry args={[boothWidth - 0.1, 1.8, 0.1]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* 3. Roof / Awning Support Poles */}
      <mesh position={[-boothWidth * 0.45, 1.4, boothDepth * 0.4]}>
        <cylinderGeometry args={[0.04, 0.04, 1.8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>
      <mesh position={[boothWidth * 0.45, 1.4, boothDepth * 0.4]}>
        <cylinderGeometry args={[0.04, 0.04, 1.8]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} />
      </mesh>

      {/* 4. Awning Canopy Roof */}
      <group position={[0, 2.2, 0.1]}>
        {/* Main canopy angled slab */}
        <mesh rotation={[0.2, 0, 0]}>
          <boxGeometry args={[boothWidth + 0.2, 0.1, boothDepth + 0.2]} />
          <meshStandardMaterial
            color={color}
            emissive={isSelected ? color : "#000000"}
            emissiveIntensity={isSelected ? 0.35 : 0}
            roughness={0.3}
          />
        </mesh>
      </group>

      {/* 5. Stall Signboard */}
      <mesh position={[0, 2.45, boothDepth * 0.35]}>
        <boxGeometry args={[boothWidth * 0.85, 0.38, 0.08]} />
        <meshStandardMaterial
          color={isSelected ? "#0284c7" : "#0f172a"}
          emissive={isSelected ? "#0284c7" : "#1e293b"}
          emissiveIntensity={0.4}
        />
      </mesh>

      {/* 6. Active Beacon / Glowing Pin Indicator */}
      {isSelected && (
        <group position={[0, 3.1, 0]}>
          {/* Vertical beacon line */}
          <mesh position={[0, 0.6, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 1.2]} />
            <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
          </mesh>
          {/* Glowing diamond/sphere at top */}
          <mesh position={[0, 1.2, 0]}>
            <octahedronGeometry args={[0.25]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
        </group>
      )}

      {/* 7. Floating 3D HTML Badge */}
      <Html
        position={[0, 2.9, 0]}
        center
        distanceFactor={18}
        className="pointer-events-auto select-none"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(stall);
          }}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-lg whitespace-nowrap ${
            isSelected
              ? "bg-teal-500 text-slate-950 ring-2 ring-white scale-110 shadow-teal-500/50"
              : hovered
              ? "bg-slate-800 text-teal-300 ring-1 ring-teal-400 scale-105"
              : "bg-slate-900/90 text-slate-200 border border-slate-700/80 backdrop-blur-md"
          }`}
        >
          <span
            className="w-2 h-2 rounded-full inline-block animate-pulse"
            style={{ backgroundColor: color }}
          />
          <span className="font-extrabold">{stall.stall_number}:</span>
          <span className="max-w-[120px] truncate">{stall.name}</span>
        </button>
      </Html>
    </group>
  );
};
