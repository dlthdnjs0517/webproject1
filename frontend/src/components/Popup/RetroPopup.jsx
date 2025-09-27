import React, { useState } from "react";
import { Link } from "react-router-dom";

const RetroPopup = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <>
      {/* 폰트 임포트 */}
      <style>
        {`
          @font-face {
            font-family: 'DungGeunMo';
            src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/DungGeunMo.woff') format('woff');
            font-weight: normal;
            font-display: swap;
          }
          
          .retro-popup * {
            font-family: 'DungGeunMo', '굴림', 'Gulim', serif !important;
          }
          
          @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0.3; }
          }
          
          .blink-text {
            animation: blink 1s infinite;
          }
        `}
      </style>

      <div
        className="retro-popup"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            width: "450px",
            backgroundColor: "#C0C0C0",
            border: "4px outset #C0C0C0",
            borderRadius: "0",
            padding: "0",
            boxShadow: "8px 8px 0px #808080, 12px 12px 0px #404040",
            position: "relative",
          }}
        >
          {/* 팝업 헤더 */}
          <div
            style={{
              background:
                "linear-gradient(90deg, #0066CC 0%, #004499 50%, #0066CC 100%)",
              color: "white",
              padding: "8px 12px",
              fontSize: "14px",
              fontWeight: "bold",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              textShadow: "1px 1px 0px #000080",
            }}
          >
            <button
              onClick={() => setIsVisible(false)}
              style={{
                background: "#C0C0C0",
                border: "2px outset #C0C0C0",
                color: "black",
                fontSize: "14px",
                fontWeight: "bold",
                width: "20px",
                height: "20px",
                cursor: "pointer",
                padding: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ×
            </button>
          </div>

          {/* 팝업 내용 */}
          <div
            style={{
              padding: "30px",
              backgroundColor: "#FFFBF0",
              textAlign: "center",
              backgroundImage: `
              radial-gradient(circle at 20px 20px, rgba(255,255,0,0.1) 2px, transparent 2px),
              radial-gradient(circle at 40px 40px, rgba(255,0,255,0.1) 1px, transparent 1px)
            `,
              backgroundSize: "60px 60px, 80px 80px",
            }}
          >
            {/* 제목 */}
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#FF00FF",
                marginBottom: "20px",
                textShadow:
                  "2px 2px 4px rgba(255,0,255,0.3), -1px -1px 2px rgba(255,255,255,0.8)",
                letterSpacing: "2px",
              }}
            >
              &lt;<span style={{ color: "#33FF33" }}>우주 쇼핑몰</span>&gt;
            </div>

            {/* 링크 텍스트 */}
            <div
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#0000FF",
                marginBottom: "25px",
                textDecoration: "underline",
                cursor: "pointer",
                textShadow: "1px 1px 2px rgba(0,0,255,0.3)",
                letterSpacing: "1px",
              }}
              onClick={() => {
                <Link to="*" />;
                console.log("물건을 본다 클릭됨");
              }}
            >
              &gt;&gt;나는 물건을 본다
            </div>

            {/* 금색 텍스트 */}
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                color: "#FFD966",
                marginBottom: "15px",
                textShadow: " 3px 3px 5px rgba(0, 0, 0, 1)",
                letterSpacing: "1px",
              }}
            >
              ★재단장 기념 할인 행사!★
            </div>

            {/* 노란색 텍스트 */}
            <div
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                color: "#FFD966",
                textShadow: " 3px 3px 5px rgba(0, 0, 0, 1)",
                letterSpacing: "1px",
              }}
            >
              놀랍다 가격!
            </div>

            {/* 깜빡이는 효과 */}
          </div>

          {/* 팝업 하단 */}
          <div
            style={{
              backgroundColor: "#C0C0C0",
              padding: "10px",
              textAlign: "center",
              borderTop: "2px inset #C0C0C0",
              fontSize: "12px",
              color: "#666666",
            }}
          >
            <button
              onClick={() => setIsVisible(false)}
              style={{
                background: "linear-gradient(180deg, #FFFFFF 0%, #C0C0C0 100%)",
                border: "3px outset #C0C0C0",
                padding: "8px 20px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RetroPopup;
