import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/home";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

// 서버실행을 위해 npm run dev 입력하기

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/orgChart" element={<OrgChart />} /> */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
