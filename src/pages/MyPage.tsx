// src/pages/MyPage.tsx
import { useState } from "react";
import MyQuestions from "./MyQuestions";
import MyComments from "./MyComments";
import MyReactions from "./MyReactions";
import PointManagement from "./PointManagement";
import ReportHistory from "./ReportHistory";

const tabs = [
  "나의 질문",
  "작성한 댓글",
  "남긴 반응",
  "포인트 관리",
  "신고 내역"
];

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("나의 질문");

  return (
    <div className="px-6 py-10">
      <div className="flex gap-4 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
            activeTab === tab
              ? "bg-[#646B72] text-white border-[#E9EEF2]"
              : "text-[#202325] hover:bg-[#E9EEF2] border-[#E9EEF2]"
          }`}
        >
          {tab}
        </button>
        ))}
      </div>

      <div className="mt-8">
        {activeTab === "나의 질문" && <MyQuestions />}
        {activeTab === "작성한 댓글" && <MyComments />}
        {activeTab === "남긴 반응" && <MyReactions />}
        {activeTab === "포인트 관리" && <PointManagement />}
        {activeTab === "신고 내역" && <ReportHistory />}
      </div>
    </div>
  );
}
