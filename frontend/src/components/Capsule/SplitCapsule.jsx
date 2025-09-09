import * as THREE from "three";
import { useRef, useEffect, useState, useCallback } from "react";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";
import { MeshSurfaceSampler } from "three/addons/math/MeshSurfaceSampler.js";

import CapsuleHalf from "./CapsuleHalf";
import ParticleText from "./ParticleText";
import TextGeometry from "./TextGeometry";

// 메시 표면에서 랜덤한 점들의 위치를 샘플링하는 헬퍼 함수
const sampleMeshPositions = (mesh, count) => {
  if (!mesh?.geometry) {
    console.error("[sampleMeshPositions] Invalid mesh or geometry");
    return null;
  }

  try {
    const sampler = new MeshSurfaceSampler(mesh).build();
    const points = new Float32Array(count * 3);
    const p = new THREE.Vector3();

    for (let i = 0; i < count; i++) {
      sampler.sample(p);
      p.toArray(points, i * 3);
    }

    console.log(`[sampleMeshPositions] Sampled ${count} points`);
    return points;
  } catch (error) {
    console.error("[sampleMeshPositions] Error:", error);
    return null;
  }
};

function SplitCapsule({ isLoggedIn }) {
  const topRef = useRef();
  const bottomRef = useRef();
  const { camera } = useThree();

  const [isAnimating, setIsAnimating] = useState(false);
  const [geometriesReady, setGeometriesReady] = useState({
    top: false,
    bottom: false,
    text: false,
  });
  const [textEndPositions, setTextEndPositions] = useState(null);
  const [startPositionsTop, setStartPositionsTop] = useState(null);
  const [startPositionsBottom, setStartPositionsBottom] = useState(null);
  const [showParticles, setShowParticles] = useState(false);

  const timelineRef = useRef(null);
  const topColor = "#ffffff";
  const bottomColor = isLoggedIn ? "#E67775" : "#344C80";

  // 각 지오메트리 준비 완료 콜백
  const handleTopGeometryReady = useCallback(() => {
    console.log("[SplitCapsule] Top geometry ready");
    setGeometriesReady((prev) => ({ ...prev, top: true }));
  }, []);

  const handleBottomGeometryReady = useCallback(() => {
    console.log("[SplitCapsule] Bottom geometry ready");
    setGeometriesReady((prev) => ({ ...prev, bottom: true }));
  }, []);

  const handleTextGeometryReady = useCallback((positions) => {
    console.log(
      "[SplitCapsule] Text geometry ready with",
      positions.length / 3,
      "vertices"
    );
    setTextEndPositions(positions);
    setGeometriesReady((prev) => ({ ...prev, text: true }));
  }, []);

  // 파티클 샘플링 함수
  const sampleParticlesFromCapsules = useCallback(() => {
    if (!topRef.current || !bottomRef.current || !textEndPositions) {
      console.error("[sampleParticles] Missing references");
      return;
    }

    // 월드 매트릭스 업데이트
    topRef.current.updateWorldMatrix(true, false);
    bottomRef.current.updateWorldMatrix(true, false);

    const particleCount = textEndPositions.length / 3;
    const topCount = Math.ceil(particleCount / 2);
    const bottomCount = Math.floor(particleCount / 2);

    console.log(
      `[sampleParticles] Sampling ${topCount} from top, ${bottomCount} from bottom`
    );

    // 로컬 좌표계에서 샘플링
    const localTopPoints = sampleMeshPositions(topRef.current, topCount);
    const localBottomPoints = sampleMeshPositions(
      bottomRef.current,
      bottomCount
    );

    if (!localTopPoints || !localBottomPoints) {
      console.error("[sampleParticles] Failed to sample points");
      return;
    }

    // 월드 좌표계로 변환
    const worldTopPoints = new Float32Array(localTopPoints.length);
    const worldBottomPoints = new Float32Array(localBottomPoints.length);
    const p = new THREE.Vector3();

    for (let i = 0; i < localTopPoints.length / 3; i++) {
      p.fromArray(localTopPoints, i * 3);
      p.applyMatrix4(topRef.current.matrixWorld);
      p.toArray(worldTopPoints, i * 3);
    }

    for (let i = 0; i < localBottomPoints.length / 3; i++) {
      p.fromArray(localBottomPoints, i * 3);
      p.applyMatrix4(bottomRef.current.matrixWorld);
      p.toArray(worldBottomPoints, i * 3);
    }

    setStartPositionsTop(worldTopPoints);
    setStartPositionsBottom(worldBottomPoints);

    // 캡슐 숨기고 파티클 표시
    topRef.current.visible = false;
    bottomRef.current.visible = false;
    setShowParticles(true);

    console.log("[sampleParticles] Particle sampling complete");
  }, [textEndPositions]);

  // GSAP 타임라인 생성 및 애니메이션 설정
  useEffect(() => {
    if (
      !geometriesReady.top ||
      !geometriesReady.bottom ||
      !geometriesReady.text
    ) {
      console.log("[Timeline] Waiting for geometries...", geometriesReady);
      return;
    }

    console.log("[Timeline] All geometries ready, creating timeline");

    // 타임라인 생성
    if (!timelineRef.current) {
      timelineRef.current = gsap.timeline({
        paused: true,
        onStart: () => {
          console.log("[Timeline] Animation started");
          setIsAnimating(true);
        },
        onComplete: () => {
          console.log("[Timeline] Animation completed");
          setIsAnimating(false);
        },
        onReverseComplete: () => {
          console.log("[Timeline] Animation reversed");
          setIsAnimating(false);
          setShowParticles(false);
          if (topRef.current) topRef.current.visible = true;
          if (bottomRef.current) bottomRef.current.visible = true;
        },
      });
    }

    const tl = timelineRef.current;
    tl.clear();

    // 캡슐 분리 애니메이션
    tl.to(
      topRef.current.position,
      { z: 2, duration: 2, ease: "power2.inOut" },
      "split"
    )
      .to(
        bottomRef.current.position,
        { z: -2, duration: 2, ease: "power2.inOut" },
        "split"
      )
      .to(
        topRef.current.rotation,
        { y: Math.PI / 6, duration: 2, ease: "power2.inOut" },
        "split"
      )
      .to(
        bottomRef.current.rotation,
        { y: -Math.PI / 6, duration: 2, ease: "power2.inOut" },
        "split"
      )
      .to(
        camera.position,
        {
          x: 2,
          y: 6,
          z: 0,
          duration: 2.5,
          ease: "power3.inOut",
          onUpdate: () => camera.lookAt(0, 0, 0),
        },
        "split"
      )
      // 파티클 샘플링 및 시작
      .call(
        () => {
          console.log("[Timeline] Triggering particle sampling");
          sampleParticlesFromCapsules();
        },
        [],
        "split+=1.5"
      ); // 캡슐이 거의 분리되었을 때 파티클 생성
  }, [geometriesReady, camera, sampleParticlesFromCapsules]);

  // 휠 이벤트 핸들러
  useEffect(() => {
    const handleWheel = (event) => {
      if (isAnimating || !timelineRef.current) return;

      const tl = timelineRef.current;

      if (event.deltaY > 0 && !tl.isActive()) {
        console.log("[Wheel] Playing animation");
        tl.play();
      } else if (event.deltaY < 0 && !tl.isActive()) {
        console.log("[Wheel] Reversing animation");
        tl.reverse();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isAnimating]);

  return (
    <>
      {/* 텍스트 지오메트리 생성 (보이지 않음) */}
      {!textEndPositions && <TextGeometry onReady={handleTextGeometryReady} />}

      {/* 상단 캡슐 */}
      <CapsuleHalf
        ref={topRef}
        isTop={true}
        color={topColor}
        onGeometryReady={handleTopGeometryReady}
      />

      {/* 하단 캡슐 */}
      <CapsuleHalf
        ref={bottomRef}
        isTop={false}
        color={bottomColor}
        onGeometryReady={handleBottomGeometryReady}
      />

      {/* 파티클 텍스트 애니메이션 */}
      {showParticles &&
        startPositionsTop &&
        startPositionsBottom &&
        textEndPositions && (
          <ParticleText
            startPositionsTop={startPositionsTop}
            startPositionsBottom={startPositionsBottom}
            endPositions={textEndPositions}
            topColor={topColor}
            bottomColor={bottomColor}
            finalTextColor="#ffffff"
          />
        )}
    </>
  );
}

export default SplitCapsule;
