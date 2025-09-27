import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import "./ImageMarquee.css";

const ImageMarquee = () => {
  const marqueeRef = useRef(null);

  // 협력업체 로고 이미지 배열 - 실제 프로젝트에서는 PNG 파일 경로로 변경해주세요
  const partnerLogos = [
    "/images/partner1.png",
    "/images/partner2.png",
    "/images/partner3.png",
    "/images/partner4.png",
    "/images/partner5.png",
  ];

  useEffect(() => {
    const marquee = marqueeRef.current;

    if (marquee) {
      // 마키 애니메이션 (좌에서 우로 천천히)
      gsap.to(marquee, {
        x: "-50%",
        duration: 30,
        ease: "none",
        repeat: -1,
      });
    }
  }, []);

  return (
    <div className="partners-marquee-container section-animation">
      <div className="partners-content">
        <h2 className="partners-title section-animation">Our Partners</h2>
        <p className="partners-subtitle section-animation">
          함께 성장하는 파트너사
        </p>
      </div>

      {/* 협력업체 로고 마키 */}
      <div className="partners-marquee-wrapper">
        <div className="partners-marquee-track" ref={marqueeRef}>
          {/* 이미지를 두 번 복제하여 무한 스크롤 효과 */}
          {[...partnerLogos, ...partnerLogos].map((src, index) => (
            <div key={`partner-${index}`} className="partner-item">
              <img
                src={src}
                alt={`Partner ${index + 1}`}
                className="partner-logo"
                onError={(e) => {
                  // 이미지 로드 실패 시 플레이스홀더 표시
                  e.target.src =
                    "data:image/svg+xml,%3Csvg width='200' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='white' stroke='%23ddd' stroke-width='2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial, sans-serif' font-size='14' fill='%23666'%3EPartner Logo%3C/text%3E%3C/svg%3E";
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageMarquee;
