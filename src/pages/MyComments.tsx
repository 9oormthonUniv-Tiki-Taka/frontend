// import React from 'react'; // 사용하지 않으므로 주석 처리
import { useState } from "react";

const MyComments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pages = [1, 2, 3, 4, 5];

  return (
    <div className="w-full flex justify-center px-4"> {/* ✅ 중앙 정렬을 위한 외부 래퍼 */}
      <div className="w-full max-w-6xl mt-10">
        {/* 제목은 카드 밖 */}
        <h2 className="text-2xl font-bold mb-4 text-center">작성한 댓글</h2>

        {/* 카드 박스 */}
        <div className="p-6 bg-white rounded-xl shadow-sm">
          {/* 댓글 리스트 */}
          <div className="space-y-4">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-sm relative">
                <div className="font-semibold text-gray-800">
                  이번 과제 6월 29일까지 제출하는 거라고 하셨습니다!
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  커뮤니케이션디자인<br />
                  오늘 내주신 과제 언제까지인가요?
                </div>
                <button className="absolute top-4 right-4 text-gray-400 hover:text-red-400">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* 페이지네이션 (카드 밖) */}
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

export default MyComments;
