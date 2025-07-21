import { useState } from "react";
import { login } from "../api/auth";

export default function LoginModal({ isOpen, onClose, onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null; // 모달이 닫혀있으면 렌더링 안 함

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login({ username, password });
      localStorage.setItem("jwtToken", token);
      setErrorMsg("");
      alert("로그인 성공");
      onSuccess?.(); // 부모 컴포넌트에 알림 (메뉴 갱신 등)
      onClose(); // 모달 닫기
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMsg("잘못된 아이디/패스워드입니다.");
      } else {
        console.error("서버에러:", error);
        setErrorMsg("서버 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-sm relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>
        <h2 className="text-xl font-bold text-center mb-4">로그인</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="아이디"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border px-3 py-2 rounded focus:ring-2 focus:ring-blue-500"
          />
          {errorMsg && (
            <p className="text-red-600 text-sm text-center">{errorMsg}</p>
          )}
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
}
