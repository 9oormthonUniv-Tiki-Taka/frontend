import React, { useState } from "react";

const 신고내역 = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = [1, 2, 3, 4, 5];

  const data = [
    { reason: "욕설 및 비방", date: "2025.05.29", status: "신고 완료" },
    { reason: "신고 사유", date: "2025.05.29", status: "처리 완료" },
    { reason: "신고 사유", date: "2025.05.29", status: "신고 취소" },
    { reason: "신고 사유", date: "2025.05.29", status: "신고 미정" },
    { reason: "신고 사유", date: "2025.05.29", status: "상태" },
    { reason: "신고 사유", date: "2025.05.29", status: "상태" },
    { reason: "신고 사유", date: "2025.05.29", status: "상태" },
    { reason: "신고 사유", date: "2025.05.29", status: "상태" },
  ];

  return (
    <div className="w-full px-4 py-6 bg-[#f5f9fc] min-h-screen flex justify-center">
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-center">신고내역</h2>

        <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="py-2 px-2 font-medium">내용</th>
                <th className="py-2 px-2 font-medium">신고 사유</th>
                <th className="py-2 px-2 font-medium">날짜</th>
                <th className="py-2 px-2 font-medium">상태</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b last:border-none">
                  <td className="py-3 px-2">질문 및 댓글 내용</td>
                  <td className="py-3 px-2">{item.reason}</td>
                  <td className="py-3 px-2">{item.date}</td>
                  <td className="py-3 px-2">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6 space-x-2 text-sm">
          {pages.map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-8 h-8 text-center rounded transition-colors duration-200
                ${
                  currentPage === num
                    ? "bg-white text-black font-semibold"
                    : "bg-transparent text-gray-400 hover:text-black"
                }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default 신고내역;
