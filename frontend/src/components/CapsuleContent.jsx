import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useMemo, useState, useEffect } from "react";
import { isLoggedIn } from "../utils/auth";

function CapsuleMesh({ isLoggedIn }) {
  const capsuleGeometry = useMemo(() => {
    return new THREE.CapsuleGeometry(1, 3, 20, 30);
  }, []);

  const planeTop = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    []
  );

  const planeBottom = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, -1), 0),
    []
  );
  const bottomColor = isLoggedIn ? "#E67775" : "#344C80";
  return (
    <>
      <mesh
        rotation={[Math.PI / 2, 0, 0]}
        geometry={capsuleGeometry}
        scale={(1, 1, 1)}
        material={
          new THREE.MeshStandardMaterial({
            color: "#ffffff",
            roughness: 0.1,
            metalness: 0.4,
            clearcoat: 1,
            clearcoatRoughness: 0.03,
            reflectivity: 0.9,
            clippingPlanes: [planeTop],
            side: THREE.DoubleSide,
          })
        }
      />
      <mesh
        geometry={capsuleGeometry}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[1, 1, 1]}
        material={
          new THREE.MeshStandardMaterial({
            color: bottomColor,
            // 빨간약(로그인시) : #E67775
            // 파란약(비로그인): #344C80
            roughness: 0.1,
            metalness: 0.4,
            clearcoat: 1,
            clearcoatRoughness: 0.03,
            reflectivity: 0.8,
            clippingPlanes: [planeBottom],
            side: THREE.DoubleSide,
          })
        }
      />
    </>
  );
}
export default function CapsuleContent() {
  const [LoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const check = () => setLoggedIn(isLoggedIn());
    window.addEventListener("storage", check);

    check();
    return () => window.removeEventListener("storage", check);
  }, []);

  return (
    <>
      <div style={{ height: "100vh", width: "100vw" }}>
        <Canvas
          camera={{ position: [8, 2, 0], fov: 75 }}
          gl={{ localClippingEnabled: true }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[3, 4, 4]} intensity={1} />
          <Environment preset="sunset" />
          <CapsuleMesh />
          <OrbitControls />
        </Canvas>
      </div>
    </>
  );
}
