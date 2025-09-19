import React, { useLayoutEffect, useRef } from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// 페이지 컴포넌트들을 import 합니다.
import MainHeader from "../../components/MainHeader/MainHeader";
import CapsuleContent from "../../components/Capsule/CapsuleContent";
import MissionState from "../../components/Mission/MissonState";

// GSAP 플러그인을 등록합니다.
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Home() {
  const mainRef = useRef(null);

  useLayoutEffect(() => {
    // 새로고침 시 스크롤을 맨 위로 이동하여 첫 페이지 상태로 초기화
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray(".panel");

      let currentSection = 0;
      let isPageAnimating = false;
      let isCapsuleAnimationStarted = false;
      let isCapsuleAnimationComplete = false; // 캡슐 애니메이션 완료 상태

      // 특정 섹션으로 스크롤하는 함수
      const goToSection = (index, duration = 1.2) => {
        if (isPageAnimating || index < 0 || index >= sections.length) return;

        isPageAnimating = true;
        currentSection = index;

        gsap.to(window, {
          scrollTo: { y: sections[index], autoKill: false },
          duration: duration,
          ease: "power3.inOut",
          onComplete: () => {
            isPageAnimating = false;
          },
        });

        // 두 번째 페이지부터는 텍스트 페이드인 애니메이션을 적용
        if (index > 0) {
          gsap.fromTo(
            sections[index].querySelectorAll(".section-animation"),
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              stagger: 0.2,
              ease: "power2.out",
              delay: 0.4,
            }
          );
        }
      };

      // 캡슐 애니메이션 완료 리스너
      const handleCapsuleAnimationComplete = () => {
        console.log("home.jsx: 캡슐 애니메이션 완료 신호 받음");
        isCapsuleAnimationComplete = true;
        // 자동으로 다음 페이지로 이동하지 않음
        // 사용자가 다음 스크롤을 해야 페이지 이동
      };

      // 스크롤 이벤트 처리
      let lastScrollTime = 0;
      let isScrolling = false; // 스크롤 처리 중 플래그
      const scrollThrottle = 1000; // 스크롤 이벤트 쓰로틀링 (1초)

      const handleScroll = (direction) => {
        const now = Date.now();

        // 이미 스크롤 처리 중이거나 쓰로틀링 시간 내라면 무시
        if (isScrolling || now - lastScrollTime < scrollThrottle) {
          console.log("[DEBUG] 스크롤 무시:", {
            isScrolling,
            timeDiff: now - lastScrollTime,
          });
          return;
        }

        isScrolling = true; // 스크롤 처리 시작
        lastScrollTime = now;

        console.log("[DEBUG] 스크롤 처리 시작:", direction);

        if (direction === "down") {
          // 아래로 스크롤
          if (currentSection === 0) {
            // 첫 번째 페이지에서의 스크롤 다운 처리
            if (!isCapsuleAnimationStarted) {
              // 첫 번째 스크롤: 캡슐 애니메이션 시작
              console.log("home.jsx: 첫 스크롤 -> 캡슐 애니메이션 시작");
              isCapsuleAnimationStarted = true;
              window.dispatchEvent(new CustomEvent("startCapsuleAnimation"));
            } else if (!isCapsuleAnimationComplete) {
              // 두 번째 스크롤: 캡슐 애니메이션 스킵
              console.log("home.jsx: 두 번째 스크롤 -> 캡슐 애니메이션 스킵");
              window.dispatchEvent(new CustomEvent("skipCapsuleAnimation"));
              // 스킵 후 바로 다음 페이지로 이동
              setTimeout(() => {
                if (currentSection === 0) {
                  // 여전히 첫 페이지에 있다면
                  goToSection(1);
                  isScrolling = false; // 스크롤 처리 완료
                }
              }, 500);
              return; // 여기서 리턴하여 아래 isScrolling = false 실행 방지
            } else {
              // 캡슐 애니메이션이 자연스럽게 완료된 후: 다음 페이지로 이동
              console.log(
                "home.jsx: 캡슐 애니메이션 완료 후 스크롤 -> 다음 페이지로 이동"
              );
              goToSection(1);
            }
          } else {
            // 다른 페이지에서는 바로 다음 페이지로 이동
            goToSection(currentSection + 1);
          }
        } else if (direction === "up") {
          // 위로 스크롤: 이전 페이지로 이동
          if (currentSection > 0) {
            goToSection(currentSection - 1);
            // 첫 페이지로 돌아갈 때는 캡슐 상태 리셋
            if (currentSection - 1 === 0) {
              isCapsuleAnimationStarted = false;
              isCapsuleAnimationComplete = false;
            }
          }
        }

        // 스크롤 처리 완료 (타이머로 안전하게 해제)
        setTimeout(() => {
          isScrolling = false;
          console.log("[DEBUG] 스크롤 처리 완료");
        }, 100);
      };

      // ScrollTrigger 대신 직접 wheel과 touch 이벤트 처리
      const handleWheel = (e) => {
        e.preventDefault();

        // deltaY 값으로 스크롤 방향과 강도 확인
        const deltaY = e.deltaY;
        console.log("[DEBUG] Wheel event - deltaY:", deltaY);

        // 너무 작은 델타값은 무시 (민감도 조절)
        if (Math.abs(deltaY) < 10) {
          console.log("[DEBUG] 델타값이 너무 작아서 무시:", deltaY);
          return;
        }

        const direction = deltaY > 0 ? "down" : "up";
        handleScroll(direction);
      };

      const handleTouchStart = (e) => {
        window.touchStartY = e.touches[0].clientY;
      };

      const handleTouchEnd = (e) => {
        if (!window.touchStartY) return;

        const touchEndY = e.changedTouches[0].clientY;
        const diff = window.touchStartY - touchEndY;

        if (Math.abs(diff) > 50) {
          // 최소 50px 이동해야 스크롤로 인식
          const direction = diff > 0 ? "down" : "up";
          handleScroll(direction);
        }

        window.touchStartY = null;
      };

      // 이벤트 리스너 등록
      window.addEventListener("wheel", handleWheel, { passive: false });
      window.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      window.addEventListener("touchend", handleTouchEnd, { passive: true });
      window.addEventListener(
        "capsuleAnimationComplete",
        handleCapsuleAnimationComplete
      );

      // 정리 함수
      return () => {
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener(
          "capsuleAnimationComplete",
          handleCapsuleAnimationComplete
        );
      };
    }, mainRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <MainHeader />
      <div ref={mainRef}>
        <div className="panel h-screen w-screen">
          <CapsuleContent />
        </div>
        <section className="panel w-screen h-screen">
          <MissionState />
        </section>
        <section className="panel h-screen w-screen flex items-center justify-center bg-gray-100">
          <p className="section-animation text-2xl text-gray-500">
            More content can go here.
          </p>
        </section>
      </div>
    </>
  );
}
