import React from "react";

// MissionState 컴포넌트는 오직 자신의 UI를 렌더링하는 역할만 담당합니다.
// 애니메이션 클래스명(section-animation)은 부모 컴포넌트(Home)에서 제어할 수 있도록 유지합니다.
export default function MissionState() {
  return (
    <div className="w-full h-full flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-12">
        <h2 className="section-animation text-5xl md:text-8xl font-bold tracking-widest text-gray-800">
          BEYOND
        </h2>
      </div>
      <div className="w-full md:w-1/2 bg-black text-white flex flex-col justify-center p-12">
        <div className="space-y-6">
          <h3 className="section-animation text-4xl md:text-5xl font-bold">
            기업이념
          </h3>
          <p className="section-animation text-lg md:text-xl text-gray-300 leading-relaxed">
            인류를 위한 더 나은 혁신,
          </p>
          <p className="section-animation text-lg md:text-xl text-gray-300 leading-relaxed">
            더 많은 생명을 위한 의약의 가치,
          </p>
          <p className="section-animation text-lg md:text-xl text-gray-300 leading-relaxed">
            내일의 비전을 실현합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
