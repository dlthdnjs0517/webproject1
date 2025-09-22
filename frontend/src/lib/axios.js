import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      alert("당신은 볼 수 없습니다.");
    }
    return Promise.reject(error);
  }
);

export default instance;
