import { Calendar, ChevronDown, ChevronRight, Search } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";


const filters = [
  { id: 0, label: "최신 수업" },
  { id: 1, label: "질문 많은 순" },
  { id: 2, label: "이름 순 (가나다)" },
];

export default function ListProfessor() {
  const [selectedFilter, setSelectedFilter] = useState(1); // 기본 선택: 질문 많은 순

  return (
    <div className="min-h-screen bg-[#F8FBFF] px-4 py-12">
      <div className="max-w-5xl w-full mx-auto flex flex-col items-center">

        {/* 타이틀 */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-[#323639] mb-4">나의 수강 과목</h1>
          <p className="text-base md:text-lg text-gray-600">
            내가 수강하는 과목의 목록을 확인해보세요.
          </p>
        </div>

        {/* 검색창 */}
        <div className="relative w-full max-w-xl mb-16">
          <Input
            type="text"
            placeholder="강의명을 입력하세요..."
            className="w-full bg-[#FFFFFF] pl-5 pr-12 py-4 md:py-5 text-base md:text-lg rounded-full border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
          />
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
        </div>

        {/* 오늘 수업 */}
        <section className="mb-16 w-full">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <h2 className="text-base font-medium text-gray-800">
              오늘 수업 (2025.00.00)
            </h2>
          </div>

          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <HoverCard key={i} />
            ))}
          </div>
        </section>

        {/* 전체 수업 */}
        <section className="w-full">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-500" />
            <h2 className="text-base font-medium text-gray-800">전체 수업</h2>
          </div>

          {/* 정렬 필터 */}
          <div className="flex space-x-2 mb-6">
            {filters.map((f) => (
              <button
                key={f.id}
                className={`text-sm px-4 py-2 rounded-full transition-colors ${
                  selectedFilter === f.id
                    ? "bg-[#646B72] text-white"
                    : "bg-[#F2F6F9] text-[#323639] hover:bg-[#E9EEF2]"
                }`}
                onClick={() => setSelectedFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* 강의 리스트 */}
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <HoverCard key={index} />
            ))}
          </div>

          {/* 더보기 버튼 */}
          <div className="w-full text-center mt-8">
  <button className="border border-gray-300 px-5 py-2 text-sm rounded-md flex items-center justify-center gap-1 hover:bg-gray-100 mx-auto">
    <span>더보기</span>
    <ChevronDown className="w-4 h-4" />
  </button>
</div>
        </section>
      </div>
    </div>
  );
}

function HoverCard() {
  const navigate = useNavigate(); // ✅ navigate 훅 추가

  return (
    <div
      onClick={() => navigate("/loading")} // ✅ 클릭 시 이동
      className="group flex justify-between items-center bg-white hover:bg-[#E9EEF2] transition-colors rounded-md py-4 px-5 text-sm text-gray-700 border border-gray-200 cursor-pointer"
    >
      수업 이름 (강의실 이름)
      <ChevronRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
    </div>
  );
}
