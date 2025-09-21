import MainHeader from "../../components/MainHeader/MainHeader";

import React, { useState, useMemo } from "react";

// 샘플 데이터
const allEmployees = [
  {
    id: 1,
    name: "김민준",
    department: "개발팀",
    position: "프론트엔드 개발자",
    email: "minjun.kim@example.com",
  },
  {
    id: 2,
    name: "이서연",
    department: "디자인팀",
    position: "UX/UI 디자이너",
    email: "seoyeon.lee@example.com",
  },
  {
    id: 3,
    name: "박도현",
    department: "기획팀",
    position: "프로덕트 매니저",
    email: "dohyun.park@example.com",
  },
  {
    id: 4,
    name: "최지우",
    department: "마케팅팀",
    position: "콘텐츠 마케터",
    email: "jiwoo.choi@example.com",
  },
  {
    id: 5,
    name: "정해인",
    department: "개발팀",
    position: "백엔드 개발자",
    email: "haein.jung@example.com",
  },
  {
    id: 6,
    name: "윤지수",
    department: "디자인팀",
    position: "리드 디자이너",
    email: "jisoo.yoon@example.com",
  },
];

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
      clipRule="evenodd"
    />
  </svg>
);

export default function OrgChart() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("search");

  const filteredEmployees = useMemo(() => {
    return allEmployees.filter((employee) =>
      [employee.name, employee.department, employee.position].some((field) =>
        field.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <>
      <MainHeader />
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-100">
          {/* 큰 제목 */}
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 text-center">
            👥 직원 검색
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            조직의 직원을 검색하고 정보를 확인할 수 있습니다.
          </p>

          {/* 탭 네비게이션 */}
          <div className="flex justify-center mb-12 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("search")}
              className={`px-6 py-2 text-lg font-medium ${activeTab === "search" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              직원 검색
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`px-6 py-2 text-lg font-medium ${activeTab === "add" ? "text-indigo-600 border-b-2 border-indigo-600" : "text-gray-500 hover:text-gray-700"}`}
            >
              직원 추가
            </button>
          </div>

          {activeTab === "search" && (
            <>
              {/* 검색창 */}
              <div className="mb-8 max-w-2xl mx-auto">
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                    <SearchIcon />
                  </span>
                  <input
                    type="text"
                    placeholder="이름, 부서, 직책으로 검색..."
                    className="w-full pl-12 pr-14 py-4 border border-gray-200 rounded-full focus:ring-4 focus:ring-indigo-300 focus:outline-none transition text-base shadow-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* 검색 결과 카운트 */}
              <p className="text-gray-700 mb-6 text-center">
                총 {filteredEmployees.length}명 검색됨
              </p>

              {/* 직원 카드 그리드 */}
              {filteredEmployees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee.id}
                      className="group bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-md hover:shadow-2xl transition transform hover:-translate-y-1 p-8 border border-gray-100"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-2xl shadow-inner">
                          {employee.name[0]}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition">
                            {employee.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {employee.position}
                          </p>
                        </div>
                      </div>
                      <div className="mt-6 space-y-2">
                        <p className="text-sm text-gray-600">
                          부서:{" "}
                          <span className="font-medium">
                            {employee.department}
                          </span>
                        </p>
                        <a
                          href={`mailto:${employee.email}`}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          {employee.email}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-24">
                  <p className="text-xl font-semibold text-gray-500">
                    검색 결과가 없습니다 😥
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === "add" && (
            <div className="text-center py-24">
              <p className="text-xl text-gray-600">
                직원 추가 기능은 준비 중입니다 🛠️
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
