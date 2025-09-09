import { useRef, useEffect } from "react";
import { Text } from "@react-three/drei";
import * as THREE from "three";

function TextGeometry({ onReady, text = "BEYOND INNOVATION MEDICINE" }) {
  const textRef = useRef();

  useEffect(() => {
    // Text 컴포넌트가 완전히 로드될 때까지 대기
    const checkGeometry = () => {
      if (textRef.current && textRef.current.geometry) {
        const geometry = textRef.current.geometry;

        // Geometry를 복사하고 중심을 맞춤
        const clonedGeometry = geometry.clone();
        clonedGeometry.center();

        // 포지션 데이터 추출
        const positions = clonedGeometry.attributes.position.array;

        // 텍스트를 파티클로 변환하기 위해 더 많은 점 생성
        const particleCount = 2000; // 파티클 개수 증가
        const textPositions = new Float32Array(particleCount * 3);

        // 텍스트 지오메트리의 vertices를 기반으로 파티클 위치 생성
        if (positions && positions.length > 0) {
          for (let i = 0; i < particleCount; i++) {
            // 텍스트 지오메트리의 랜덤한 vertex를 선택
            const vertexIndex =
              Math.floor(Math.random() * (positions.length / 3)) * 3;

            // 약간의 노이즈를 추가하여 파티클 효과 개선
            const noise = 0.05;
            textPositions[i * 3] =
              positions[vertexIndex] + (Math.random() - 0.5) * noise;
            textPositions[i * 3 + 1] =
              positions[vertexIndex + 1] + (Math.random() - 0.5) * noise;
            textPositions[i * 3 + 2] =
              positions[vertexIndex + 2] + (Math.random() - 0.5) * noise;
          }

          console.log(
            `[TextGeometry] Generated ${particleCount} particle positions from text geometry`
          );
          onReady(textPositions);
        }
      }
    };

    // Text 컴포넌트가 로드되기까지 약간의 지연 필요
    const timer = setTimeout(checkGeometry, 100);

    return () => clearTimeout(timer);
  }, [text, onReady]);

  return (
    <group position={[0, 0, 0]}>
      <Text
        ref={textRef}
        visible={false}
        fontSize={0.8}
        letterSpacing={0.05}
        // font="/fonts/Inter-Bold.woff" // drei의 기본 폰트 사용
      >
        {text}
      </Text>
    </group>
  );
}

export default TextGeometry;
