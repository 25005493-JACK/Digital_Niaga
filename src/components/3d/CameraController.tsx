"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Stall } from "@/types";

interface CameraControllerProps {
  activeStall: Stall | null;
  controlsRef: React.RefObject<any>;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  activeStall,
  controlsRef,
}) => {
  const { camera } = useThree();

  // Target vectors for smooth interpolation (lerping)
  const targetCamPos = useRef(new THREE.Vector3(0, 13, 16));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));

  useEffect(() => {
    if (activeStall) {
      const { x, y, z } = activeStall.coord_3d;
      // Focus on the selected stall with a nice cinematic isometric angle
      targetLookAt.current.set(x, y + 1.2, z);
      targetCamPos.current.set(x + (x > 0 ? 3.5 : -3.5), y + 4.5, z + (z > 0 ? 5 : -5));
    } else {
      // Return to full 1 Utama Food District aerial overview
      targetLookAt.current.set(0, 0, 0);
      targetCamPos.current.set(0, 13, 16);
    }
  }, [activeStall]);

  useFrame(() => {
    // Smooth camera position interpolation
    camera.position.lerp(targetCamPos.current, 0.05);

    // Smooth OrbitControls target interpolation
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 0.05);
      controlsRef.current.update();
    }
  });

  return null;
};
