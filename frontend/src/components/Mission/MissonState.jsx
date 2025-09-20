import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// 오른쪽 페이지 데이터
const rightPageData = [
  {
    title: "기업이념",
    content: [
      "인류를 위한 더 나은 혁신,",
      "더 많은 생명을 위한 의약의 가치,",
      "내일의 비전을 실현합니다.",
    ],
  },
  {
    title: "핵심가치",
    content: [
      "혁신적인 연구개발로",
      "생명과학의 새로운 지평을",
      "열어나가겠습니다.",
    ],
  },
  {
    title: "미래비전",
    content: [
      "글로벌 헬스케어 리더로서",
      "인류 건강 증진에",
      "기여하겠습니다.",
    ],
  },
  {
    title: "사회적 책임",
    content: ["지속가능한 성장을 통해", "더 나은 세상을", "만들어가겠습니다."],
  },
];

export default function MissionState() {
  const containerRef = useRef(null);
  const rightSectionRef = useRef(null);
  const [currentRightPage, setCurrentRightPage] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isRightSectionActive, setIsRightSectionActive] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const rightSection = rightSectionRef.current;
    if (!container || !rightSection) return;

    let lastWheelTime = 0;
    const wheelThrottle = 300; // 스크롤 감도 조정

    // 오른쪽 섹션에서의 휠 이벤트 처리
    const handleRightSectionWheel = (e) => {
      if (!isRightSectionActive) return;

      e.preventDefault();
      e.stopPropagation(); // 이벤트 버블링 차단하여 전체 페이지 스크롤 방지

      const now = Date.now();

      // 스크롤 중이거나 너무 빠른 연속 스크롤 방지
      if (isScrolling || now - lastWheelTime < wheelThrottle) {
        return;
      }

      const deltaY = e.deltaY;
      console.log("[MissionState] 오른쪽 섹션 스크롤 감지:", deltaY);

      // 스크롤 방향 결정
      if (Math.abs(deltaY) < 10) return;
      const direction = deltaY > 0 ? 1 : -1; // 1: 아래, -1: 위
      const nextPage = currentRightPage + direction;

      // 페이지 범위 체크
      if (nextPage < 0) {
        console.log(
          "[MissionState] 첫 페이지에서 위로 스크롤 -> 이전 섹션 이동 신호"
        );
        // 첫 번째 페이지에서 위로 스크롤 시 home.jsx에 신호
        window.dispatchEvent(new CustomEvent("missionScrollUp"));
        return;
      }

      if (nextPage >= rightPageData.length) {
        console.log(
          "[MissionState] 마지막 페이지에서 아래로 스크롤 -> 다음 섹션 이동 신호"
        );
        // 마지막 페이지에서 아래로 스크롤 시 home.jsx에 신호
        window.dispatchEvent(new CustomEvent("missionScrollDown"));
        return;
      }

      // 오른쪽 페이지 전환 애니메이션
      animateRightPage(nextPage);
      lastWheelTime = now;
    };

    // 페이지 전환 애니메이션
    const animateRightPage = (newPageIndex) => {
      if (isScrolling) return;

      console.log(
        "[MissionState] 페이지 전환:",
        currentRightPage,
        "->",
        newPageIndex
      );
      setIsScrolling(true);
      setCurrentRightPage(newPageIndex);

      // 현재 페이지 fade out
      gsap.to(rightSection.children, {
        opacity: 0,
        y: -20,
        duration: 0.3,
        stagger: 0.05,
        onComplete: () => {
          // 새 페이지 fade in
          gsap.fromTo(
            rightSection.children,
            { opacity: 0, y: 20 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.1,
              ease: "power2.out",
              onComplete: () => {
                setIsScrolling(false);
              },
            }
          );
        },
      });
    };

    // 오른쪽 섹션 마우스 진입/이탈 처리
    const handleRightMouseEnter = () => {
      console.log("[MissionState] 오른쪽 섹션 활성화");
      setIsRightSectionActive(true);
    };

    const handleRightMouseLeave = () => {
      console.log("[MissionState] 오른쪽 섹션 비활성화");
      setIsRightSectionActive(false);
    };

    // 전체 컨테이너 휠 이벤트 (오른쪽 섹션이 활성화되지 않았을 때만)
    const handleContainerWheel = (e) => {
      if (isRightSectionActive) {
        // 오른쪽 섹션이 활성화되어 있으면 이벤트를 오른쪽으로 위임
        return;
      }

      // 오른쪽 섹션이 비활성화되어 있으면 전체 페이지 스크롤 허용
      console.log("[MissionState] 전체 페이지 스크롤 허용");
    };

    // 이벤트 리스너 등록
    rightSection.addEventListener("mouseenter", handleRightMouseEnter);
    rightSection.addEventListener("mouseleave", handleRightMouseLeave);
    rightSection.addEventListener("wheel", handleRightSectionWheel, {
      passive: false,
    });
    container.addEventListener("wheel", handleContainerWheel, {
      passive: true,
    });

    // 초기 애니메이션
    gsap.fromTo(
      rightSection.children,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
        delay: 0.3,
      }
    );

    return () => {
      rightSection.removeEventListener("mouseenter", handleRightMouseEnter);
      rightSection.removeEventListener("mouseleave", handleRightMouseLeave);
      rightSection.removeEventListener("wheel", handleRightSectionWheel);
      container.removeEventListener("wheel", handleContainerWheel);
    };
  }, [currentRightPage, isScrolling, isRightSectionActive]);

  const currentData = rightPageData[currentRightPage];

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-col md:flex-row relative overflow-hidden"
    >
      {/* 왼쪽 고정 섹션 (월 - Month) */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-12 relative">
        <div className="text-center">
          <h2 className="text-6xl md:text-8xl font-bold tracking-widest text-gray-800 mb-4">
            BEYOND
          </h2>
          <div className="w-16 h-1 bg-gray-400 mx-auto"></div>

          {/* 페이지 인디케이터 */}
          <div className="flex justify-center mt-8 space-x-2">
            {rightPageData.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentRightPage ? "bg-gray-700" : "bg-gray-300"
                }`}
              />
            ))}
          </div>

          {/* 왼쪽 섹션 설명 */}
          <div className="mt-8 text-gray-600 text-sm">
            <p>오른쪽 페이지를 넘겨보세요</p>
            <p className="text-xs mt-2">
              ({currentRightPage + 1}/{rightPageData.length})
            </p>
          </div>
        </div>
      </div>

      {/* 오른쪽 슬라이딩 섹션 (일 - Day) */}
      <div
        ref={rightSectionRef}
        className={`w-full md:w-1/2 bg-black text-white flex flex-col justify-center p-12 cursor-pointer transition-all duration-300 ${
          isRightSectionActive ? "ring-4 ring-blue-500 ring-opacity-50" : ""
        }`}
      >
        <div className="space-y-6">
          <h3 className="text-4xl md:text-5xl font-bold text-white">
            {currentData.title}
          </h3>
          {currentData.content.map((text, index) => (
            <p
              key={index}
              className="text-lg md:text-xl text-gray-300 leading-relaxed"
            >
              {text}
            </p>
          ))}

          {/* 스크롤 힌트 */}
          <div className="mt-12 text-gray-500 text-sm">
            <p
              className={`transition-colors duration-300 ${
                isRightSectionActive ? "text-blue-400" : "text-gray-500"
              }`}
            >
              {isRightSectionActive
                ? "🎯 활성화됨! 스크롤해보세요"
                : "마우스를 올려서 활성화하세요"}
            </p>
            <div className="flex items-center mt-2">
              <span>↕️ 스크롤</span>
              <span className="mx-2">|</span>
              <span>
                {currentRightPage + 1} / {rightPageData.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 페이지 전환 이펙트 */}
      <div
        className={`absolute right-0 top-0 w-1/2 h-full pointer-events-none transition-opacity duration-300 ${
          isScrolling ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-full h-full bg-gradient-to-r from-transparent to-white/10"></div>
      </div>

      {/* 오른쪽 섹션 활성화 표시 */}
      {isRightSectionActive && (
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-2 py-1 text-xs rounded-l-md">
          활성화됨
        </div>
      )}
    </div>
  );
}
