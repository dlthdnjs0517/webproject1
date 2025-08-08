import * as THREE from "three";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import CapsuleHalf from "./CapsuleHalf";
import { useThree } from "@react-three/fiber";

export default function SplitCapsule({ isLoggedIn }) {
  const topRef = useRef();
  const bottomRef = useRef();
  const { camera } = useThree();

  const topColor = "#ffffff";
  const bottomColor = isLoggedIn ? "#E67775" : "#344C80";

  useEffect(() => {
    if (!topRef.current || !bottomRef.current) return;

    const tl = gsap.timeline();
    tl.set(topRef.current.position, { x: 0, y: 0, z: 0 });
    tl.set(bottomRef.current.position, { x: 0, y: 0, z: 0 });
    tl.set(topRef.current.rotation, { x: Math.PI / 2, y: 0, z: 0 });
    tl.set(bottomRef.current.rotation, { x: Math.PI / 2, y: 0, z: 0 });

    // 양옆으로 분리
    tl.to(topRef.current.position, { z: 2, duration: 1 }, 0);
    tl.to(bottomRef.current.position, { z: -2, duration: 1 }, 0);
    // tl.to(topRef.current.rotation, { y: Math.PI / 6 }, 0);
    // tl.to(bottomRef.current.rotation, { y: -Math.PI / 6 }, 0);

    // 카메라 이동도 함께
    // tl.to(
    //   camera.position,
    //   {
    //     x: 0,
    //     y: 6,
    //     z: 0,
    //     duration: 1.2,
    //     ease: "power2.out",
    //     onUpdate: () => camera.lookAt(8, 2, 0),
    //   },
    //   0,
    // );
  }, [isLoggedIn]);

  return (
    <>
      <CapsuleHalf ref={topRef} isTop={true} color={topColor} />
      <CapsuleHalf ref={bottomRef} isTop={false} color={bottomColor} />
    </>
  );
}
