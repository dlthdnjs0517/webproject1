import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

// 페이지 컴포넌트들을 import 합니다.
import MainHeader from "../../components/MainHeader/MainHeader";
import CapsuleContent from "../../components/Capsule/CapsuleContent";
import MissionState from "../../components/Mission/MissonState";

// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export default function Home() {
  const mainRef = useRef(null);
  const currentSectionRef = useRef(0);
  const isPageAnimatingRef = useRef(false);
  const isCapsuleAnimationStartedRef = useRef(false);
  const isCapsuleAnimationCompleteRef = useRef(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // 스크롤바 숨기기
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      const sections = gsap.utils.toArray(".panel");
      const totalSections = sections.length;

      // 새로고침 시 첫 페이지로 이동
      gsap.set(window, { scrollTo: { y: 0 } });

      // 섹션으로 이동하는 함수 (GSAP scrollTo 사용)
      const goToSection = (index) => {
        if (isPageAnimatingRef.current || index < 0 || index >= totalSections) {
          console.log("[DEBUG] goToSection 차단:", {
            isAnimating: isPageAnimatingRef.current,
            index,
            totalSections,
          });
          return;
        }

        console.log("[DEBUG] goToSection 실행:", {
          from: currentSectionRef.current,
          to: index,
        });

        isPageAnimatingRef.current = true;
        currentSectionRef.current = index;

        // GSAP scrollTo를 사용하여 해당 섹션으로 부드럽게 이동
        gsap.to(window, {
          duration: 0.3,
          scrollTo: {
            y: sections[index],
            autoKill: false,
          },
          ease: "power2.inOut",
          onComplete: () => {
            isPageAnimatingRef.current = false;
            console.log("[DEBUG] 페이지 이동 완료");

            // 텍스트 애니메이션 (두 번째 페이지부터)
            if (index > 0) {
              const targetTimeline = gsap.timeline();
              gsap.set(sections[index].querySelectorAll(".section-animation"), {
                y: 50,
                opacity: 0,
              });
              targetTimeline.to(
                sections[index].querySelectorAll(".section-animation"),
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
          },
        });
      };

      // 캡슐 애니메이션 완료 리스너
      const handleCapsuleAnimationComplete = () => {
        console.log("home.jsx: 캡슐 애니메이션 완료 신호 받음");
        isCapsuleAnimationCompleteRef.current = true;
      };

      // 스크롤 이벤트 처리
      let lastScrollTime = 0;
      let isScrolling = false;
      const scrollThrottle = 300;

      const handleScroll = (direction) => {
        const now = Date.now();

        // 현재 상태 로그
        console.log("[DEBUG] 스크롤 이벤트:", {
          direction,
          currentSection: currentSectionRef.current,
          isPageAnimating: isPageAnimatingRef.current,
          isScrolling,
          isCapsuleStarted: isCapsuleAnimationStartedRef.current,
          isCapsuleComplete: isCapsuleAnimationCompleteRef.current,
          timeDiff: now - lastScrollTime,
        });

        // 페이지 애니메이션 중이거나 스크롤 중이면 무시
        if (
          isPageAnimatingRef.current ||
          isScrolling ||
          now - lastScrollTime < scrollThrottle
        ) {
          console.log("[DEBUG] 스크롤 무시");
          return;
        }

        isScrolling = true;
        lastScrollTime = now;

        if (direction === "down") {
          // 아래로 스크롤
          if (currentSectionRef.current === 0) {
            // 첫 번째 페이지에서의 스크롤 다운 처리
            if (!isCapsuleAnimationStartedRef.current) {
              // 첫 번째 스크롤: 캡슐 애니메이션 시작
              console.log("home.jsx: 첫 스크롤 -> 캡슐 애니메이션 시작");
              isCapsuleAnimationStartedRef.current = true;
              window.dispatchEvent(new CustomEvent("startCapsuleAnimation"));
            } else if (!isCapsuleAnimationCompleteRef.current) {
              // 두 번째 스크롤: 캡슐 애니메이션 스킵하고 바로 다음 페이지로 이동
              console.log(
                "home.jsx: 두 번째 스크롤 -> 애니메이션 스킵하고 바로 다음 페이지로"
              );
              window.dispatchEvent(new CustomEvent("skipCapsuleAnimation"));
              goToSection(1);
              isScrolling = false;
              return;
            } else {
              // 캡슐 애니메이션이 자연스럽게 완료된 후: 다음 페이지로 이동
              console.log(
                "home.jsx: 캡슐 애니메이션 완료 후 스크롤 -> 다음 페이지로 이동"
              );
              goToSection(1);
            }
          } else {
            // 다른 페이지에서는 바로 다음 페이지로 이동
            console.log(
              "[DEBUG] 다른 페이지에서 스크롤 다운:",
              currentSectionRef.current + 1
            );
            goToSection(currentSectionRef.current + 1);
          }
        } else if (direction === "up") {
          // 위로 스크롤
          if (currentSectionRef.current === 0) {
            // 첫 번째 페이지에서 위로 스크롤
            if (isCapsuleAnimationStartedRef.current) {
              console.log(
                "home.jsx: 첫 페이지에서 스크롤 업 -> 캡슐 애니메이션 역재생"
              );
              window.dispatchEvent(new CustomEvent("reverseCapsuleAnimation"));
              isCapsuleAnimationStartedRef.current = false;
              isCapsuleAnimationCompleteRef.current = false;
            } else {
              console.log(
                "home.jsx: 첫 페이지에서 스크롤 업 -> 아무 동작 없음"
              );
            }
          } else if (currentSectionRef.current > 0) {
            // 다른 페이지에서는 이전 페이지로 이동
            console.log(
              "[DEBUG] 다른 페이지에서 스크롤 업:",
              currentSectionRef.current - 1
            );
            goToSection(currentSectionRef.current - 1);

            // 첫 페이지로 돌아갈 때는 캡슐 상태 리셋
            if (currentSectionRef.current - 1 === 0) {
              console.log("home.jsx: 첫 페이지로 돌아가면서 캡슐 상태 리셋");
              isCapsuleAnimationStartedRef.current = false;
              isCapsuleAnimationCompleteRef.current = false;
            }
          }
        }

        // 스크롤 처리 완료
        setTimeout(() => {
          isScrolling = false;
          console.log("[DEBUG] 스크롤 처리 완료");
        }, 100);
      };

      // 휠 이벤트 처리
      const handleWheel = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const deltaY = e.deltaY;
        console.log("[DEBUG] Wheel event - deltaY:", deltaY);

        if (Math.abs(deltaY) < 10) {
          return;
        }

        const direction = deltaY > 0 ? "down" : "up";
        handleScroll(direction);
      };

      // 터치 이벤트 처리
      let touchStartY = 0;

      const handleTouchStart = (e) => {
        touchStartY = e.touches[0].clientY;
      };

      const handleTouchEnd = (e) => {
        if (!touchStartY) return;

        const touchEndY = e.changedTouches[0].clientY;
        const diff = touchStartY - touchEndY;

        if (Math.abs(diff) > 50) {
          const direction = diff > 0 ? "down" : "up";
          handleScroll(direction);
        }

        touchStartY = 0;
      };

      // 텍스트 애니메이션 초기 상태 설정
      sections.forEach((section, index) => {
        if (index > 0) {
          const animations = section.querySelectorAll(".section-animation");
          gsap.set(animations, {
            y: 50,
            opacity: 0,
          });
        }
      });

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
      window.addEventListener("missionScrollUp", () => {
        // 이전 섹션으로 이동
        goToPreviousSection();
      });

      window.addEventListener("missionScrollDown", () => {
        // 다음 섹션으로 이동
        goToNextSection();
      });

      // 정리 함수
      return () => {
        window.removeEventListener("wheel", handleWheel);
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchend", handleTouchEnd);
        window.removeEventListener(
          "capsuleAnimationComplete",
          handleCapsuleAnimationComplete
        );
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
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
