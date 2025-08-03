import { Link } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import "./MainHeader.css";
import { fetchMenus } from "../../api/menu";
import { getUserRole } from "../../utils/auth";
import LoginModal from "../../components/LoginModal";
import logo from "../../assets/img/logo.svg";
import { logoutRequest } from "../../api/auth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authSlice";

function MainHeader() {
  const [menus, setMenus] = useState([]); //api로 받은 메뉴 저장
  const [activeIndex, setActiveIndex] = useState(null);
  const [isLoginOpen, setLoginOpen] = useState(false);

  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  const updateMenus = async () => {
    const data = await fetchMenus();
    setMenus(data);
  };

  const handleLogout = () => {
    dispatch(logout());
    logoutRequest();
    updateMenus();
  };

  // 화면이 렌더링 될때 1회만 실행.
  useEffect(() => {
    updateMenus();
  }, []);

  return (
    <header>
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
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setActiveIndex(null);
                    }
                  }}
                >
                  <Link to={menu.links[0]?.to || "#"} className="main-menu">
                    {menu.title}
                  </Link>

                  {/* 서브메뉴: 링크가 있을 때만 표시 */}
                  {menu.links.length > 0 && (
                    <div className="sub">
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
                  )}
                </li>
              ))}
            </ul>
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
