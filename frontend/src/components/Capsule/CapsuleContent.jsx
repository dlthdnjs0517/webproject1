import { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import SplitCapsule from "./SplitCapsule";

export default function CapsuleContent() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const sectionRef = useRef(null);

  return (
    <section
      ref={sectionRef}
      style={{
        height: "100vh",
        width: "100vw",
        background:
          "radial-gradient(circle, rgba(241, 225, 242, 1) 0%, rgba(68, 118, 235, 1) 75%, rgba(93, 132, 222, 1) 100%)",
      }}
    >
      <Canvas
        camera={{ position: [8, 0, 0], fov: 75 }}
        gl={{ localClippingEnabled: true }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 4, 4]} intensity={1} />
        <Environment preset="sunset" />
        <SplitCapsule isLoggedIn={isLoggedIn} />
      </Canvas>
    </section>
  );
}
