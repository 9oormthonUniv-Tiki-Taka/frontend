import { ChevronDown, ChevronRight, MessageSquareText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ReportGuide from "@/components/ReportGuide"
import ReplyGuide from "@/components/ReplyGuide";
import Header from "@/components/Header"
import Footer from "@/components/Footer"

type QuestionStatus = "전체" | "미응답" | "응답 완료";

const initialQuestions = [
    {
        id: 1,
        content: "질문 내용: 질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용...",
        date: "2025.00.00",
        status: "미응답",
    },
    {
        id: 2,
        content: "질문 내용: 질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용...",
        date: "2025.00.00",
        status: "응답 완료",
    },
    {
        id: 3,
        content: "질문 내용: 질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용...",
        date: "2025.00.00",
        status: "응답 완료",
    },
    {
        id: 4,
        content: "질문 내용: 질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용...",
        date: "2025.00.00",
        status: "미응답",
    },
    {
        id: 5,
        content: "질문 내용: 질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용...",
        date: "2025.00.00",
        status: "응답 완료",
    },
];

export function QAProfessor() {
    const [questions, setQuestions] = useState(initialQuestions);
    const [filter, setFilter] = useState<QuestionStatus>("전체");
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false)
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
    const [fabHover, setFabHover] = useState(false);

    const handleCheckboxChange = (questionId: number) => {
        setSelectedQuestionIds((prev) =>
            prev.includes(questionId)
                ? prev.filter((id) => id !== questionId)
                : [...prev, questionId]
        );
    };

    const handleReplySubmit = (replyText: string) => {
        console.log("Submitted reply:", replyText);
        setQuestions(prevQuestions =>
            prevQuestions.map(q =>
                selectedQuestionIds.includes(q.id) ? { ...q, status: "응답 완료" } : q
            )
        );
        setSelectedQuestionIds([]);
        setReplyModalOpen(false);
    };

    const filteredQuestions =
        filter === "전체"
            ? questions
            : questions.filter((q) => q.status === filter);

    const selectedQuestionContents = questions
        .filter(q => selectedQuestionIds.includes(q.id))
        .map(q => q.content);

    return (
        <div className="absolute top-0 left-0 w-full min-h-screen flex flex-col bg-[#F2F6F9]">
            <Header />
            <div className="container mx-auto px-8 py-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <span>나의 강의 리스트</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="font-semibold text-gray-700">강의 이름 (강의실 이름)</span>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">강의 이름</h1>
                    <p className="text-gray-600">학생들의 질문을 답변하고 관리해보세요.</p>
                </div>

                <div className="rounded-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <MessageSquareText className="w-6 h-6 text-[#191A1C]" />
                            <h2 className="text-xl font-bold text-[#191A1C]">질문 목록</h2>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <button 
                                onClick={() => {
                                    if (selectedQuestionIds.length > 0) setReplyModalOpen(true);
                                }}
                                disabled={selectedQuestionIds.length === 0}
                                className="hover:text-gray-800 disabled:text-[#191A1C] hover:underline hover:decoration-[#646B72] underline-offset-4"
                            >
                                일괄 응답
                            </button>
                            <button 
                                onClick={() => {
                                    if (selectedQuestionIds.length > 0) setReportModalOpen(true);
                                }}
                                disabled={selectedQuestionIds.length === 0}
                                className="hover:text-gray-800 disabled:text-[#191A1C] disabled:cursor-not-allowed hover:underline hover:decoration-[#646B72] underline-offset-4"
                            >
                                질문 신고
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-6">
                        {(["전체", "미응답", "응답 완료"] as QuestionStatus[]).map((f) => (
                            <Button
                                key={f}
                                variant={filter === f ? "default" : "outline"}
                                onClick={() => setFilter(f)}
                                className={`
                                    ${filter === f
                                        ? "bg-[#3B6CFF] text-white hover:bg-[#E9EEF2] hover:text-black border border-transparent"
                                        : "bg-transparent text-gray-700 border-gray-300"}
                                    rounded-lg px-5 py-2 text-sm font-semibold
                                `}
                            >
                                {f}
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filteredQuestions.map((q) => (
                            <div key={q.id} className="bg-white border border-gray-200 rounded-lg py-6 px-4 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Checkbox 
                                        id={`q-${q.id}`}
                                        checked={selectedQuestionIds.includes(q.id)}
                                        onCheckedChange={() => handleCheckboxChange(q.id)}
                                    />
                                    <label htmlFor={`q-${q.id}`} className="text-gray-700 cursor-pointer">{q.content}</label>
                                </div>
                                <div className="flex items-center gap-6">
                                    <span className="text-sm text-gray-500">{q.date}</span>
                                    <span className={`w-20 text-center py-1 text-xs font-semibold rounded-lg text-white ${q.status === '응답 완료' ? 'bg-[#5D89FF]' : 'bg-[#828C95]'}`}>
                                        {q.status}
                                    </span>
                                    <button>
                                        <ChevronDown className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="text-center mt-8">
                        <Button variant="outline" className="border-gray-300 text-gray-700">
                            더보기 <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>

            <ReplyGuide open={replyModalOpen} onClose={() => setReplyModalOpen(false)} questionContents={selectedQuestionContents} onSubmit={handleReplySubmit} />
            <ReportGuide open={reportModalOpen} onClose={() => setReportModalOpen(false)} />

            <button
                className={`fixed top-1/2 -translate-y-1/2 right-10 flex items-center shadow-lg transition-all duration-300
                    ${fabHover ? 'bg-blue-500 px-6 rounded-full w-56' : 'bg-blue-500 p-4 rounded-full w-14'}
                `}
                onMouseEnter={() => setFabHover(true)}
                onMouseLeave={() => setFabHover(false)}
                style={{ minHeight: 56 }}
            >
                <img
                    src="/FABlogo.png"
                    alt="New Question"
                    className="w-6 h-6"
                    style={{ minWidth: 24, minHeight: 24 }}
                />
                <span
                    className={`ml-3 text-white font-semibold whitespace-nowrap transition-opacity duration-200 ${fabHover ? 'opacity-100' : 'opacity-0'}`}
                    style={{ pointerEvents: fabHover ? 'auto' : 'none' }}
                >
                    실시간 참여하기
                </span>
            </button>

            <Footer />
        </div>
    );
}

export default QAProfessor;
