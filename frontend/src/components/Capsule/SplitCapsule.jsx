import * as THREE from "three";
import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

import CapsuleHalf from "./CapsuleHalf";
import ParticleText from "./ParticleText";

// MESH 표면에서 랜덤한 점들의 위치를 샘플링하는 헬퍼 함수
const meshPositions = (mesh, count) => {
  if (!mesh?.geometry) return null;
  const sampler = new MeshSurfaceSampler(mesh).build();
  const points = new Float32Array(count * 3);
  const p = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    sampler.sample(p);
    p.toArray(points, i * 3);
  }
  return points;
};
function SplitCapsule({ isLoggedIn }) {
  const topRef = useRef();
  const bottomRef = useRef();
  const { camera } = useThree();

  const [isAnimating, setIsAnimating] = useState(false);
  const [geometriesReady, setGeometriesReady] = useState({
    top: false,
    bottom: false,
  });
  const timelineRef = useRef(null);

  const [startPositionsTop, setStartPositionsTop] = useState(null);
  const [startPositionsBottom, setStartPositionsBottom] = useState(null);
  const [showParticles, setShowParticles] = useState(false);

  const topColor = "#ffffff";
  const bottomColor = isLoggedIn ? "#E67775" : "#344C80";

  // 각 캡슐의 geometry 준비 완료 콜백
  const handleTopGeometryReady = useCallback(
    () => setGeometriesReady((prev) => ({ ...prev, top: true })),
    []
  );
  const handleBottomGeometryReady = useCallback(
    () => setGeometriesReady((prev) => ({ ...prev, bottom: true })),
    []
  );

  //GSAP 타임라인 생성
  useEffect(() => {
    if (
      !geometriesReady.top ||
      !geometriesReady.bottom ||
      !topRef.current ||
      !bottomRef.current
    )
      return;

    // 전체 시퀀스를 담는 gsap 타임라인 생성
    if (!timelineRef.current) {
      timelineRef.current = gsap.timeline({
        paused: true,
        onStart: () => setIsAnimating(true),
        onComplete: () => setIsAnimating(false),
        onReverseComplete: () => {
          setIsAnimating(false);
          setShowParticles(false);
          if (topRef.current) topRef.current.visible = true;
          if (bottomRef.current) bottomRef.current.visible = true;
        },
      });
    }

    const tl = timelineRef.current;
    tl.clear();

    // --- 애니메이션 시퀀스 정의 ---

    tl.to(
      topRef.current.position,
      { z: 2, duration: 2, ease: "power2.inOut" },
      "start"
    )
      .to(
        bottomRef.current.position,
        { z: -2, duration: 2, ease: "power2.inOut" },
        "start"
      )
      .to(
        topRef.current.rotation,
        { y: Math.PI / 6, duration: 2, ease: "power2.inOut" },
        "start"
      )
      .to(
        bottomRef.current.rotation,
        { y: -Math.PI / 6, duration: 2, ease: "power2.inOut" },
        "start"
      )

      .to(
        camera.position,
        {
          x: 2,
          y: 8,
          z: 0,
          duration: 2,
          ease: "power3.inOut",
          onUpdate: () => camera.lookAt(0, 0, 0),
        },
        "start"
      );
    // 파티클 폭발
    tl.call(
      () => {
        if (!topRef.current || !bottomRef.current) return;

        // Ensure world matrices are up-to-date at the final position
        topRef.current.updateWorldMatrix(true, false);
        bottomRef.current.updateWorldMatrix(true, false);

        const PARTICLE_COUNT = 25000;
        const localTopPoints = meshPositions(
          topRef.current,
          Math.ceil(PARTICLE_COUNT / 2)
        );
        const localBottomPoints = meshPositions(
          bottomRef.current,
          Math.floor(PARTICLE_COUNT / 2)
        );

        if (!localTopPoints || !localBottomPoints) return;

        const worldTopPoints = new Float32Array(localTopPoints.length);
        const worldBottomPoints = new Float32Array(localBottomPoints.length);
        const p = new THREE.Vector3();

        // Transform local points to world space for the top half
        for (let i = 0; i < localTopPoints.length / 3; i++) {
          p.fromArray(localTopPoints, i * 3);
          p.applyMatrix4(topRef.current.matrixWorld);
          p.toArray(worldTopPoints, i * 3);
        }

        // Transform local points to world space for the bottom half
        for (let i = 0; i < localBottomPoints.length / 3; i++) {
          p.fromArray(localBottomPoints, i * 3);
          p.applyMatrix4(bottomRef.current.matrixWorld);
          p.toArray(worldBottomPoints, i * 3);
        }

        setStartPositionsTop(worldTopPoints);
        setStartPositionsBottom(worldBottomPoints);

        // Hide original capsules and trigger particle animation
        topRef.current.visible = false;
        bottomRef.current.visible = false;
        setShowParticles(true);
      },
      [],
      ">-0.5"
    ); // Start this callback slightly before the split animation ends for a smooth transition
  }, [geometriesReady, camera, isLoggedIn]);

  // 2. Wheel 이벤트 감지 (ScrollTrigger 대체)
  useEffect(() => {
    const handleWheel = (event) => {
      console.log(
        "[wheel]",
        event.deltaY,
        "tl?",
        !!timelineRef.current,
        "anim?",
        isAnimating
      );
      // 애니메이션이 재생 중이면 아무것도 하지 않음
      if (isAnimating || !timelineRef.current) return;

      const tl = timelineRef.current;

      // event.deltaY > 0 은 아래로 스크롤했다는 의미
      if (event.deltaY > 0 && !tl.isActive()) {
        tl.play();
      }
      // event.deltaY < 0 은 위로 스크롤했다는 의미
      else if (event.deltaY < 0 && !tl.isActive()) {
        tl.reverse();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });

    // 컴포넌트 언마운트 시 이벤트 리스너 정리
    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, [isAnimating]);

  // gsap.set(topRef.current.position, { z: 0 });
  // gsap.set(bottomRef.current.position, { z: 0 });
  // gsap.set(topRef.current.rotation, { y: 0 });
  // gsap.set(bottomRef.current.rotation, { y: 0 });
  // // 카메라 초기 위치
  // gsap.set(camera.position, { x: 8, y: 0, z: 0 });
  // camera.lookAt(0, 0, 0);

  // progressRef.current = 0;

  // //카메라 이동도 함께
  // tl.to(
  //   camera.position,
  //   {
  //     x: 0,
  //     y: 6,
  //     z: 0,
  //     duration: 2.5,
  //     onUpdate: () => camera.lookAt(0, 0, 0),
  //   },
  //   0
  // ).set(camera.position, { x: 0, y: 0, z: 0 });

  return (
    <>
      <CapsuleHalf
        ref={topRef}
        isTop={true}
        color={topColor}
        axis="z"
        onGeometryReady={handleTopGeometryReady}
      />
      <CapsuleHalf
        ref={bottomRef}
        isTop={false}
        color={bottomColor}
        axis="z"
        onGeometryReady={handleBottomGeometryReady}
      />

      {/* startAnimation이 true가 되면 particleText 컴포넌트 렌더링 */}
      {showParticles && startPositionsTop && startPositionsBottom && (
        <ParticleText
          startPositionsTop={startPositionsTop}
          startPositionsBottom={startPositionsBottom}
          topColor={topColor}
          bottomColor={bottomColor}
        />
      )}
    </>
  );
}

export default SplitCapsule;
