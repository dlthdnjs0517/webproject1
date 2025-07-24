import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import "./MainHeader.css";
import { fetchMenus } from "../../api/menu";
import LoginModal from "../../components/LoginModal";
import logo from "../../assets/img/logo.svg";

function MainHeader() {
  const [menus, setMenus] = useState([]); //api로 받은 메뉴 저장
  const [activeIndex, setActiveIndex] = useState(null);
  const [isLoginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    fetchMenus().then(setMenus);
  }, []);

  return (
    <header>
      <div className="header-inner">
        <nav className="gnb">
          {/* global navigation bar, 전체 상단 메뉴바 */}
          <div className="gnb-menu">
            <div className="header-layout">
              <h1 className="logo-container">
                <div>
                  <Link to="/">
                    <img className="logo-img" src={logo} />
                  </Link>
                </div>
              </h1>

              {/* api로 불러온 데이터를 기반으로 반복 렌더링 */}
              <ul className="gnb-title-container">
                {menus.map((menu, index) => (
                  <li
                    key={index}
                    className={`gnb-title ${
                      activeIndex === index ? "active" : ""
                    }`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <div className="one">
                      <Link to={menu.links[0]?.to || "#"}>{menu.title}</Link>
                    </div>

                    {/* 서브메뉴: 링크가 있을 때만 표시 */}
                    <div
                      className={`sub ${activeIndex === index ? "active" : ""}`}
                    >
                      {menu.links.map((link, i) => (
                        <Link
                          key={i}
                          to={link.to}
                          className={link.glitch ? "glitch" : ""}
                          data-text={link.glitch ? link.label : undefined}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              {/* <ul className="gnb-title-container">
                <li className="gnb-title">
                  <div className="one">
                    <Link to="#" className="">
                      기업소개
                    </Link>
                  </div>
                  <div className="sub">
                    <Link to="#">CEO 인삿말</Link>
                    <Link to="#">회사연혁</Link>
                    <Link to="#">기업이념</Link>
                    <Link to="/orgChart" className="glitch" data-text="조직도">
                      조직도
                    </Link>
                  </div>
                </li>
                <li className="gnb-title">
                  <div className="one">
                    <Link to="#" className="">
                      R&D
                    </Link>
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
                  </div>
                  <div className="sub">
                    <Link to="#"></Link>
                    <Link to="#"></Link>
                    <Link to="#"></Link>
                    <Link to="#"></Link>
                  </div>
                </li>
                <div className={`headerbg ${isHovered ? "active" : ""}`}></div>
              </ul> */}
              <div className="gnb-right">
                <button onClick={() => setLoginOpen(true)} className="login">
                  로그인
                </button>
                <LoginModal
                  isOpen={isLoginOpen}
                  onClose={() => setLoginOpen(false)}
                  onSuccess={() => alert("메뉴 갱신 예정")}
                />
              </div>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default MainHeader;
