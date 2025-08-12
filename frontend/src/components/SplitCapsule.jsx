import * as THREE from "three";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import CapsuleHalf from "./CapsuleHalf";
import { useThree } from "@react-three/fiber";

export default function SplitCapsule({ isLoggedIn, triggerEl }) {
  const topRef = useRef();
  const bottomRef = useRef();
  const { camera } = useThree();

  const topColor = "#ffffff";
  const bottomColor = isLoggedIn ? "#E67775" : "#344C80";

  useEffect(() => {
    if (!topRef.current || !bottomRef.current || !triggerEl) return;

    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline();

    //양옆으로 분리
    tl.to(topRef.current.position, { z: 2, duration: 1 }, 0);
    tl.to(bottomRef.current.position, { z: -2, duration: 1 }, 0);
    tl.to(topRef.current.rotation, { y: Math.PI / 6 }, 0);
    tl.to(bottomRef.current.rotation, { y: -Math.PI / 6 }, 0);

    //카메라 이동도 함께
    tl.to(
      camera.position,
      {
        x: 0,
        y: 6,
        z: 0,
        duration: 2.5,
        onUpdate: () => camera.lookAt(0, 0, 0),
      },
      0
    ).set(camera.position, { x: 0, y: 0, z: 0 });
  }, [isLoggedIn]);

  return (
    <>
      <CapsuleHalf ref={topRef} isTop={true} color={topColor} axis="z" />
      <CapsuleHalf ref={bottomRef} isTop={false} color={bottomColor} axis="z" />
    </>
  );
}
