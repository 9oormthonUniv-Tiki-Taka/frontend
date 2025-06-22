import { Bell, ChevronDown, ChevronRight, LogOut, MessageSquareQuote, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ReportGuide from "@/components/ReportGuide"
import ReplyGuide from "@/components/ReplyGuide";
import Footer from "@/components/Footer"

type QuestionStatus = "전체" | "미응답" | "응답 완료";

const questions = [
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
        content: "질문 내용: 질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용질문내용...",
        date: "2025.00.00",
        status: "응답 완료",
    },
];

export function QAProfessor() {
    const [filter, setFilter] = useState<QuestionStatus>("전체");
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false)
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);

    const handleCheckboxChange = (questionId: number) => {
        setSelectedQuestionIds((prev) =>
            prev.includes(questionId)
                ? prev.filter((id) => id !== questionId)
                : [...prev, questionId]
        );
    };

    const filteredQuestions =
        filter === "전체"
            ? questions
            : questions.filter((q) => q.status === filter);

    return (
        <div className="min-h-screen bg-[#F2F6F9]">
            <header className="bg-transparent px-8 py-4 w-full">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                    </div>
                <div className="flex items-center gap-6 text-gray-600">
                        <button><Bell className="w-6 h-6" /></button>
                        <button><Settings className="w-6 h-6" /></button>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2 border-[#DCDDE0] text-[#4E5257]"
                        >
                        로그아웃 <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-8 py-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
                    <span>나의 강의 리스트</span>
                    <ChevronRight className="w-4 h-4" />
                    <span className="font-semibold text-gray-700">강의 이름 (강의실 이름)</span>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">강의 이름</h1>
                    <p className="text-gray-600">학생들의 질문을 답변하고 관리해보세요.</p>
                </div>

                <div className="rounded-lg p-8">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <MessageSquareQuote className="w-6 h-6 text-gray-700" />
                            <h2 className="text-xl font-bold text-gray-800">질문 목록</h2>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <button 
                                onClick={() => {
                                    if (selectedQuestionIds.length > 0) setReplyModalOpen(true);
                                }}
                                disabled={selectedQuestionIds.length === 0}
                                className="hover:text-gray-800 disabled:text-gray-400"
                            >
                                일괄 응답
                            </button>
                            <button 
                                onClick={() => {
                                    if (selectedQuestionIds.length > 0) setReportModalOpen(true);
                                }}
                                disabled={selectedQuestionIds.length === 0}
                                className="hover:text-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed"
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
                                        ? "bg-[#3B6CFF] text-white"
                                        : "bg-white text-gray-700 border-gray-300"}
                                    rounded-full px-5 py-2 text-sm font-semibold
                                `}
                            >
                                {f}
                            </Button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {filteredQuestions.map((q) => (
                            <div key={q.id} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center justify-between">
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
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${q.status === '응답 완료' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-800'}`}>
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

            <ReplyGuide open={replyModalOpen} onClose={() => setReplyModalOpen(false)} />
            <ReportGuide open={reportModalOpen} onClose={() => setReportModalOpen(false)} />

            <Footer />
        </div>
    );
}

export default QAProfessor;
