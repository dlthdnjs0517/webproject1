import axios from "axios";

const instance = axios.create({
  baseURL: "/api",
  timeout: 5000,
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
  ((response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      alert("당신은 볼 수 없습니다.");
    }
    return Promise.reject(error);
  })
);

export default instance;
