import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Text3D,
  Center,
  Environment,
  MeshTransmissionMaterial,
  ContactShadows,
} from "@react-three/drei";

// function GlassText() {
//   const textRef = useRef();

//   return (
//     <Center>
//       <Text3D
//         ref={textRef}
//         font="/fonts/Bebas Neue_Regular.json"
//         size={0.85}
//         height={0.5}
//         curveSegments={20}
//         bevelEnabled
//         bevelThickness={0.03}
//         bevelSize={0.03}
//         bevelSegments={8}
//       >
//         BEYOND
//         <MeshTransmissionMaterial
//           backside
//           transmission={0.3}
//           thickness={1}
//           roughness={0}
//           clearcoat={1}
//           ior={1.5}
//           chromaticAberration={0.3}
//           anisotropy={0.3}
//           attenuationColor="#1a1a1a"
//           color="#3a3a3a"
//           attenuationDistance={0.2}
//         />
//       </Text3D>
//     </Center>
//   );
// }

// function TextBackground() {
//   return (
//     <div
//       style={{
//         width: "100%",
//         height: "500px",
//         position: "relative",
//       }}
//     >
//       {/* background:
//        "linear-gradient(135deg, #ffd5f5 0%, #d5e8ff 25%, #fff5d5 50%, #f5d5ff 75%, #d5fff5 100%)", */}
//       <Canvas
//         camera={{ position: [0, 0, 3], fov: 50 }}
//         gl={{
//           alpha: true,
//           antialias: true,
//         }}
//       >
//         <color attach="background" args={["#ffffff"]} />

//         {/* ✅ 3D 배경 평면 추가 (이게 핵심!) */}
//         <mesh position={[0, 0, -2]} scale={5}>
//           <planeGeometry />
//           <meshBasicMaterial color="#f5e8ff" toneMapped={false} />
//         </mesh>

//         <ambientLight intensity={0.6} />
//         <directionalLight
//           position={[5, 5, 5]}
//           intensity={1.5}
//           color="#ffffff"
//         />
//         <directionalLight
//           position={[-5, -3, -5]}
//           intensity={1}
//           color="#e8d5ff"
//         />
//         {/* 위에서 조명 */}
//         <directionalLight
//           position={[0, 5, 0]}
//           intensity={0.8}
//           color="#ffffff"
//         />
//         <pointLight position={[3, 2, 2]} intensity={0.8} color="#ffd5ff" />
//         <pointLight position={[-3, 2, 2]} intensity={0.8} color="#d5e8ff" />
//         <Environment preset="sunset" />
//         <GlassText />
//       </Canvas>
//     </div>
//   );
// }
function GlassText() {
  return (
    <group rotation={[0, 0, 0]}>
      <Center>
        <Text3D
          font="/fonts/Bebas Neue_Regular.json"
          size={0.85}
          height={0.5}
          curveSegments={32}
          bevelEnabled
          bevelThickness={0.3}
          bevelSize={0.05}
          bevelSegments={20}
        >
          BEYOND
          <MeshTransmissionMaterial
            backside={true}
            samples={16}
            transmission={1}
            thickness={0.5}
            roughness={0}
            ior={1.5}
            chromaticAberration={0.4}
            anisotropy={0.5}
            distortion={0.3}
            distortionScale={0.5}
            temporalDistortion={0.2}
            clearcoat={1}
            attenuationDistance={2}
            attenuationColor="#ffffff"
            color="#dee2e6"
            iridescence={1}
            iridescenceIOR={1.4}
          />
        </Text3D>
      </Center>

      {/* 그림자 */}
      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.4}
        scale={15}
        blur={2.5}
        far={4}
      />
    </group>
  );
}

function TextBackground() {
  return (
    <div
      style={{
        width: "100%",
        height: "600px",
        background: "#ffffff",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 3], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        {/* Canvas 배경색 */}
        <color attach="background" args={["#ffffff"]} />

        {/* 3D 배경 평면들 (여러 겹) */}
        <mesh position={[0, 0, -3]} scale={10}>
          <planeGeometry />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>

        <mesh position={[-2, 1, -2.5]} scale={6}>
          <planeGeometry />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>

        <mesh position={[2, -1, -2.8]} scale={7}>
          <planeGeometry />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
        </mesh>

        {/* 조명 */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" />
        <directionalLight
          position={[-5, 5, -5]}
          intensity={1.5}
          color="#ffd5ff"
        />
        <directionalLight position={[0, -5, 0]} intensity={1.5} />

        <pointLight position={[0, 5, 3]} intensity={1.5} color="#ffffff" />
        <pointLight position={[3, 0, 2]} intensity={1} color="#ffd5ff" />
        <pointLight position={[-3, 0, 2]} intensity={1} color="#d5e8ff" />

        {/* <Environment preset="sunset" /> */}
        <GlassText />
      </Canvas>
    </div>
  );
}

export default TextBackground;
