import { jwtDecode } from "jwt-decode";

export const getUserRole = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return "guest";

  try {
    const decoded = jwtDecode(token);
    return decoded.role || "guest";
  } catch {
    return "guest";
  }
};

//isLoggedIn 은 검사함수, 토큰이 유효한지 검사하는 용도
export const isLoggedIn = () => {
  const token = localStorage.getItem("jwtToken");
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 > Date.now(); // 결과값은 true or false
    // date.now() 현재 시간을 밀리초 단위 숫자로 반환한다
  } catch (error) {
    return false;
  }
};
