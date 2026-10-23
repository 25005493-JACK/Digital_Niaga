"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { Stall } from "@/types";

interface CameraControllerProps {
  activeStall: Stall | null;
  controlsRef: React.RefObject<any>;
  animatingRef: React.MutableRefObject<boolean>;
  resetToken: number;
}

export const CameraController: React.FC<CameraControllerProps> = ({
  activeStall,
  controlsRef,
  animatingRef,
  resetToken,
}) => {
  const { camera, size } = useThree();

  // Target vectors for smooth interpolation (lerping)
  const targetCamPos = useRef(new THREE.Vector3(0, 20, 26));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 2));

  useEffect(() => {
    if (activeStall) {
      const { x, y, z } = activeStall.coord_3d;
      targetLookAt.current.set(x, y + 1.2, z);
      targetCamPos.current.set(x + (x < -8 ? 5 : x > 8 ? -5 : 3), y + 5.5, z + 5);
    } else {
      targetLookAt.current.set(0, 0, 2);
      targetCamPos.current.set(0, size.width < 600 ? 26 : 20, size.width < 600 ? 34 : 26);
    }
    animatingRef.current = true;
  }, [activeStall, animatingRef, resetToken, size.width]);

  useFrame(() => {
    if (!animatingRef.current) return;
    camera.position.lerp(targetCamPos.current, 0.05);
    if (controlsRef.current) {
      controlsRef.current.target.lerp(targetLookAt.current, 0.05);
      controlsRef.current.update();
      if (
        camera.position.distanceTo(targetCamPos.current) < 0.03 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.03
      ) {
        animatingRef.current = false;
      }
    }
  });

  return null;
};
