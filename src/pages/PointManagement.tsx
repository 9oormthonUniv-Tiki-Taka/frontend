import React, { useState } from "react";

const PointManagement = () => {
  const [activeTab, setActiveTab] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const tabs = ["전체", "획득내역", "사용내역"];
  const pages = [1, 2, 3, 4, 5];

  const data = [
    { action: "댓글 작성", date: "2025.05.29", point: "+100 P" },
    { action: "댓글 알림", date: "2025.05.29", point: "-100 P" },
    { action: "댓글 작성", date: "2025.05.29", point: "+100 P" },
    { action: "댓글 작성", date: "2025.05.29", point: "+100 P" },
    { action: "댓글 알림", date: "2025.05.29", point: "-100 P" },
  ];

  const filteredData = data.filter((item) => {
    if (activeTab === "획득내역") return item.point.startsWith("+");
    if (activeTab === "사용내역") return item.point.startsWith("-");
    return true;
  });

  return (
    <div className="w-full px-4 py-6 min-h-screen flex justify-center">
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-center">포인트 관리</h2>

        {/* 탭 버튼 */}
        <div className="flex gap-2 mb-4 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-md border text-sm transition
                ${activeTab === tab
                  ? "bg-gray-700 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 현재 포인트 박스 */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex justify-between items-center font-semibold text-gray-800 text-sm">
          <span>현재 포인트</span>
          <span>2,000 P</span>
        </div>

        {/* 포인트 내역 카드 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="space-y-4 text-sm">
            {filteredData.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-start border-b pb-3"
              >
                <div>
                  <div className="text-gray-800">{item.action}</div>
                  <div className="text-gray-400 text-xs">{item.date}</div>
                </div>
                <div
                  className={`font-semibold ${item.point.startsWith("-") ? "text-red-500" : "text-gray-900"
                    }`}
                >
                  {item.point}
                </div>
              </div>
            ))}
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

export default PointManagement;
