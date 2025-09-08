import * as THREE from "three";
import { useMemo, useRef, useEffect, useState, useCallback } from "react";
import { Text } from "@react-three/drei";
import gsap from "gsap";

//선형 보간 함수 (lerp)
const lerp = (a, b, t) => a * (1 - t) + b * t;

/**
 *   ParticleText 컴포넌트
 *  캡슐의 두 색상(상단/하단)을 가진 파티클들이 나타나 텍스트를 형성하는 애니메이션을 담당합니다.
 * @component
 *  @param {Float32Array} startPositionsTop - 상단 캡슐 표면에서 추출한 파티클 시작 위치
 *  @param {Float32Array} startPositionsBottom - 하단 캡슐 표면에서 추출한 파티클 시작 위치
 *  @param {string} topColor - 상단 파티클 색상
 *  @param {string} bottomColor - 하단 파티클 색상
 *  @param {string} fontUrl - 폰트 파일 경로
 *  @param {string} text - 최종적으로 만들 텍스트
 */

function ParticleText({
  startPositionsTop,
  startPositionsBottom,
  topColor,
  bottomColor,
  text = "BEYOND INNOVATION MEDICINE",
  finalTextColor = "#ffffff",
  explosionFactor = 2.5,
  explosionDuration = 0.8,
  textFormationDuration = 1.5,
}) {
  const textRef = useRef();
  const pointsRef = useRef();

  const [endPositions, setEndPositions] = useState(null);

  // 1) Text 지오메트리 준비 완료 시 타깃 좌표 확보
  const handleSync = useCallback(() => {
    if (textRef.current?.geometry?.attributes?.position?.array) {
      const positions = textRef.current.geometry.attributes.position.array;
      setEndPositions(new Float32Array(positions));
      console.log(`End positions captured. ${positions.length / 3} vertices.`);
    }
  }, []);

  // 2) 파티클 시작 좌표 + 색상 설정
  const particleGeometry = useMemo(() => {
    if (!startPositionsTop || !startPositionsBottom || !endPositions)
      return null;

    const numParticles = endPositions.length / 3;
    const numTop = Math.ceil(numParticles / 2);
    const numBottom = numParticles - numTop;

    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

    const cTop = new THREE.Color(topColor);
    const cBottom = new THREE.Color(bottomColor);
    //상단 포지션, 색깔
    for (let i = 0; i < numTop; i++) {
      const i3 = i * 3;
      const startIdx = i3 % startPositionsTop.length;
      positions.set(
        [
          startPositionsTop[startIdx],
          startPositionsTop[startIdx + 1],
          startPositionsTop[startIdx + 2],
        ],
        i3
      );
      colors.set([cTop.r, cTop.g, cTop.b], i3);
    }

    // 하단 포지션, 색깔
    for (let i = 0; i < numBottom; i++) {
      const i3 = (numTop + i) * 3;
      const startIdx = (i * 3) % startPositionsBottom.length;
      positions.set(
        [
          startPositionsBottom[startIdx],
          startPositionsBottom[startIdx + 1],
          startPositionsBottom[startIdx + 2],
        ],
        i3
      );
      colors.set([cBottom.r, cBottom.g, cBottom.b], i3);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    console.log("Particle geometry created.");
    return geometry;
  }, [
    endPositions,
    startPositionsTop,
    startPositionsBottom,
    topColor,
    bottomColor,
  ]);

  // 3) 애니메이션 (초기 → 텍스트 좌표)
  useEffect(() => {
    if (!particleGeometry || !endPositions || !pointsRef.current) return;

    const posAttr = pointsRef.current.geometry.attributes.position;
    const colAttr = pointsRef.current.geometry.attributes.color;
    const initialPositions = posAttr.array.slice();
    const initialColors = colAttr.array.slice();
    const targetColor = new THREE.Color(finalTextColor);

    // 폭발 포지션 계산

    const explodedPositions = new Float32Array(initialPositions.length);
    const p = new THREE.Vector3();
    for (let i = 0; i < initialPositions.length / 3; i++) {
      p.fromArray(initialPositions, i * 3);
      const dir = p.clone().normalize();
      const strength = (Math.random() * 0.8 + 0.2) * explosionFactor;
      p.add(dir.multiplyScalar(strength));
      p.toArray(explodedPositions, i * 3);
    }

    const tl = gsap.timeline();
    const dummy = { t: 0 };
    const dummy2 = { t: 0 };

    //애니메이션 1
    tl.to(dummy, {
      t: 1,
      duration: explosionDuration,
      ease: "power2.out",
      onUpdate: () => {
        for (let i = 0; i < initialPositions.length / 3; i++) {
          const i3 = i * 3;
          posAttr.array[i3] = lerp(
            initialPositions[i3],
            explodedPositions[i3],
            dummy.t
          );
          posAttr.array[i3 + 1] = lerp(
            initialPositions[i3 + 1],
            explodedPositions[i3 + 1],
            dummy.t
          );
          posAttr.array[i3 + 2] = lerp(
            initialPositions[i3 + 2],
            explodedPositions[i3 + 2],
            dummy.t
          );
        }
        posAttr.needsUpdate = true;
      },
    });

    //text 생성
    tl.to(dummy2, {
      t: 1,
      duration: textFormationDuration,
      ease: "power3.inOut",
      onUpdate: () => {
        for (let i = 0; i < endPositions.length / 3; i++) {
          const i3 = i * 3;
          // Animate position from exploded to final text shape
          posAttr.array[i3] = lerp(
            explodedPositions[i3],
            endPositions[i3],
            dummy2.t
          );
          posAttr.array[i3 + 1] = lerp(
            explodedPositions[i3 + 1],
            endPositions[i3 + 1],
            dummy2.t
          );
          posAttr.array[i3 + 2] = lerp(
            explodedPositions[i3 + 2],
            endPositions[i3 + 2],
            dummy2.t
          );
          // Animate color from initial to final
          colAttr.array[i3] = lerp(initialColors[i3], targetColor.r, dummy2.t);
          colAttr.array[i3 + 1] = lerp(
            initialColors[i3 + 1],
            targetColor.g,
            dummy2.t
          );
          colAttr.array[i3 + 2] = lerp(
            initialColors[i3 + 2],
            targetColor.b,
            dummy2.t
          );
        }
        posAttr.needsUpdate = true;
        colAttr.needsUpdate = true;
      },
    });
    return () => tl.kill();
  }, [
    particleGeometry,
    endPositions,
    finalTextColor,
    explosionFactor,
    explosionDuration,
    textFormationDuration,
  ]);

  return (
    <>
      {/* 위치 데이터 추출용 */}
      <group rotation={[0, Math.PI / 2, 0]}>
        <Text
          ref={textRef}
          visible={false}
          // font="/fonts/KoPubWorld_Dotum_Pro_Bold.otf"
          fontSize={1.5}
          onSync={!endPositions ? handleSync : null}
        >
          {text}
        </Text>
        {/* 실제 파티클 */}
        {particleGeometry && (
          <points geometry={particleGeometry}>
            <pointsMaterial
              size={0.05}
              sizeAttenuation
              transparent={true}
              vertexColors={true}
              depthWrite={false}
            />
          </points>
        )}
      </group>
    </>
  );
}

export default ParticleText;
