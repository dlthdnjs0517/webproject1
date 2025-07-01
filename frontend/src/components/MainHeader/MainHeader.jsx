import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import "./MainHeader.css";
import logo from "../../assets/img/logo.png";

function MainHeader() {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <header
      className={isHovered ? "active" : ""}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={`header-inner ${isHovered ? "active" : ""}`}>
        <div className="header-layout">
          <nav className="header-top">
            <div className="employbox">
              <Link to="" className="employ">
                로그인<i className=""></i>
              </Link>
            </div>
            <Link to="" className="">
              ENG
            </Link>
            <Link to="" className="afternone">
              中文
            </Link>
          </nav>
        </div>
        <nav className="gnb">
          {" "}
          {/* global navigation bar, 전체 상단 메뉴바 */}
          <div className="gnb-menu">
            <div className="header-layout">
              <ul className="gnb-title-container">
                <li className="gnb-title">
                  <div className="logo-container">
                    <Link to="/">
                      <img className="logo-img" src={logo} />
                    </Link>
                  </div>
                </li>
                <li className="gnb-title">
                  <div className="one">
                    <Link to="#" className="">
                      기업소개
                    </Link>
                    <p className="line"></p>
                  </div>
                  <div className="sub">
                    <Link to="#">회사소개</Link>
                    <Link to="#">CEO 인삿말</Link>
                    <Link to="#">회사연혁</Link>
                    <Link to="#">기업이념</Link>
                    <Link to="/orgChart">조직도</Link>
                  </div>
                </li>
                <li className="gnb-title">
                  <div className="one">
                    <Link to="#" className="">
                      R&D
                    </Link>
                    <p className="line"></p>
                  </div>
                  <div className="sub">
                    <Link to="#">연구분야</Link>
                    <Link to="#">개발성과</Link>
                    <Link to="#">연구소 소개</Link>
                    <Link to="#">보도자료</Link>
                  </div>
                </li>
                <li className="gnb-title">
                  <div className="one">
                    <Link to="#" className="">
                      제품정보
                    </Link>
                    <p className="line"></p>
                  </div>
                  <div className="sub">
                    <Link to="#">일반의약품</Link>
                    <Link to="#">전문의약품</Link>
                    <Link to="#">의약외품</Link>
                    <Link to="#">건강기능식품</Link>
                  </div>
                </li>
                <li className="gnb-title">
                  <div className="one">
                    <Link to="#" className="">
                      인재채용
                    </Link>
                    <p className="line"></p>
                  </div>
                  <div className="sub">
                    <Link to="#">인재상</Link>
                    <Link to="#">직무소개</Link>
                    <Link to="#">인재채용근황</Link>
                    <Link to="#">복리후생</Link>
                  </div>
                </li>
                <li className="gnb-title">
                  <div className="one">
                    <Link to="#" className="">
                      고객지원
                    </Link>
                    <p className="line"></p>
                  </div>
                  <div className="sub">
                    <Link to="#"></Link>
                    <Link to="#"></Link>
                    <Link to="#"></Link>
                    <Link to="#"></Link>
                  </div>
                </li>
              </ul>
            </div>
            <div className={`headerbg ${isHovered ? "active" : ""}`}></div>
            <div className="headerhov"></div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default MainHeader;
