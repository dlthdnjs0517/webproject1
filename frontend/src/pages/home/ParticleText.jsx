import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";

// 선형 보간 함수
const lerp = (a, b, t) => a * (1 - t) + b * t;

function ParticleText({
  startPositionsTop,
  startPositionsBottom,
  topColor,
  bottomColor,
  text = "BEYOND INNOVATION MEDICINE",
  finalTextColor = "#ffffff",
  explosionFactor = 3.0,
  explosionDuration = 1.0,
  textFormationDuration = 2.0,
  endPositions,
}) {
  const pointsRef = useRef();
  const animationRef = useRef({ progress: 0, explosionProgress: 0 });

  // 파티클 지오메트리 생성
  const { particleGeometry, initialPositions, initialColors } = useMemo(() => {
    if (!startPositionsTop || !startPositionsBottom || !endPositions) {
      return {
        particleGeometry: null,
        initialPositions: null,
        initialColors: null,
      };
    }

    const numParticles = endPositions.length / 3;
    const numTop = Math.ceil(numParticles / 2);
    const numBottom = numParticles - numTop;

    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

    const cTop = new THREE.Color(topColor);
    const cBottom = new THREE.Color(bottomColor);

    // 상단 캡슐에서 파티클 시작 위치 설정
    for (let i = 0; i < numTop; i++) {
      const i3 = i * 3;
      const sourceIdx = (i * 3) % startPositionsTop.length;

      positions[i3] = startPositionsTop[sourceIdx];
      positions[i3 + 1] = startPositionsTop[sourceIdx + 1];
      positions[i3 + 2] = startPositionsTop[sourceIdx + 2];

      colors[i3] = cTop.r;
      colors[i3 + 1] = cTop.g;
      colors[i3 + 2] = cTop.b;
    }

    // 하단 캡슐에서 파티클 시작 위치 설정
    for (let i = 0; i < numBottom; i++) {
      const i3 = (numTop + i) * 3;
      const sourceIdx = (i * 3) % startPositionsBottom.length;

      positions[i3] = startPositionsBottom[sourceIdx];
      positions[i3 + 1] = startPositionsBottom[sourceIdx + 1];
      positions[i3 + 2] = startPositionsBottom[sourceIdx + 2];

      colors[i3] = cBottom.r;
      colors[i3 + 1] = cBottom.g;
      colors[i3 + 2] = cBottom.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    console.log(`[ParticleText] Created ${numParticles} particles`);

    return {
      particleGeometry: geometry,
      initialPositions: positions.slice(),
      initialColors: colors.slice(),
    };
  }, [
    endPositions,
    startPositionsTop,
    startPositionsBottom,
    topColor,
    bottomColor,
  ]);

  // 폭발 위치 계산
  const explodedPositions = useMemo(() => {
    if (!initialPositions) return null;

    const exploded = new Float32Array(initialPositions.length);
    const center = new THREE.Vector3(0, 0, 0);

    for (let i = 0; i < initialPositions.length / 3; i++) {
      const i3 = i * 3;
      const p = new THREE.Vector3(
        initialPositions[i3],
        initialPositions[i3 + 1],
        initialPositions[i3 + 2]
      );

      // 중심으로부터의 방향 계산
      const dir = p.clone().sub(center).normalize();
      const randomFactor = 0.5 + Math.random() * 0.5;
      const explosionDistance = explosionFactor * randomFactor;

      // 폭발 위치 설정
      const explodedPos = p.add(dir.multiplyScalar(explosionDistance));
      exploded[i3] = explodedPos.x;
      exploded[i3 + 1] = explodedPos.y;
      exploded[i3 + 2] = explodedPos.z;
    }

    return exploded;
  }, [initialPositions, explosionFactor]);

  // GSAP 애니메이션
  useEffect(() => {
    if (!particleGeometry || !explodedPositions || !endPositions) return;

    const tl = gsap.timeline();

    // 폭발 애니메이션
    tl.to(animationRef.current, {
      explosionProgress: 1,
      duration: explosionDuration,
      ease: "power2.out",
    });

    // 텍스트 형성 애니메이션
    tl.to(animationRef.current, {
      progress: 1,
      duration: textFormationDuration,
      ease: "power3.inOut",
    });

    return () => tl.kill();
  }, [
    particleGeometry,
    explodedPositions,
    endPositions,
    explosionDuration,
    textFormationDuration,
  ]);

  // 프레임마다 파티클 위치 업데이트
  useFrame(() => {
    if (!pointsRef.current || !particleGeometry || !explodedPositions) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const colAttr = pointsRef.current.geometry.attributes.color;
    const targetColor = new THREE.Color(finalTextColor);

    const { explosionProgress, progress } = animationRef.current;

    for (let i = 0; i < initialPositions.length / 3; i++) {
      const i3 = i * 3;

      // 위치 보간: 초기 -> 폭발 -> 텍스트
      let x, y, z;

      if (explosionProgress < 1) {
        // 초기 위치에서 폭발 위치로
        x = lerp(
          initialPositions[i3],
          explodedPositions[i3],
          explosionProgress
        );
        y = lerp(
          initialPositions[i3 + 1],
          explodedPositions[i3 + 1],
          explosionProgress
        );
        z = lerp(
          initialPositions[i3 + 2],
          explodedPositions[i3 + 2],
          explosionProgress
        );
      } else {
        // 폭발 위치에서 텍스트 위치로
        x = lerp(explodedPositions[i3], endPositions[i3], progress);
        y = lerp(explodedPositions[i3 + 1], endPositions[i3 + 1], progress);
        z = lerp(explodedPositions[i3 + 2], endPositions[i3 + 2], progress);
      }

      posAttr.array[i3] = x;
      posAttr.array[i3 + 1] = y;
      posAttr.array[i3 + 2] = z;

      // 색상 보간
      if (progress > 0) {
        colAttr.array[i3] = lerp(initialColors[i3], targetColor.r, progress);
        colAttr.array[i3 + 1] = lerp(
          initialColors[i3 + 1],
          targetColor.g,
          progress
        );
        colAttr.array[i3 + 2] = lerp(
          initialColors[i3 + 2],
          targetColor.b,
          progress
        );
      }
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
  });

  if (!particleGeometry) return null;

  return (
    <points ref={pointsRef} geometry={particleGeometry}>
      <pointsMaterial
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.9}
        vertexColors
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default ParticleText;
