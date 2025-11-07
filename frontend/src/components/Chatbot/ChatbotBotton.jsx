import { useState } from "react";
import ChatbotInterface from "./ChatbotInerface";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";

const ChatbotButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 챗봇 창 */}
      {isOpen && (
        <div className="fixed bottom-32 right-8 w-96 h-[600px] z-50 animate-slideUp">
          <ChatbotInterface onClose={() => setIsOpen(false)} />
        </div>
      )}

      {/* glass-morphism 플로팅 버튼 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          fixed bottom-8 right-8 z-50
          w-16 h-16
          flex items-center justify-center
          transition-all duration-300
		  backdrop-blur-2xl
          group
        "
        style={{
          borderRadius: "40px",
          background: "rgba(255,255,255,0.35)",
          boxShadow:
            "inset 0 3px 0 rgba(255, 255, 255, 0.2), inset 0 -3px 0 rgba(255,255,255,0.2),inset 0 0 20px 20px rgba(255, 255, 255, 0.5) ",
        }}
        aria-label={isOpen ? "챗봇 닫기" : "챗봇 열기"}
      >
        {/* 아이콘 */}
        {isOpen ? (
          <IoClose className="w-7 h-7 text-gray-700 transition-transform group-hover:rotate-90" />
        ) : (
          <IoChatbubbleEllipsesOutline className="w-7 h-7 text-gray-700 transition-transform group-hover:scale-110" />
        )}

        {/* 툴팁 */}
        {!isOpen && (
          <span
            className="
            absolute right-20 
            bg-white 
            text-gray-700 text-sm 
            px-4 py-2 
            rounded-2xl 
            whitespace-nowrap 
            opacity-0 
            group-hover:opacity-100 
            transition-opacity
            pointer-events-none
          "
            style={{
              boxShadow: "-20px -20px 60px #abb3c6, 20px 20px 60px #e7f3ff",
            }}
          >
            💬 AI CHATBOT과 대화하기
          </span>
        )}
      </button>
    </>
  );
};

export default ChatbotButton;
