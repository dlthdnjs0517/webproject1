import { Link } from "react-router-dom";
import React from "react";
import "./NotFoundPage.css";

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      {/* Tape 3 - 별도 위치 */}
      <div className="tape tape-3">
        <span className="text">
          위험 DANGER 危険 위험 DANGER 危険 위험 DANGER 危険 DANGER 危険
        </span>
      </div>

      {/* 다른 테이프들을 위한 컨테이너 */}
      <div className="tape-container">
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
      <div className="container">
        <div className="glitch" data-text="404">
          404
        </div>
        <div className="message">NOT ALLOWED</div>
        <Link to="/" className="home-link">
          RETURN HOME
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
