import React, { useState } from "react";

const 나의질문 = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = [1, 2, 3, 4, 5];

  const data = [
    {
      lecture: "대학영어",
      content: "교수님 오늘 수업은 언제 끝나나요?",
      date: "2025.05.29",
      status: "완료",
    },
    {
      lecture: "강의 이름",
      content: "질문 내용",
      date: "2025.05.29",
      status: "대기",
    },
    {
      lecture: "강의 이름",
      content: "질문 내용",
      date: "2025.05.29",
      status: "완료",
    },
    {
      lecture: "강의 이름",
      content: "질문 내용",
      date: "2025.05.29",
      status: "완료",
    },
    {
      lecture: "강의 이름",
      content: "질문 내용",
      date: "2025.05.29",
      status: "완료",
    },
    {
      lecture: "강의 이름",
      content: "질문 내용",
      date: "2025.05.29",
      status: "완료",
    },
    {
      lecture: "강의 이름",
      content: "질문 내용",
      date: "2025.05.29",
      status: "완료",
    },
    {
      lecture: "강의 이름",
      content: "질문 내용",
      date: "2025.05.29",
      status: "완료",
    },
  ];

  return (
    <div className="w-full flex justify-center px-4"> {/* ✅ 반응형 정중앙 */}
      <div className="w-full max-w-6xl mt-10">
        <h2 className="text-2xl font-bold mb-4 text-center">나의 질문</h2>

        {/* 카드 박스 */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-gray-600 text-sm">
                  <th className="px-4 py-2">강의 이름</th>
                  <th className="px-4 py-2">내용</th>
                  <th className="px-4 py-2">날짜</th>
                  <th className="px-4 py-2">상태</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-800">
                {data.map((item, index) => (
                  <tr key={index} className="bg-white rounded-lg shadow-sm">
                    <td className="px-4 py-2">{item.lecture}</td>
                    <td className="px-4 py-2">{item.content}</td>
                    <td className="px-4 py-2">{item.date}</td>
                    <td className="px-4 py-2">{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6 space-x-2 text-sm">
          {pages.map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-8 h-8 text-center rounded transition-colors duration-200
                ${currentPage === num
                  ? "bg-white text-black font-semibold"
                  : "bg-transparent text-gray-400 hover:text-black"}`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default 나의질문;
