import React, { useState } from "react";
import axios from "../../lib/axios";

export default function AddEmployeeModal({ onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    department: departments[0]?.value || "",
    position: "",
    email: "",
    assignedTask: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/org/addEmployee", form);
      alert("✅ 직원 등록 완료!");
      onSuccess?.(); // 부모에서 새로고침 or 데이터 리패치
      onClose(); // 모달 닫기
    } catch (err) {
      console.error("❌ 직원 추가 실패:", err);
      alert("직원 추가에 실패했습니다.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">직원 등록</h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* 이름 */}
          <div className="flex items-center gap-2">
            <label className="w-20 text-sm font-medium text-gray-700">
              이름
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 부서 */}
          <div className="flex items-center gap-2">
            <label className="w-20 text-sm font-medium text-gray-700">
              부서
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {departments.map((dep) => (
                <option key={dep.value} value={dep.value}>
                  {dep.label}
                </option>
              ))}
            </select>
          </div>

          {/* 직급 */}
          <div className="flex items-center gap-2">
            <label className="w-20 text-sm font-medium text-gray-700">
              직급
            </label>
            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              required
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 이메일 */}
          <div className="flex items-center gap-2">
            <label className="w-20 text-sm font-medium text-gray-700">
              이메일ID
            </label>
            <input
              type="text"
              name="email"
              placeholder="예: honggildong"
              value={form.email}
              onChange={handleChange}
              required
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 담당업무 (선택) */}
          <div className="flex items-center gap-2">
            <label className="w-20 text-sm font-medium text-gray-700">
              담당 업무
            </label>
            <input
              type="text"
              name="assignedTask"
              value={form.assignedTask}
              onChange={handleChange}
              className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* 버튼 */}
          <div className="flex justify-between gap-7 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
