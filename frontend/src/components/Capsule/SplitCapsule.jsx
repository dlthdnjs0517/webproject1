import * as THREE from "three";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import CapsuleHalf from "./CapsuleHalf";
import { useThree } from "@react-three/fiber";
import { Observer } from "gsap/all";

gsap.registerPlugin(Observer);

export default function SplitCapsule({ isLoggedIn }) {
  const topRef = useRef();
  const bottomRef = useRef();
  const { camera } = useThree();

  const tlRef = useRef(null);
  const obsRef = useRef(null);
  const progressRef = useRef(0);

  const topColor = "#ffffff";
  const bottomColor = isLoggedIn ? "#E67775" : "#344C80";

  useEffect(() => {
    if (!topRef.current || !bottomRef.current) return;

    tlRef.current?.kill();
    obsRef.current?.kill();

    gsap.set(topRef.current.position, { z: 0 });
    gsap.set(bottomRef.current.position, { z: 0 });
    gsap.set(topRef.current.rotation, { y: 0 });
    gsap.set(bottomRef.current.rotation, { y: 0 });
    // 카메라 초기 위치(너가 쓰던 초깃값으로 맞춰)
    gsap.set(camera.position, { x: 8, y: 0, z: 0 });
    camera.lookAt(0, 0, 0);

    progressRef.current = 0;

    const tl = gsap.timeline({ paused: true });

    //양옆으로 분리
    tl.to(topRef.current.position, { z: 2 }, 0);
    tl.to(bottomRef.current.position, { z: -2 }, 0);
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
    // 2) 진행률 상태(0~1)
    let progress = 0;
    const clamp = gsap.utils.clamp(0, 1);

    // 3) Observer: 휠/터치/포인터 입력을 progress로 매핑
    const obs = Observer.create({
      target: window,
      type: "wheel,touch,pointer",
      preventDefault: true, // 기본 스크롤 방지
      onChange: (self) => {
        // 보편적으로 wheel은 deltaY 사용. 트랙패드 좌우 스와이프는 deltaX 보정.
        const raw =
          (typeof self.deltaY === "number" ? self.deltaY : 0) ||
          (typeof self.deltaX === "number" ? -self.deltaX : 0);

        const step = raw / 1400;
        progress = clamp(progress + step);

        tl.progress(progress);
      },
    });

    return () => {
      obs?.kill();
      tl.kill();
    };
  }, [isLoggedIn, camera]);

  return (
    <>
      <CapsuleHalf ref={topRef} isTop={true} color={topColor} axis="z" />
      <CapsuleHalf ref={bottomRef} isTop={false} color={bottomColor} axis="z" />
    </>
  );
}
