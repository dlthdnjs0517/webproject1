import { Link, useLocation } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import "./MainHeader.css";
import { fetchMenus } from "../../api/menu";
import LoginModal from "../../components/LoginModal";
import logo from "../../assets/img/logo.svg";
import { logoutRequest } from "../../api/auth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";

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
                onClick={() => setMenuOpen((v) => !v)}
              >
                <span className="bar" />
                <span className="bar" />
                <span className="bar" />
              </button>

              {/* 사이드 패널 + 오버레이 */}
              {isMenuOpen && (
                <div
                  className="menu-overlay"
                  onClick={() => setMenuOpen(false)}
                />
              )}

              <aside className={`menu-panel ${isMenuOpen ? "open" : ""}`}>
                <ul className="panel-list">
                  {menus.map((menu) => {
                    const hasChildren = menu.links?.length > 0;
                    return (
                      <li key={menu.id} className="panel-item">
                        {/* 1뎁스: 섹션 토글 */}
                        {hasChildren ? (
                          <button
                            className="panel-section"
                            onClick={() => toggleSection(menu.id)}
                            aria-expanded={openId === menu.id}
                          >
                            {menu.title}
                            {menu.links?.length > 0 && (
                              <span
                                className={`chevron ${openId === menu.id ? "up" : ""}`}
                              />
                            )}
                          </button>
                        ) : (
                          <Link to={menu.to} className="panel-section">
                            {menu.title}
                          </Link>
                        )}

                        {/* 2뎁스: 링크 목록(아코디언) */}
                        {hasChildren && (
                          <ul
                            className={`submenu ${openId === menu.id ? "open" : ""}`}
                          >
                            {menu.links.map((link, i) => (
                              <li key={i}>
                                <Link
                                  to={link.to}
                                  className={`submenu-link ${link.glitch ? "glitch" : ""}`}
                                  data-text={
                                    link.glitch ? link.label : undefined
                                  }
                                  onClick={() => setMenuOpen(false)}
                                >
                                  {link.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
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
                      className="login action"
                    >
                      로그인
                    </button>
                  ) : (
                    <button onClick={handleLogout} className="login action">
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
