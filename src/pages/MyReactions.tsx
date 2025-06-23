import React, { useState } from "react";

const 남긴반응 = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState("전체");
  const [showModal, setShowModal] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

  const pages = [1, 2, 3, 4, 5];
  const tabs = ["전체", "좋아요", "궁금해요"];

  const data = [
    { category: "커뮤니케이션디자인", content: "질문 내용" },
    { category: "강의 이름", content: "질문 내용" },
    { category: "강의 이름", content: "질문 내용" },
    { category: "강의 이름", content: "질문 내용" },
  ];

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
    setShowModal(true);
  };

  const handleConfirmDelete = () => {
    setShowModal(false);
    setDeleteIndex(null);
  };

  return (
    <div className="w-full px-4 py-6 bg-[#f5f9fc] min-h-screen flex justify-center">
      <div className="w-full max-w-6xl">
        <h2 className="text-2xl font-bold mb-4 text-center">남긴 반응</h2>

        {/* 탭 버튼 */}
        <div className="flex gap-2 mb-4 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md border text-sm font-medium transition
                ${
                  activeTab === tab
                    ? "bg-gray-700 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 카드 */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={index} className="border-b pb-4 relative">
                <p className="text-sm text-gray-400">{item.category}</p>
                <p className="text-base text-gray-800 font-medium mt-1">
                  {item.content}
                </p>
                <button
                  onClick={() => handleDeleteClick(index)}
                  className="absolute top-0 right-0 text-gray-400 hover:text-red-400"
                >
                  ✕
                </button>
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

      {/* 모달 */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center w-80">
            <h3 className="text-lg font-semibold mb-2">댓글을 삭제하시겠어요?</h3>
            <p className="text-sm text-gray-500 mb-6">
              삭제된 댓글은 복구할 수 없습니다.
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowModal(false)}
                className="w-full mr-2 py-2 rounded-md border text-gray-600 hover:bg-gray-100"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-full ml-2 py-2 rounded-md bg-gray-800 text-white hover:bg-gray-700"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default 남긴반응;
