import React, { useRef, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel, Keyboard, Controller } from "swiper/modules";

// Swiper styles
import "swiper/css";

// 페이지 컴포넌트들
import MainHeader from "../../components/MainHeader/MainHeader";
import CapsuleContent from "../../components/Capsule/CapsuleContent";
import MissionState from "../../components/Mission/MissonState";

export default function Home() {
  const swiperRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCapsuleAnimationStarted, setIsCapsuleAnimationStarted] =
    useState(false);
  const [isCapsuleAnimationComplete, setIsCapsuleAnimationComplete] =
    useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // 캡슐 애니메이션 완료 리스너
    const handleCapsuleAnimationComplete = () => {
      console.log("캡슐 애니메이션 완료");
      setIsCapsuleAnimationComplete(true);
    };

    // MissionState 스크롤 신호 처리
    const handleMissionScrollUp = () => {
      if (currentSlide === 1 && swiperRef.current) {
        swiperRef.current.slideTo(0);
      }
    };

    const handleMissionScrollDown = () => {
      if (currentSlide === 1 && swiperRef.current) {
        swiperRef.current.slideTo(2);
      }
    };

    // 전역 휠 이벤트 처리 (첫 페이지용)
    const handleGlobalWheel = (event) => {
      // 첫 페이지가 아니거나 전환 중이면 무시
      if (currentSlide !== 0 || isTransitioning) {
        console.log(
          "[Global Wheel] 무시 - currentSlide:",
          currentSlide,
          "isTransitioning:",
          isTransitioning
        );
        return;
      }

      const deltaY = event.deltaY;

      // 스크롤 임계값 - 트랙패드와 마우스 휠 모두 고려
      if (Math.abs(deltaY) < 30) return; // 30으로 조정

      console.log(
        "[Global Wheel] 처리 중 - deltaY:",
        deltaY,
        "애니메이션 상태:",
        {
          started: isCapsuleAnimationStarted,
          complete: isCapsuleAnimationComplete,
        }
      );

      if (deltaY > 0) {
        // 아래로 스크롤 - 60 이상의 스크롤만 허용 (기존 80에서 조정)
        if (deltaY < 60) {
          console.log("스크롤이 너무 약함 (deltaY:", deltaY, ") - 무시");
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (!isCapsuleAnimationStarted) {
          console.log("첫 스크롤 -> 캡슐 애니메이션 시작");
          setIsCapsuleAnimationStarted(true);
          window.dispatchEvent(new CustomEvent("startCapsuleAnimation"));
        } else if (!isCapsuleAnimationComplete) {
          console.log("두 번째 스크롤 -> 애니메이션 스킵하고 다음 페이지");
          window.dispatchEvent(new CustomEvent("skipCapsuleAnimation"));
          if (swiperRef.current) {
            swiperRef.current.slideNext();
          }
        } else {
          console.log("캡슐 애니메이션 완료 후 -> 다음 페이지");
          if (swiperRef.current) {
            swiperRef.current.slideNext();
          }
        }
      } else if (deltaY < 0) {
        // 위로 스크롤 - 40 이하의 스크롤만 허용 (기존 -50에서 조정)
        if (deltaY > -40) {
          console.log("위로 스크롤이 너무 약함 (deltaY:", deltaY, ") - 무시");
          return;
        }

        event.preventDefault();
        event.stopPropagation();

        console.log("위로 스크롤 감지! -> 캡슐 애니메이션 역재생");

        // 애니메이션 상태와 관계없이 reverse 실행
        window.dispatchEvent(new CustomEvent("reverseCapsuleAnimation"));

        // 상태 초기화
        setIsCapsuleAnimationStarted(false);
        setIsCapsuleAnimationComplete(false);
      }
    };

    // 이벤트 리스너 등록
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
  }, [
    currentSlide,
    isCapsuleAnimationStarted,
    isCapsuleAnimationComplete,
    isTransitioning,
  ]);

  const handleSlideChange = (swiper) => {
    const newIndex = swiper.activeIndex;
    console.log("슬라이드 변경:", currentSlide, "->", newIndex);

    setCurrentSlide(newIndex);

    // 첫 페이지로 돌아갈 때 캡슐 상태 리셋
    if (newIndex === 0) {
      setIsCapsuleAnimationStarted(false);
      setIsCapsuleAnimationComplete(false);
    }
  };

  const handleTransitionStart = () => {
    console.log("전환 시작");
    setIsTransitioning(true);
  };

  const handleTransitionEnd = () => {
    console.log("전환 완료");
    setIsTransitioning(false);
  };

  // Swiper 초기화 후 첫 페이지에서는 mousewheel 비활성화
  const handleSwiperInit = (swiper) => {
    swiperRef.current = swiper;

    // 첫 페이지에서는 Swiper의 mousewheel을 비활성화
    if (currentSlide === 0) {
      swiper.mousewheel.disable();
    }
  };

  // 슬라이드 변경 시 mousewheel 활성화/비활성화
  useEffect(() => {
    if (swiperRef.current) {
      if (currentSlide === 0) {
        // 첫 페이지에서는 Swiper mousewheel 비활성화 (커스텀 처리)
        swiperRef.current.mousewheel.disable();
      } else {
        // 다른 페이지에서는 Swiper mousewheel 활성화
        swiperRef.current.mousewheel.enable();
      }
    }
  }, [currentSlide]);

  return (
    <>
      <MainHeader />
      <Swiper
        modules={[Mousewheel, Keyboard, Controller]}
        direction="vertical"
        slidesPerView={1}
        speed={600}
        mousewheel={{
          enabled: false, // 초기에는 비활성화 (첫 페이지 커스텀 처리를 위해)
          thresholdDelta: 50,
          forceToAxis: true,
        }}
        keyboard={{
          enabled: true,
        }}
        allowTouchMove={currentSlide !== 0} // 첫 페이지에서는 터치도 비활성화
        onSwiper={handleSwiperInit}
        onSlideChange={handleSlideChange}
        onTransitionStart={handleTransitionStart}
        onTransitionEnd={handleTransitionEnd}
        style={{ height: "100vh" }}
        className="main-swiper"
      >
        {/* 첫 번째 슬라이드 - 캡슐 페이지 */}
        <SwiperSlide>
          <div className="relative w-full h-full">
            <CapsuleContent />

            {/* 첫 페이지 디버그 정보 - deltaY 추가 */}
            {/* {process.env.NODE_ENV === "development" && (
              <div className="absolute top-4 left-4 text-xs text-white bg-black bg-opacity-70 p-3 rounded space-y-1">
                <p>
                  <strong>현재 슬라이드:</strong> {currentSlide}
                </p>
                <p>
                  <strong>애니메이션 시작:</strong>{" "}
                  {isCapsuleAnimationStarted ? "Yes" : "No"}
                </p>
                <p>
                  <strong>애니메이션 완료:</strong>{" "}
                  {isCapsuleAnimationComplete ? "Yes" : "No"}
                </p>
                <p>
                  <strong>전환 중:</strong> {isTransitioning ? "Yes" : "No"}
                </p>
                <p>
                  <strong>스크롤 임계값:</strong> 아래 60+, 위 40+
                </p>
                <p className="text-yellow-300">
                  <strong>테스트:</strong> 강하게 스크롤해보세요
                </p>
              </div>
            )} */}
          </div>
        </SwiperSlide>

        {/* 두 번째 슬라이드 - 미션 페이지 */}
        <SwiperSlide>
          <MissionState />
        </SwiperSlide>

        {/* 세 번째 슬라이드 - 추가 컨텐츠 */}
        <SwiperSlide>
          <div className="h-screen w-screen flex items-center justify-center bg-gray-100 relative">
            <div className="text-center">
              <p className="text-2xl text-gray-500 mb-4">
                More content can go here.
              </p>
              <p className="text-sm text-gray-400">
                위로 스크롤하면 이전 페이지로
              </p>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <style jsx>{`
        .main-swiper {
          --swiper-theme-color: transparent;
        }

        /* 스크롤바 숨기기 */
        body {
          overflow: hidden;
        }
      `}</style>
    </>
  );
}
