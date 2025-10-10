import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="simple-footer-container">
      <div className="simple-footer-content">
        {/* 메인 정보 */}
        <div className="footer-main section-animation">
          <div className="company-info">
            <h3 className="company-name">백일몽 주식회사</h3>
            <p className="company-description">BEYOND INNOVATION MEDICINE</p>
          </div>

          <div className="contact-summary">
            <div className="contact-item">
              <span className="contact-label">글씨체</span>
              <span className="contact-value1">둥근모꼴+Fixedsys</span>
              <span className="contact-value">Kopub 돋움</span>
            </div>
            <div className="contact-item">
              <span className="contact-label">아이콘</span>
              <span className="contact-value">
                <Link
                  to="https://www.flaticon.com/kr/free-icons/"
                  title="토끼 아이콘"
                >
                  토끼 아이콘 제작자: Freepik - Flaticon
                </Link>
              </span>
            </div>
            <div className="contact-item">
              <span className="contact-label">고객센터</span>
              <span className="contact-value">
                1588-1234 (평일 09:00-18:00)
              </span>
            </div>
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="footer-bottom section-animation">
          <div className="footer-links">
            <a href="#privacy" className="footer-link">
              개인정보처리방침
            </a>
            <span className="divider">|</span>
            <a href="#terms" className="footer-link">
              이용약관
            </a>
            <span className="divider">|</span>
            <a href="#ethics" className="footer-link">
              윤리경영
            </a>
            <span className="divider">|</span>
            <a href="#contact" className="footer-link">
              고객지원
            </a>
          </div>

          <div className="copyright">
            <p>
              © {currentYear} Beyond Innovation Medicine. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
