import * as THREE from "three";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import CapsuleHalf from "./CapsuleHalf";

export default function SplitCapsule({ isLoggedIn }) {
  const topRef = useRef();
  const bottomRef = useRef();

  const topColor = "#ffffff";
  const bottomColor = isLoggedIn ? "#E67775" : "#344C80";

  useEffect(() => {
    if (!topRef.current || !bottomRef.current) return;

    const tl = gsap.timeline();

    tl.set(topRef.current.position, { y: 0 }).set(bottomRef.current.position, {
      y: 0,
    });
  }, [isLoggedIn]);

  return (
    <>
      <CapsuleHalf ref={topRef} isTop={true} color={topColor} />
      <CapsuleHalf ref={bottomRef} isTop={false} color={bottomColor} />
    </>
  );
}
