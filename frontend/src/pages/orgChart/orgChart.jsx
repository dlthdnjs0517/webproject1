import MainHeader from "../../components/MainHeader/MainHeader";
import AddEmployeeModal from "./AddEmployeeModal";
import axios from "../../lib/axios";
import { useSelector } from "react-redux";
import React, { useState, useMemo, useEffect } from "react";

export default function OrgChart() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("search");
  const [showAddModal, setShowAddModal] = useState(false);

  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);

  const { role } = useSelector((state) => state.auth);

  // 직원 + 부서 데이터 불러오기
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/org");
        setDepartments(res.data.departments);
        setEmployees(res.data.employees);
      } catch (err) {
        console.error("데이터 불러오기 실패:", err);
      }
    })();
  }, []);

  const handleSuccess = async () => {
    try {
      const res = await axios.get("/api/org");
      setEmployees(res.data.employees);
    } catch (err) {
      console.error("직원 목록 갱신 실패:", err);
    }
  };

  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) =>
      [employee.name, employee.department, employee.position].some((field) =>
        field?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, employees]);

  return (
    <>
      <MainHeader />
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-blue-100 pt-20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-gray-100">
          {/* 큰 제목 */}
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4 text-center">
            조직도
          </h1>
          <p className="text-gray-600 mb-8 text-center">
            조직의 직원을 검색하고 정보를 확인할 수 있습니다.
          </p>

          {/* 탭 네비게이션 */}
          <div className="flex justify-center mb-12 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("search")}
              className={`px-6 py-2 text-lg font-medium ${
                activeTab === "search"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              직원 검색
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`px-6 py-2 text-lg font-medium ${
                activeTab === "add"
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              조직도
            </button>
          </div>

          {activeTab === "search" && (
            <>
              {/* 검색창 */}
              <div className="mb-8 max-w-2xl mx-auto flex items-center gap-4">
                <input
                  type="text"
                  placeholder="이름으로 검색..."
                  className="flex-1 pl-4 pr-4 py-4 border border-gray-200 rounded-full focus:ring-4 focus:ring-indigo-300 focus:outline-none transition text-base shadow-md"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {/* 직원 추가 버튼 (Admin만 보임) */}
                {role === "admin" && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-indigo-600 text-white px-5 py-3 rounded-full shadow-md hover:bg-indigo-700 transition"
                  >
                    직원 추가
                  </button>
                )}
              </div>

              {/* 검색 결과 카운트 */}
              <p className="text-gray-700 mb-6 text-center">
                총 {filteredEmployees.length}명 검색됨
              </p>

              {/* 직원 카드 */}
              {filteredEmployees.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredEmployees.map((employee) => (
                    <div
                      key={employee._id}
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
                        <p className="text-sm text-gray-600">
                          담당 업무:{" "}
                          <span className="font-medium">
                            {employee.assignedTask || "미정"}
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

      {/* 직원 추가 모달 */}
      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleSuccess}
          departments={departments}
        />
      )}
    </>
  );
}
