import { useEffect } from "react";

// 이 컴포넌트는 파티클의 '최종 위치' 배열만 생성하여 onReady로 전달합니다.
// 렌더링은 하지 않으므로 return null; 입니다.

function TextGeometry({ onReady, text = "BEYOND INNOVATION MEDICINE" }) {
  useEffect(() => {
    const createTextParticles = () => {
      // 1. 텍스트를 그릴 2D 캔버스 생성
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const canvasWidth = 2000;
      const canvasHeight = 200;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // 2. 폰트 및 텍스트 스타일 설정 (TTF/OTF 변환 필요 없음)
      ctx.fillStyle = "white";
      ctx.font = "bold 80px KoPub Dotum"; // 여기에 원하는 웹 폰트나 시스템 폰트를 바로 사용
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);

      // 3. 캔버스의 픽셀 데이터 스캔
      const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
      const pixels = imageData.data;
      const positions = [];

      // 4. 밀도 조절 (이 값을 줄이면 파티클이 촘촘해집니다)
      const density = 1;

      for (let y = 0; y < canvasHeight; y += density) {
        for (let x = 0; x < canvasWidth; x += density) {
          const index = (y * canvasWidth + x) * 4;
          // alpha 채널 값이 128보다 크면(반투명 이상) 파티클로 인정
          if (pixels[index + 3] > 128) {
            // 3D 공간 좌표로 변환 (중앙 정렬 및 스케일 조정)
            const posX = (x - canvasWidth / 2) * 0.013;
            const posY = -(y - canvasHeight / 2) * 0.013;
            const posZ = 0; // 2D 평면이므로 Z는 0

            positions.push(posX, posY, posZ);
          }
        }
      }

      if (positions.length === 0) {
        console.error(
          "No particles were generated. Check font loading or text content."
        );
        return;
      }

      const particlePositions = new Float32Array(positions);
      console.log(
        `[TextGeometry] Generated ${particlePositions.length / 3} particles using Canvas.`
      );

      // 생성된 위치 배열을 부모 컴포넌트로 전달
      onReady(particlePositions);
    };

    // 폰트 로딩 시간을 고려하여 약간의 지연 후 실행
    const timer = setTimeout(createTextParticles, 100);

    return () => clearTimeout(timer);
  }, [text, onReady]);

  return null; // 이 컴포넌트는 시각적 요소를 렌더링하지 않습니다.
}

export default TextGeometry;
