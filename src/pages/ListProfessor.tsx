import { useState } from "react";
import { Search, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const filters = [
  { id: 0, label: "최신 등록 순" },
  { id: 1, label: "질문 많은 순" },
  { id: 2, label: "이름 순 (가나다)" },
];

const questions = [
  { id: 0, label: "질문 많음" },
  { id: 1, label: "질문 보통" },
  { id: 2, label: "질문 적음" },
];

export default function LectureListPage() {
  const [selectedFilter, setSelectedFilter] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#F8FBFF] px-8 py-10">
      <h1 className="text-3xl font-bold text-center text-[#202325] mb-2">나의 강의 리스트</h1>
      <p className="text-center text-[#555] mb-6">담당 중인 강의를 확인하고 질문을 관리해보세요.</p>

      {/* 🔍 검색창 */}
      <div className="relative w-full max-w-xl mb-16 mx-auto">
        <Input
          type="text"
          placeholder="강의명을 입력하세요..."
          className="w-full pl-5 pr-12 py-4 md:py-5 text-base md:text-lg rounded-full border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
        />
        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
      </div>

      {/* 📅 오늘 강의 */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-[#202325] font-semibold">
            <Calendar className="w-5 h-5 mr-1" />
            오늘 강의 (2025.00.00)
          </div>

          {/* 🔲 질문 필터 */}
          <div className="flex gap-3 text-sm text-[#646B72]">
            {questions.map((q) => (
              <button
                key={q.id}
                onClick={() => setSelectedQuestion(q.id)}
                className="flex items-center gap-2 focus:outline-none"
              >
                <span
                  className="w-4 h-4 rounded-[4px]"
                  style={{
                    backgroundColor: selectedQuestion === q.id ? "#323639" : "#646B72",
                  }}
                />
                {q.label}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <LectureCard name="수업 이름" room="강의실 이름" status="많음" />
          <LectureCard name="수업 이름" room="강의실 이름" status="많음" />
        </div>
      </div>

      {/* 📚 전체 강의 */}
      <div>
        <div className="flex items-center gap-2 text-[#202325] font-semibold mb-2">
          <Calendar className="w-5 h-5" />
          전체 강의
        </div>

        <div className="flex gap-2 mb-4">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-4 py-1 text-sm rounded-md border
                ${selectedFilter === f.id
                  ? "bg-[#646B72] text-white border-transparent"
                  : "text-[#555] border-[#DDE2E5]"}`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-3 mb-6">
          <LectureCard name="수업 이름" room="강의실 이름" status="많음" />
          <LectureCard name="수업 이름" room="강의실 이름" status="많음" />
          <LectureCard name="수업 이름" room="강의실 이름" status="보통" />
          <LectureCard name="수업 이름" room="강의실 이름" status="보통" />
          <LectureCard name="수업 이름" room="강의실 이름" status="적음" />
        </div>

        <div className="flex justify-center">
          <Button variant="outline" className="rounded-md text-[#555] border-[#D5DDE5]">
            더보기 ▼
          </Button>
        </div>
      </div>
    </div> // ✅ 여기서 닫힘 완료
  );
}

function LectureCard({
  name,
  room,
  status,
}: {
  name: string;
  room: string;
  status: "많음" | "보통" | "적음";
}) {
  const colorMap = {
    많음: "#646B72",
    보통: "#92B6FF",
    적음: "#C8CFD6",
  };

  return (
    <div className="bg-white px-6 py-4 rounded-xl flex justify-between items-center shadow-sm">
      <div className="text-[#202325] font-medium">
        {name} <span className="text-sm text-[#999]">({room})</span>
      </div>
      <Badge style={{ backgroundColor: colorMap[status], color: "#fff" }}>{status}</Badge>
    </div>
  );
}
