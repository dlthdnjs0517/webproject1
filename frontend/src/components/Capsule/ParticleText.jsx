import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";
import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
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
  fontUrl = "//cdn.jsdelivr.net/npm/font-kopub@1.0",
  text = "BEYOND INNOVATION MEDICINE",
  finalTextColor = "#ffffff",
}) {
  const textRef = useRef();
  const endPositions = useMemo(() => {
    //textRef가 준비되지 않았을때 endPosition에 null값 저장(값이 아직 없음)
    if (!textRef.current) return null;
    return textRef.current.geometry.attributes.position.array;
  }, [textRef.current]);

  //파티클의 지오메트리 생성(위치,색상)
  const particleGeometry = useMemo(() => {
    if (!endPositions || !startPositionsTop || !startPositionsBottom)
      return null;

    const numParticles = endPositions.length / 3;
    const numTopParticles = Math.ceil(numParticles / 2);
    const numBottomParticles = numParticles - numTopParticles;

    // 버퍼 attribute 배열 생성
    const position = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    const colorTop = new THREE.Color(topColor);
    const colorBottom = new THREE.Color(bottomColor);

    //상단 파티클 색상 및 위치
    for (let i = 0; i < numTopParticles; i++) {
      const startIdx = (i * 3) % startPositionsTop.length;
      const targetIdx = i + numTopParticles;
      positions.set(
        [
          startPositionsBottom[startIdx],
          startPositionsBottom[startIdx + 1],
          startPositionsBottom[startIdx + 2],
        ],
        targetIdx * 3
      );
    }
    //하단
    for (let i = 0; i < numBottomParticles; i++) {
      const startIdx = (i * 3) % startPositionsBottom.length;
      const targetIdx = i + numTopParticles;
      positions.set(
        [
          startPositionsBottom[startIdx],
          startPositionsBottom[startIdx + 1],
          startPositionsBottom[startIdx + 2],
        ],
        targetIdx * 3
      );
      colors.set([colorBottom.r, colorBottom.g, colorBottom.b], targetIdx * 3);
    }
    //최종 지오메트리 생성
    const geometry = new THREE.BufferGeometry();

    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    return geometry;
  }, [
    endPositions,
    startPositionsTop,
    startPositionsBottom,
    topColor,
    bottomColor,
  ]);

  //gsap로 애니메이션 실행
  useEffect(() => {
    if (!particleGeometry || !endPositions) return;
    const progress = { value: 0 };
    const initialColors = particleGeometry.attributes.color.array.slice();
    const finalColor = new THREE.Color(finalTextColor);

    gsap.to(progress, {
      value: 1,
      duration: 3,
      ease: "power3.inOut",
      onUpdate: () => {
        const currentPositions = particleGeometry.attributes.position.array;
        const currentColors = particleGeometry.attributes.color.array;

        //progress 값에 따라 시작 위치와 최종 위치 사이를 보간
        for (let i = 0; i < endPositions.length / 3; i++) {
          const idx = i * 3;
          currentPositions[idx] = lerp(
            currentPositions[idx],
            endPositions[idx],
            0.05
          );
          currentPositions[idx + 1] = lerp(
            currentPositions[idx + 1],
            endPositions[idx + 1],
            0.05
          );
          currentPositions[idx + 2] = lerp(
            currentPositions[idx + 2],
            endPositions[idx + 2],
            0.05
          );
          //색상 보간
          currentColors[idx] = lerp(
            initialColors[idx],
            finalColor.r,
            progress.value
          );
          currentColors[idx + 1] = lerp(
            initialColors[idx + 1],
            finalColor.g,
            progress.value
          );
          currentColors[idx + 2] = lerp(
            initialColors[idx + 2],
            finalColor.b,
            progress.value
          );
        }
        particleGeometry.attributes.position.needsUpdate = true;
        particleGeometry.attributes.color.needsUpdate = true;
      },
    });
  }, [particleGeometry, endPositions]);
  return (
    <>
      {/* 위치 데이터 추출용 */}
      <Text
        ref={textRef}
        visible={false}
        font={fontUrl}
        fontSize={1.5}
        position={[0, 0, -1]}
      >
        {text}
      </Text>
      {/* 실제 파티클 */}
      {particleGeometry && (
        <points geometry={particleGeometry}>
          <pointsMaterial
            color="#ffffff"
            size={0.05}
            sizeAttenuation
            transparent
            opacity={1.0}
            vertexColors={true}
          />
        </points>
      )}
    </>
  );
}

export default ParticleText;
