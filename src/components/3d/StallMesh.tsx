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
  const { x, y, z, rotationY = 0, boothWidth = 2.2, boothDepth = 2, color = "#b65b42" } = stall.coord_3d;

  const foodLabels: Record<string, string> = {
    "stall-01": "Beverages",
    "stall-02": "Mixed Rice",
    "stall-03": "Pau",
    "stall-04": "Stir-fry",
    "stall-05": "Guizhou Food",
    "stall-06": "Pork Noodles",
    "stall-07": "Chicken Rice",
    "stall-08": "Kolo Mee",
    "stall-09": "Pan Mee",
    "stall-10": "Porridge",
    "stall-11": "Bamboo Noodles",
  };

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
      {/* Food hall counter with a tiled base. */}
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[boothWidth, 0.9, boothDepth]} />
        <meshStandardMaterial
          color={hovered || isSelected ? "#d8c7b7" : "#e4d9ca"}
          roughness={0.75}
        />
      </mesh>

      {/* Countertop */}
      <mesh position={[0, 0.92, 0.1]}>
        <boxGeometry args={[boothWidth + 0.1, 0.06, boothDepth * 0.7]} />
        <meshStandardMaterial color="#585a55" roughness={0.35} metalness={0.15} />
      </mesh>

      {/* Kitchen back wall and menu screens. */}
      <mesh position={[0, 1.4, -boothDepth * 0.45]}>
        <boxGeometry args={[boothWidth - 0.1, 1.8, 0.1]} />
        <meshStandardMaterial color="#f1ece2" roughness={0.8} />
      </mesh>
      {[-0.48, 0.48].map((menuX) => (
        <mesh key={menuX} position={[menuX, 1.55, -boothDepth * 0.38]}>
          <boxGeometry args={[0.82, 0.55, 0.04]} />
          <meshStandardMaterial color="#303737" emissive="#28342f" emissiveIntensity={0.2} />
        </mesh>
      ))}
      {/* A restrained colour stripe keeps the selected counter easy to find. */}
      <mesh position={[0, 0.98, boothDepth * 0.36]}>
        <boxGeometry args={[boothWidth + 0.18, 0.06, 0.06]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {isSelected && (
        <group position={[0, 3.05, 0]}>
          <mesh>
            <cylinderGeometry args={[0.035, 0.035, 0.5]} />
            <meshBasicMaterial color="#e5ac6e" />
          </mesh>
          <mesh position={[0, 0.42, 0]}>
            <sphereGeometry args={[0.17, 12, 12]} />
            <meshBasicMaterial color="#e5ac6e" />
          </mesh>
        </group>
      )}

      <Html
        position={[0, 1.2, 0]}
        center
        className="pointer-events-auto select-none"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect(stall);
          }}
          aria-label={`Open ${stall.name}`}
          title={stall.name}
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-semibold transition-colors shadow-sm whitespace-nowrap ${
            isSelected
              ? "bg-accent text-white ring-2 ring-white scale-105"
              : hovered
              ? "bg-white text-accent ring-1 ring-accent"
              : "bg-white/95 text-ink border border-line backdrop-blur-md"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
          <span className="flex flex-col items-start text-left leading-snug"><span>{foodLabels[stall.id] ?? stall.name}</span>{(hovered || isSelected) && <span className="mt-0.5 max-w-[200px] whitespace-normal text-[11px] font-medium">{stall.name}</span>}</span>
        </button>
      </Html>
    </group>
  );
};
