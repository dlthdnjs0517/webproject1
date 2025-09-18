import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import "./MainHeader.css";
import { fetchMenus } from "../../api/menu";
import LoginModal from "../../components/LoginModal";
import logo from "../../assets/img/logo.svg";
import { logoutRequest } from "../../api/auth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";

// react-icons 에서 아이콘 import 하기
import { BsBuilding, BsFillPeopleFill, BsInfoCircle } from "react-icons/bs";
import { GiBubblingFlask, GiMedicinePills, GiSpellBook } from "react-icons/gi";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { MdKeyboardArrowRight } from "react-icons/md";

const iconMapping = {
  기업소개: <BsBuilding />,
  "R&D": <GiBubblingFlask />,
  제품정보: <GiMedicinePills />,
  인재채용: <BsFillPeopleFill />,
  고객지원: <BsInfoCircle />,
  "아이템 도감": <GiSpellBook />,
};

function MainHeader() {
  const [menus, setMenus] = useState([]); //api로 받은 메뉴 저장
  const [isMenuOpen, setMenuOpen] = useState(false); // 햄버거 열림/닫힘
  const [openId, setOpenId] = useState(null);
  const [isLoginOpen, setLoginOpen] = useState(false);

  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);
  const location = useLocation();

  const updateMenus = async () => {
    const data = await fetchMenus();
    setMenus(data);
  };

  const handleLogout = () => {
    dispatch(logout());
    logoutRequest();
    updateMenus();
    setMenuOpen(false);
  };

  // 최초로 웹페이지 로드 시 메뉴 가져오기
  useEffect(() => {
    updateMenus();
  }, []);

  // role 바뀔 때 메뉴 다시 가져오기
  useEffect(() => {
    updateMenus();
  }, [role]);

  // pathname 바뀔 때(페이지 이동 시)는 닫기만 하기
  useEffect(() => {
    setMenuOpen(false);
    setOpenId(null);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== "Escape") return; //guard clause 패턴

      if (isLoginOpen) {
        setLoginOpen(false);
      } else if (isMenuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    //정리함수, 의존성 배열의 값이 변할 때마다 이전의 effect를 정리해주는 역할을 하는 함수.
  }, [isLoginOpen, isMenuOpen]);

  const toggleSection = (id) => {
    setOpenId((prev) => (prev === id ? null : id));
  };
  return (
    <header>
      <nav className="gnb">
        {/* global navigation bar, 전체 상단 메뉴바 */}
        <div className="gnb-menu">
          <div className="header-layout">
            <h1 className="logo-container">
              <div>
                <Link to="/">
                  <img className="logo-img" src={logo} alt="회사 로고" />
                </Link>
              </div>
            </h1>
            <div className="gnb-right">
              {role === "guest" ? (
                <button onClick={() => setLoginOpen(true)} className="login">
                  로그인
                </button>
              ) : (
                <button onClick={handleLogout} className="login">
                  로그아웃
                </button>
              )}
              <button
                className="hamburger-btn"
                aria-label="메뉴 열기"
                aria-expanded={isMenuOpen}
                onClick={() => setMenuOpen(true)}
              >
                <AiOutlineMenu size={28} />
              </button>

              {/* 사이드 패널 + 오버레이 */}

              <div
                className={`menu-overlay ${isMenuOpen ? "is-active" : ""}`}
                onClick={() => setMenuOpen(false)}
              />

              <aside className={`side-menu ${isMenuOpen ? "is-open" : ""}`}>
                <div className="menu-header">
                  <span className="logo-in-menu">MENU</span>
                  <button
                    className="close-btn"
                    aria-label="메뉴 닫기"
                    onClick={() => setMenuOpen(false)}
                  >
                    <AiOutlineClose size={24} />
                  </button>
                </div>

                <ul className="menu-list">
                  {menus.map((menu) => {
                    const hasChildren = menu.links?.length > 0;
                    const menuIcon = iconMapping[menu.title];
                    return (
                      <li key={menu.id} className="menu-item">
                        {/* 1뎁스: 섹션 토글 */}
                        {hasChildren ? (
                          <>
                            <div
                              className={`menu-title ${openId === menu.id ? "active" : ""}`}
                              onClick={() => toggleSection(menu.id)}
                              role="button"
                              aria-expanded={openId === menu.id}
                              tabIndex="0"
                            >
                              <span className="menu-content-wrapper">
                                <span className="menu-icon">{menuIcon}</span>
                                {menu.title}
                                <span className="arrow-icon">
                                  <MdKeyboardArrowRight size="20" />
                                </span>
                              </span>
                            </div>
                            <ul
                              className="submenu-links"
                              style={{
                                maxHeight: openId === menu.id ? "500px" : "0",
                              }}
                            >
                              {menu.links.map((link, i) => (
                                <li key={i}>
                                  <Link to={link.to}>{link.label}</Link>
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : (
                          <Link to={menu.to} className="single-link">
                            <span className="menu-content-wrapper">
                              <span className="menu-icon">{menuIcon}</span>
                              {menu.title}
                            </span>
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* 로그인/로그아웃은 패널 하단 고정 */}
                <div className="panel-footer">
                  {role === "guest" ? (
                    <button
                      onClick={() => {
                        setLoginOpen(true);
                      }}
                      className="login action-btn"
                    >
                      로그인
                    </button>
                  ) : (
                    <button onClick={handleLogout} className="login action-btn">
                      로그아웃
                    </button>
                  )}
                </div>
              </aside>
              <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setLoginOpen(false)}
                onSuccess={updateMenus}
              />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default MainHeader;
