import { useSelector } from "react-redux";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import SplitCapsule from "./SplitCapsule";

export default function CapsuleContent() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <>
      <div style={{ height: "100vh", width: "100vw" }}>
        <Canvas
          camera={{ position: [8, 0, 0], fov: 75 }}
          gl={{ localClippingEnabled: true }}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[3, 4, 4]} intensity={1} />
          <Environment preset="sunset" />
          <SplitCapsule isLoggedIn={isLoggedIn} />
          {/* <OrbitControls /> */}
        </Canvas>
      </div>
    </>
  );
}
