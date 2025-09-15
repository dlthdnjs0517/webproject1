import React from "react";
import { Link } from "react-router-dom";
import "./NotFoundPage.css"; // CSS 파일 import

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center overflow-hidden text-center relative not-found-container">
      {/* Tape 3 - 별도 위치 */}
      <div className="tape tape-3">
        <span className="text">
          위험 DANGER 危険 위험 DANGER 危険 위험 DANGER 危険 DANGER 危険
        </span>
      </div>

      {/* 다른 테이프들을 위한 컨테이너 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-20 pointer-events-none">
        <div className="tape tape-1">
          <span className="text">
            접근금지 KEEP OUT 立入禁止 접근금지 KEEP OUT 立入禁止 접근금지 KEEP
            OUT 立入禁止
          </span>
        </div>
        <div className="tape tape-2">
          <span className="text">
            NO ENTRY 관계자외 출입금지 闲人免进 NO ENTRY 관계자외 출입금지
            闲人免进
          </span>
        </div>
        <div className="tape tape-4">
          <span className="text">
            危险 DANGER 危険 危险 DANGER 危険 危险 DANGER 危険 危险 DANGER 危険
          </span>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="relative z-10">
        <div className="glitch" data-text="404">
          404
        </div>
        <div className="text-2xl mt-[-2rem] mb-8 tracking-widest font-bold not-found-message">
          PAGE NOT FOUND
        </div>
        <Link
          to="/"
          className="inline-block py-3 px-6 border-2 border-white text-white no-underline font-bold transition-all duration-300 hover:bg-white hover:text-black not-found-link"
        >
          RETURN HOME
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
