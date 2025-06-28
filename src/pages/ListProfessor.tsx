import { useState, useEffect } from "react";
import { Calendar, ChevronDown, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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

export default function ListProfessor() {
  const [selectedFilter, setSelectedFilter] = useState(1);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [lectures, setLectures] = useState<{ id: string; name: string; room: string; status: "많음" | "보통" | "적음" }[]>([]);

  useEffect(() => {
    fetch("https://api.tikitaka.o-r.kr/api/lectures")
      .then((res) => res.json())
      .then((data) => setLectures(data.lectures || []))
      .catch(() => setLectures([]));
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen flex flex-col bg-[#F8FBFF]">
      <Header />

      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-[1000px] px-4 py-10">
          {/* 제목 */}
          <h1 className="text-2xl font-bold text-center text-[#202325] mb-4">나의 강의 리스트</h1>
          <p className="text-base text-center text-[#555] mb-10">담당 중인 강의를 확인하고 질문을 관리해보세요.</p>


          {/* 검색창 */}
          <div className="relative w-full mb-14">
            <Input
              type="text"
              placeholder="강의명을 입력하세요..."
              className="w-full bg-white pl-5 pr-12 py-4 text-base rounded-full border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-400"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
          </div>

          {/* 오늘 강의 */}
          <section className="mb-16">
            <div className="flex items-center flex-wrap gap-2 mb-4">
              <Calendar className="w-5 h-5 text-gray-500" />
              <h2 className="text-base font-medium text-gray-800">
                오늘 강의 (2025.00.00)
              </h2>
              <div className="flex flex-wrap gap-3 text-sm text-[#646B72] ml-auto">
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
              {lectures.slice(0, 2).map((lecture, i) => (
                <HoverCard key={lecture.id || i} lecture={lecture} />
              ))}
            </div>
          </section>

          {/* 전체 강의 */}
          <div>
            <div className="flex items-center gap-2 text-[#202325] font-semibold mb-2 text-base">
              <Calendar className="w-5 h-5" />
              전체 강의
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {filters.map((f) => (
                <button
                  key={f.id}
                  className={`text-sm px-4 py-2 rounded-full transition-colors ${selectedFilter === f.id
                      ? "bg-[#646B72] text-white"
                      : "bg-[#F2F6F9] text-[#323639] hover:bg-[#E9EEF2]"
                    }`}
                  onClick={() => setSelectedFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="space-y-3 mb-6">
              {lectures.slice(0, 2).map((lecture) => (
                <LectureCard
                  key={lecture.id}
                  name={lecture.name}
                  room={lecture.room}
                  status={lecture.status || "보통"}
                />
              ))}
            </div>

            <div className="w-full text-center mt-8">
              <button className="border border-gray-300 px-5 py-2 text-sm rounded-md flex items-center justify-center gap-1 hover:bg-gray-100 mx-auto">
                <span>더보기</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
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
    <div className="cursor-pointer bg-white px-4 py-3 rounded-xl flex justify-between items-center shadow-sm hover:bg-[#F2F6F9] transition-colors">
      <div className="text-[#202325] font-medium text-sm">
        {name} <span className="text-xs text-[#999]">({room})</span>
      </div>
      <span
        style={{
          backgroundColor: colorMap[status],
          color: "#fff",
          padding: "2px 6px",
          borderRadius: "4px",
          fontSize: "12px",
        }}
      >
        {status}
      </span>
    </div>
  );
}

function HoverCard({ lecture }: { lecture: { id: string; name: string; room: string } }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/lives?id=${lecture.id}`)}
      className="group flex justify-between items-center bg-white hover:bg-[#E9EEF2] transition-colors rounded-md py-4 px-5 text-sm text-gray-700 border border-gray-200 cursor-pointer"
    >
      {lecture.name} ({lecture.room})
      <ChevronRight className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
    </div>
  );
}
