import React, { useRef, useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard } from "swiper/modules";
import "swiper/css";

// 페이지 컴포넌트들
import MainHeader from "../../components/MainHeader/MainHeader";
import CapsuleContent from "./CapsuleContent";
import MissionState from "./MissonState";
import RetroPopup from "../../components/Popup/RetroPopup";
import ImageMarquee from "./ImageMarquee";
import Footer from "../../components/Footer/Footer";

export default function Home() {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [capsuleState, setCapsuleState] = useState({
    started: false,
    complete: false,
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { role } = useSelector((state) => state.auth);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // 첫 페이지 스크롤 처리를 위한 ref
  const scrollAccumulator = useRef(0);
  const lastScrollTime = useRef(0);
  const isProcessing = useRef(false); // 스크롤 처리 중 플래그 추가
  const lastScrollDirection = useRef(null); // 마지막 스크롤 방향 추적

  // 캡슐 상태 리셋
  const resetCapsuleState = useCallback(() => {
    setCapsuleState({ started: false, complete: false });
    scrollAccumulator.current = 0;
    isProcessing.current = false; // 처리 플래그도 리셋
  }, []);

  // 첫 페이지 스크롤 처리
  const handleFirstPageScroll = useCallback(
    (deltaY) => {
      const now = Date.now();
      const SCROLL_THRESHOLD = 80; // 임계값을 다시 80으로 조정
      const COOLDOWN = 800; // 쿨다운을 800ms로 증가 (중요!)

      console.log(
        "[첫페이지] 스크롤:",
        deltaY,
        "누적:",
        scrollAccumulator.current,
        "처리중:",
        isProcessing.current
      );

      // 이미 처리 중이면 무시
      if (isProcessing.current) {
        console.log("[첫페이지] 이미 처리 중 - 무시");
        return false;
      }

      // 쿨다운 체크
      if (now - lastScrollTime.current < COOLDOWN) {
        console.log("[첫페이지] 쿨다운 중 - 무시");
        return false;
      }

      // 스크롤 누적
      scrollAccumulator.current += deltaY;

      // 위로 스크롤 (reverse)
      if (scrollAccumulator.current < -SCROLL_THRESHOLD) {
        if (capsuleState.started) {
          console.log("캡슐 애니메이션 역재생 시작");
          isProcessing.current = true; // 처리 시작
          window.dispatchEvent(new CustomEvent("reverseCapsuleAnimation"));
          resetCapsuleState();
          lastScrollTime.current = now;

          // 1초 후 처리 플래그 해제
          setTimeout(() => {
            isProcessing.current = false;
          }, 1000);
        }
        return true;
      }

      // 아래로 스크롤
      if (scrollAccumulator.current > SCROLL_THRESHOLD) {
        isProcessing.current = true; // 처리 시작

        if (!capsuleState.started) {
          console.log("캡슐 애니메이션 시작");
          setCapsuleState((prev) => ({ ...prev, started: true }));
          window.dispatchEvent(new CustomEvent("startCapsuleAnimation"));
        } else if (!capsuleState.complete) {
          console.log("캡슐 애니메이션 스킵하고 다음 페이지");
          window.dispatchEvent(new CustomEvent("skipCapsuleAnimation"));
          swiperRef.current?.slideNext();
        } else {
          console.log("다음 페이지로 이동");
          swiperRef.current?.slideNext();
        }

        scrollAccumulator.current = 0;
        lastScrollTime.current = now;

        // 1초 후 처리 플래그 해제
        setTimeout(() => {
          isProcessing.current = false;
        }, 1000);

        return true;
      }

      return false;
    },
    [capsuleState, resetCapsuleState]
  );

  // Swiper mousewheel 동적 제어
  useEffect(() => {
    if (swiperRef.current) {
      if (currentSlide === 0) {
        // 첫 페이지에서는 Swiper mousewheel 비활성화
        swiperRef.current.mousewheel.disable();
        console.log("첫 페이지 - Swiper mousewheel 비활성화");
      } else {
        // 다른 페이지에서는 Swiper mousewheel 활성화
        swiperRef.current.mousewheel.enable();
        console.log("페이지", currentSlide + 1, "- Swiper mousewheel 활성화");
      }
    }
  }, [currentSlide]);

  // 이벤트 리스너들
  useEffect(() => {
    const handleCapsuleAnimationComplete = () => {
      console.log("캡슐 애니메이션 완료");
      setCapsuleState((prev) => ({ ...prev, complete: true }));
    };

    const handleMissionScrollUp = () => {
      if (currentSlide === 1) swiperRef.current?.slideTo(0);
    };

    const handleMissionScrollDown = () => {
      if (currentSlide === 1) swiperRef.current?.slideTo(2);
    };

    // 전역 wheel 이벤트로 첫 페이지 처리
    const handleGlobalWheel = (event) => {
      // 첫 페이지가 아니거나 전환 중이면 무시
      if (currentSlide !== 0 || isTransitioning) return;

      // 첫 페이지에서만 처리
      event.preventDefault();
      event.stopPropagation();

      const handled = handleFirstPageScroll(event.deltaY);
      console.log("[Global Wheel] 첫 페이지 스크롤 처리됨:", handled);
    };

    window.addEventListener(
      "capsuleAnimationComplete",
      handleCapsuleAnimationComplete
    );
    window.addEventListener("missionScrollUp", handleMissionScrollUp);
    window.addEventListener("missionScrollDown", handleMissionScrollDown);
    window.addEventListener("wheel", handleGlobalWheel, { passive: false });

    return () => {
      window.removeEventListener(
        "capsuleAnimationComplete",
        handleCapsuleAnimationComplete
      );
      window.removeEventListener("missionScrollUp", handleMissionScrollUp);
      window.removeEventListener("missionScrollDown", handleMissionScrollDown);
      window.removeEventListener("wheel", handleGlobalWheel);
    };
  }, [currentSlide, isTransitioning, handleFirstPageScroll]);

  // Swiper 이벤트 핸들러들
  const handleSlideChange = (swiper) => {
    const newIndex = swiper.activeIndex;
    console.log("슬라이드 변경:", currentSlide, "->", newIndex);
    setCurrentSlide(newIndex);

    if (newIndex === 0) {
      resetCapsuleState();
    }

    // 🔥 핵심 수정사항: 슬라이드 변경 시 스크롤 누적값 무조건 리셋
    scrollAccumulator.current = 0;
  };

  // 커스텀 mousewheel 처리 (첫 페이지 전용)
  const handleMousewheel = (swiper, event) => {
    // 첫 페이지가 아니면 Swiper 기본 동작 허용
    if (currentSlide !== 0 || isTransitioning) {
      return; // Swiper가 처리
    }

    // 첫 페이지에서만 커스텀 처리
    event.preventDefault();
    event.stopPropagation();

    const handled = handleFirstPageScroll(event.deltaY);
    return handled;
  };

  return (
    <>
      <MainHeader />
      <Swiper
        modules={[Mousewheel, Keyboard]}
        direction="vertical"
        slidesPerView={1}
        speed={400} // 600 → 400으로 더 빠르게
        mousewheel={{
          enabled: true,
          thresholdDelta: 20, // 더 민감하게
          thresholdTime: 300, // 더 짧은 시간 임계값
          forceToAxis: true,
          releaseOnEdges: false,
          sensitivity: 2, // 감도 증가
        }}
        touchRatio={1.5} // 터치 감도 증가
        threshold={10} // 터치 임계값 감소
        keyboard={{ enabled: true }}
        allowTouchMove={true}
        resistanceRatio={0}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          console.log("Swiper 초기화됨");
        }}
        onSlideChange={handleSlideChange}
        onTransitionStart={() => setIsTransitioning(true)}
        onTransitionEnd={() => setIsTransitioning(false)}
        style={{ height: "100vh" }}
        className="main-swiper"
      >
        <SwiperSlide>
          <CapsuleContent />
        </SwiperSlide>

        <SwiperSlide>
          <MissionState />
        </SwiperSlide>

        <SwiperSlide>
          <section className="panel h-screen w-screen flex flex-col">
            {/* 파란색 영역 - 협력업체 마키 */}
            <div className="h-1/2 bg-blue-400">
              <ImageMarquee />
            </div>

            {/* 노란색 영역 - 푸터 */}
            <div className="h-1/2 bg-yellow-300">
              <Footer />
            </div>
          </section>
        </SwiperSlide>
      </Swiper>
      {role === "character" && <RetroPopup isLoggedIn={isLoggedIn} />}

      <style>{`
        body { overflow: hidden; }
        .main-swiper { --swiper-theme-color: transparent; }
      `}</style>
    </>
  );
}
