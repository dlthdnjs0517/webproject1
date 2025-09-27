import React, { useEffect, useState } from "react";

const CombinedEffect = ({ employee, onComplete, onRabbitPhase }) => {
  const [phase, setPhase] = useState("text"); // 'text' | 'rabbit' | 'done'
  const [displayedText, setDisplayedText] = useState("");

  const fullText = "착 한 아 이";

  // phase가 'rabbit'으로 변경될 때 부모에게 알림
  useEffect(() => {
    if (phase === "rabbit") {
      onRabbitPhase?.(true);
    } else {
      onRabbitPhase?.(false);
    }
  }, [phase, onRabbitPhase]);

  useEffect(() => {
    if (!employee) {
      setDisplayedText("");
      setPhase("text");
      return;
    }

    // 텍스트 타이핑 효과
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 200); // 300ms마다 한 글자씩

    // 1단계: 텍스트 2초 (타이핑 완료 후 대기시간 포함)
    const textTimer = setTimeout(() => {
      setPhase("rabbit");
    }, 2000);

    // 2단계: 토끼 2초 (총 4초 후)
    const rabbitTimer = setTimeout(() => {
      setPhase("done");
      setDisplayedText("");
      onComplete();
    }, 4000);

    return () => {
      clearInterval(typingInterval);
      clearTimeout(textTimer);
      clearTimeout(rabbitTimer);
    };
  }, [employee, onComplete]);

  if (!employee) return null;

  return (
    <>
      {/* 텍스트 오버레이 */}
      {phase === "text" && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        >
          <div className="text-center">
            <h1 className="text-6xl font-bold text-blue-500">
              {displayedText}
              <span className="animate-pulse">|</span>
            </h1>
          </div>
        </div>
      )}
    </>
  );
};

export default CombinedEffect;
