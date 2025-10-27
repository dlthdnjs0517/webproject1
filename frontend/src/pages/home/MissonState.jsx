import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
// import TextBackground from "./GlassText";

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

function MissionState() {
  const containerRef = useRef(null);
  const rightSectionRef = useRef(null);
  const [currentRightPage, setCurrentRightPage] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isRightSectionActive, setIsRightSectionActive] = useState(false);

  const lastWheelTimeRef = useRef(0);
  const currentRightPageRef = useRef(0);
  const isScrollingRef = useRef(false);
  const isRightSectionActiveRef = useRef(false);

  useEffect(() => {
    currentRightPageRef.current = currentRightPage;
  }, [currentRightPage]);

  useEffect(() => {
    isScrollingRef.current = isScrolling;
  }, [isScrolling]);

  useEffect(() => {
    isRightSectionActiveRef.current = isRightSectionActive;
  }, [isRightSectionActive]);

  // 페이지 전환 애니메이션
  const animateRightPage = (newPageIndex) => {
    const rightSection = rightSectionRef.current;
    if (!rightSection || isScrollingRef.current) return;

    console.log(
      "[MissionState] 페이지 전환:",
      currentRightPageRef.current,
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

  useEffect(() => {
    const container = containerRef.current;
    const rightSection = rightSectionRef.current;
    if (!container || !rightSection) return;

    const wheelThrottle = 300; // 스크롤 감도 조정

    // 오른쪽 섹션에서의 휠 이벤트 처리
    const handleRightSectionWheel = (e) => {
      if (!isRightSectionActiveRef.current) return;

      e.preventDefault();
      e.stopPropagation(); // 이벤트 버블링 차단하여 전체 페이지 스크롤 방지

      const now = Date.now();

      // 스크롤 중이거나 너무 빠른 연속 스크롤 방지
      if (
        isScrollingRef.current ||
        now - lastWheelTimeRef.current < wheelThrottle
      ) {
        return;
      }

      const deltaY = e.deltaY;

      // 스크롤 방향 결정
      if (Math.abs(deltaY) < 10) return;
      const direction = deltaY > 0 ? 1 : -1; // 1: 아래, -1: 위
      const nextPage = currentRightPageRef.current + direction;

      // 페이지 범위 체크
      if (nextPage < 0) {
        // 첫 번째 페이지에서 위로 스크롤 시 home.jsx에 신호
        window.dispatchEvent(new CustomEvent("missionScrollUp"));
        return;
      }

      if (nextPage >= rightPageData.length) {
        // 마지막 페이지에서 아래로 스크롤 시 home.jsx에 신호
        window.dispatchEvent(new CustomEvent("missionScrollDown"));
        return;
      }

      // 오른쪽 페이지 전환 애니메이션
      animateRightPage(nextPage);
      lastWheelTimeRef.current = now;
    };

    // 오른쪽 섹션 마우스 진입/이탈 처리
    const handleRightMouseEnter = () => {
      setIsRightSectionActive(true);
    };

    const handleRightMouseLeave = () => {
      setIsRightSectionActive(false);
    };

    // 전체 컨테이너 휠 이벤트 (오른쪽 섹션이 활성화되지 않았을 때만)
    const handleContainerWheel = (e) => {
      if (isRightSectionActiveRef.current) {
        // 오른쪽 섹션이 활성화되어 있으면 이벤트를 오른쪽으로 위임
        return;
      }
      // 오른쪽 섹션이 비활성화되어 있으면 전체 페이지 스크롤 허용
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

    return () => {
      rightSection.removeEventListener("mouseenter", handleRightMouseEnter);
      rightSection.removeEventListener("mouseleave", handleRightMouseLeave);
      rightSection.removeEventListener("wheel", handleRightSectionWheel);
      container.removeEventListener("wheel", handleContainerWheel);
    };
  }, []);

  useEffect(() => {
    const rightSection = rightSectionRef.current;
    if (!rightSection) return;

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
  }, [currentRightPage]);

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
        </div>
      </div>

      {/* 오른쪽 슬라이딩 섹션 (일 - Day) */}
      <div
        ref={rightSectionRef}
        className=" relative w-full md:w-1/2 bg-black text-white flex flex-col justify-center p-12 cursor-pointer transition-all duration-300 "
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
        </div>
        {/* 페이지 인디케이터 */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {rightPageData.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentRightPage ? "bg-white" : "bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      {/* 페이지 전환 이펙트 */}
      <div
        className={`absolute right-0 top-0 w-1/2 h-full pointer-events-none transition-all duration-600 ${
          isScrolling ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="w-full h-full relative overflow-hidden">
          <div
            className={`absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-blue-500/40 transform transition-transform duration-1000 ${
              isScrolling
                ? "skew-x-12 translate-x-0"
                : "skew-x-0 -translate-x-full"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default MissionState;
