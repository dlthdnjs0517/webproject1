import axios from "../lib/axios";

//로그인 코드
export const login = async ({ username, password }) => {
  try {
    //백엔드 주소로 POST 요청
    const res = await axios.post("/api/auth/login", {
      username,
      password,
    });
    return res.data; // 응답 인터셉터 (axios.js에 작성된 코드)가 실행됨.
    //  response 응답 (json형식 객체) 반환, body에 원하는 정보가 있으니까 res.data
  } catch (error) {
    //에러를 그대로 상위 컴포넌트로 넘겨서 UI에서 처리(빨간글씨 에러표시)
    throw error;
  }
};

//로그아웃 코드
export const logout = () => {
  localStorage.removeItem("jwtToken");
};
