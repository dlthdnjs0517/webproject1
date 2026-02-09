import React, { useState } from "react";

/**
 * 서버가 깨우는 동안(콜드 스타트) 사용자에게 미리 안내를 띄우는 팝업
 * - 완전히 프론트엔드 전용이므로 백엔드 응답과 상관없이 바로 렌더링됩니다.
 */
const ServerNotice = () => {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          maxWidth: "420px",
          width: "90%",
          backgroundColor: "white",
          borderRadius: "16px",
          padding: "20px 22px 18px",
          boxShadow: "0 18px 45px rgba(15, 23, 42, 0.38)",
          fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "18px",
            fontWeight: 700,
            marginBottom: "10px",
            color: "#0f172a",
          }}
        >
          ⚠️ 서비스 안내
        </div>

        <p
          style={{
            fontSize: "14px",
            lineHeight: 1.6,
            color: "#475569",
            marginBottom: "8px",
          }}
        >
          첫 접속 시 서버를 깨우는 데 시간이 조금 걸려
          <br />
          메뉴가 바로 보이지 않을 수 있습니다.
        </p>
        <p
          style={{
            fontSize: "13px",
            lineHeight: 1.6,
            color: "#64748b",
            marginBottom: "16px",
          }}
        >
          잠시만 기다려 주시면 자동으로 메뉴가 로딩되니
          <br />
          5~10초 정도 여유를 두고 이용해 주세요. 🙏
        </p>

        <button
          onClick={() => setIsOpen(false)}
          style={{
            width: "100%",
            border: "none",
            borderRadius: "999px",
            padding: "10px 0",
            fontSize: "14px",
            fontWeight: 600,
            background:
              "linear-gradient(135deg, rgba(59,130,246,1) 0%, rgba(56,189,248,1) 50%, rgba(45,212,191,1) 100%)",
            color: "white",
            cursor: "pointer",
            boxShadow: "0 10px 25px rgba(59,130,246,0.35)",
          }}
        >
          확인했어요
        </button>
      </div>
    </div>
  );
};

export default ServerNotice;

