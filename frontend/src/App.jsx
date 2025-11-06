import {
  BrowserRouter as Router,
  Routes,
  Route,
  BrowserRouter,
} from "react-router-dom";
import Home from "./pages/home/home";
import NotFoundPage from "./pages/NotFound/NotFoundPage";
import OrgChart from "./pages/orgChart/orgChart";
import ChatbotButton from "./components/Chatbot/ChatbotBotton";

// 서버실행을 위해 npm run dev 입력하기

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orgChart" element={<OrgChart />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ChatbotButton />
    </>
  );
}

export default App;
