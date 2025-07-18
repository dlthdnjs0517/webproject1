import axios from "../lib/axios";

//로그인 코드
export const login = async ({ username, password }) => {
  try {
    //백엔드 /api/auth/login 으로 POST 요청
    const res = await axios.post("/auth/login", { username, password });
    return res; // 응답 인터셉터 (axios.js에 작성된 코드) 덕분에 {token}만 반환됨
  } catch (error) {
    //에러를 그대로 상위 컴포넌트로 넘겨서 UI에서 처리(빨간글씨 에러표시)
    throw error;
  }
};

//로그아웃 코드
export const logout = () => {
  localStorage.removeItem("jwtToken");
};
