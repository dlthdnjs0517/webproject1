import { Link } from "react-router-dom";
import React from "react";

const NotFoundPage = () => {
  return (
    <div
      style={{
        fontFamily: '"Source Sans Pro", sans-serif',
        backgroundColor: "#000000",
        color: "#ffffff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        margin: 0,
        overflow: "hidden",
        textAlign: "center",
      }}
    >
      {/* CSS를 style 태그로 직접 삽입 */}
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;700;900&display=swap");
        
        .glitch {
          font-size: 10rem;
          font-weight: 900;
          position: relative;
          color: white;
          letter-spacing: 0.1em;
          /* 여러 애니메이션을 동시에 적용 */
          animation: glitch-flicker 3s infinite linear;
        }

        .glitch::before,
        .glitch::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          width: 100%;
          height: 100%;
          background: #000000;
          clip: rect(0, 0, 0, 0);
        }

        .glitch::before {
          left: -3px;
          text-shadow: 3px 0 #ff00ff;
          animation: glitch-loop-1 0.8s infinite ease-in-out alternate-reverse;
        }

        .glitch::after {
          left: 3px;
          text-shadow: -3px 0 #00ffff;
          animation: glitch-loop-2 0.8s infinite ease-in-out alternate-reverse;
        }

        /* 글자 자체의 깜빡임 및 그림자 효과 */
        @keyframes glitch-flicker {
          0%,
          100% {
            color: white;
            text-shadow: none;
          }
          25% {
            color: #e0e0e0;
            text-shadow: 0 0 10px #00ffff;
          }
          50% {
            color: white;
          }
          75% {
            color: #d0d0d0;
            text-shadow: 0 0 10px #ff00ff;
          }
        }

     /* before 가상요소의 잘림(clip) 효과 강화 */
        @keyframes glitch-loop-1 {
          0% {
            clip-path: inset(27px 0 94px 0);
            transform: skew(0.7deg);
          }
          20% {
            clip-path: inset(44px 0 95px 0);
          }
          40% {
            clip-path: inset(55px 0 130px 0);
          }
          60% {
            clip-path: inset(33px 0 85px 0);
          }
          80% {
            clip-path: inset(120px 0 45px 0);
          }
          100% {
            clip-path: inset(75px 0 60px 0);
            transform: skew(-0.7deg);
          }
        }

        /* after 가상요소의 잘림 및 위치 이동 효과 강화 */
        @keyframes glitch-loop-2 {
          0% {
            top: -5px;
            left: 5px;
            clip-path: inset(79px 0 105px 0);
          }
          20% {
            top: 5px;
            left: -5px;
            clip-path: inset(20px 0 140px 0);
          }
          40% {
            top: -3px;
            left: 3px;
            clip-path: inset(100px 0 20px 0);
          }
          60% {
            top: 3px;
            left: -3px;
            clip-path: inset(130px 0 5px 0);
          }
          80% {
            top: -6px;
            left: 6px;
            clip-path: inset(40px 0 80px 0);
          }
          100% {
            top: 6px;
            left: -6px;
            clip-path: inset(90px 0 70px 0);
          }
        }

        .tape {
          position: relative;
          overflow: hidden;
          height: 60px;
          width: 150%;
          background-color: #facc15;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 900;
          color: #18181b;
          white-space: nowrap;
          letter-spacing: 2px;
          border-top: 3px solid #18181b;
          border-bottom: 3px solid #18181b;
          box-sizing: border-box;
          pointer-events: none;
        }

        .tape::before,
        .tape::after {
          content: "";
          position: absolute;
          left: 0;
          width: 100%;
          height: 12px;
          background: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            #18181b 10px,
            #18181b 20px
          );
          z-index: 1;
        }

        .tape::before {
          top: 0;
        }

        .tape::after {
          bottom: 0;
        }

        .tape .text {
          padding: 0 1rem;
          position: relative;
          z-index: 2;
        }

        /* 테이프 위치 및 각도 설정 */
        .tape-1 {
          top: 10%;
          left: -15%;
          transform: rotate(-20deg);
        }
        .tape-2 {
          bottom: 10%;
          left: -15%;
          transform: rotate(25deg);
        }
        .tape-3 {
          position: absolute;
          top: 55%;
          left: -20%;
          transform: rotate(-10deg);
          opacity: 0.6;
          z-index: 5;
        }
        .tape-4 {
          position: absolute;
          bottom: 10%;
          left: -15%;
          transform: rotate(20deg);
        }
      `}</style>

      {/* 텍스트 뒤에 배치될 테이프 */}
      <div className="tape tape-3">
        <span className="text">
          위험 DANGER 危険 위험 DANGER 危険 위험 DANGER 危険 DANGER 危険
        </span>
      </div>

      {/* 텍스트 앞에 배치될 테이프 */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
          zIndex: 20,
        }}
      >
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

      {/* 중앙 콘텐츠 */}
      <div
        style={{
          position: "relative",
          zIndex: 40,
        }}
      >
        <div className="glitch" data-text="404">
          404
        </div>
        <div
          style={{
            fontSize: "1.5rem",
            marginTop: "-1.5rem",
            marginBottom: "2rem",
            letterSpacing: "2px",
            fontWeight: "700",
            lineHeight: "2rem",
          }}
        >
          PAGE NOT FOUND
        </div>
        <a
          href="/"
          style={{
            display: "inline-block",
            padding: "12px 24px",
            border: "2px solid #ffffff",
            color: "#ffffff",
            textDecoration: "none",
            fontWeight: "700",
            transition: "background-color 0.3s, color 0.3s",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#ffffff";
            e.target.style.color = "#000000";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "transparent";
            e.target.style.color = "#ffffff";
          }}
        >
          RETURN HOME
        </a>
      </div>
    </div>
  );
};

export default NotFoundPage;

//export default NotFoundPage;
// const NotFoundPage = () => {
//   return (
//     <div className="min-h-screen bg-black text-white flex justify-center items-center overflow-hidden text-center relative not-found-container">
//       {/* Tape 3 - 별도 위치 */}
//       <div className="tape tape-3">
//         <span className="text">
//           위험 DANGER 危険 위험 DANGER 危険 위험 DANGER 危険 DANGER 危険
//         </span>
//       </div>

//       {/* 다른 테이프들을 위한 컨테이너 */}
//       <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-20 pointer-events-none">
//         <div className="tape tape-1">
//           <span className="text">
//             접근금지 KEEP OUT 立入禁止 접근금지 KEEP OUT 立入禁止 접근금지 KEEP
//             OUT 立入禁止
//           </span>
//         </div>
//         <div className="tape tape-2">
//           <span className="text">
//             NO ENTRY 관계자외 출입금지 闲人免进 NO ENTRY 관계자외 출입금지
//             闲人免进
//           </span>
//         </div>
//         <div className="tape tape-4">
//           <span className="text">
//             危险 DANGER 危険 危险 DANGER 危険 危险 DANGER 危険 危险 DANGER 危険
//           </span>
//         </div>
//       </div>

//       {/* 메인 컨텐츠 */}
//       <div className="relative z-10">
//         <div className="glitch" data-text="404">
//           404
//         </div>
//         <div className="text-2xl mt-[-2rem] mb-8 tracking-widest font-bold not-found-message">
//           PAGE NOT FOUND
//         </div>
//         <Link
//           to="/"
//           className="inline-block py-3 px-6 border-2 border-white text-white no-underline font-bold transition-all duration-300 hover:bg-white hover:text-black not-found-link"
//         >
//           RETURN HOME
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default NotFoundPage;
