import { Bell, ChevronDown, ChevronRight, FilePenLine, Flag, LogOut, MessageSquareQuote, Settings, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
    const [reportReason, setReportReason] = useState("");

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
    
    const selectedQuestionsContent = questions.filter(q => selectedQuestionIds.includes(q.id));

    const reportReasons = [
        "스팸홍보/도배입니다.",
        "음란물입니다.",
        "불법정보를 포함하고 있습니다.",
        "욕설/생명경시/혐오/차별적 표현입니다.",
        "개인정보가 노출되었습니다.",
        "명예훼손 또는 불쾌한 표현이 있습니다.",
        "기타",
    ];

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
                                    if (selectedQuestionIds.length > 0) setIsModalOpen(true);
                                }}
                                disabled={selectedQuestionIds.length === 0}
                                className="hover:text-gray-800 disabled:text-gray-400"
                            >
                                일괄 응답
                            </button>
                            <button 
                                onClick={() => {
                                    if (selectedQuestionIds.length > 0) setIsReportModalOpen(true);
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

            <footer className="bg-white mt-16">
                <div className="container mx-auto px-8 py-6 flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                         <img src="/logo.png" alt="Logo" className="h-6 w-auto" />
                         <span className="text-gray-500">© 2025 티키타카</span>
                    </div>
                    <div className="flex gap-6 text-gray-500">
                        <a href="#" className="hover:text-gray-800">이용안내</a>
                        <a href="#" className="hover:text-gray-800">문의하기</a>
                        <a href="#" className="hover:text-gray-800">개인정보처리방침</a>
                        <a href="#" className="hover:text-gray-800">관리자</a>
                    </div>
                </div>
            </footer>
            
            {isModalOpen && (
                <div 
                    className="fixed inset-0 bg-[#000000]/50 flex justify-center items-center z-50"
                    onClick={() => setIsModalOpen(false)}
                >
                    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <FilePenLine className="w-6 h-6 text-gray-800" />
                                <h2 className="text-xl font-bold text-gray-900">일괄 응답</h2>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        
                        <div className="border-t my-6"></div>

                        <p className="text-sm text-gray-600 mb-4">
                            일괄 응답 질문 수: <span className="font-bold text-[#3B6CFF]">{selectedQuestionIds.length}</span>개
                        </p>

                        <div className="h-60 overflow-y-auto bg-gray-50 rounded-lg p-4 border space-y-3 text-sm text-gray-700">
                            {selectedQuestionsContent.map(q => <p key={q.id}>{q.content}</p>)}
                        </div>

                        <div className="flex justify-end gap-4 mt-8">
                            <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 px-6">AI 응답</Button>
                            <Button size="lg" className="bg-[#3B6CFF] hover:bg-[#3B6CFF]/90 px-6" onClick={() => setIsModalOpen(false)}>작성 완료</Button>
                        </div>
                    </div>
                </div>
            )}

            {isReportModalOpen && (
                <div 
                    className="fixed inset-0 bg-[#000000]/50 flex justify-center items-center z-50"
                    onClick={() => setIsReportModalOpen(false)}
                >
                    <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <Flag className="w-6 h-6 text-gray-800" />
                                <h2 className="text-xl font-bold text-gray-900">신고하기</h2>
                            </div>
                            <button onClick={() => setIsReportModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="border-t my-4"></div>
                        
                        <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded-md mb-4">
                            <span className="font-semibold">내용:</span> {selectedQuestionsContent[0]?.content.replace('질문 내용: ', '')}
                        </div>
                        
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-800">사유선택</h3>
                            {reportReasons.map((reason, index) => (
                                <div key={index} className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`reason-${index}`}
                                        name="reportReason"
                                        value={reason}
                                        checked={reportReason === reason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`reason-${index}`} className="ml-3 block text-sm text-gray-700">
                                        {reason}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                           <Button 
                                size="lg" 
                                className="w-full bg-[#3B6CFF] hover:bg-[#3B6CFF]/90"
                                onClick={() => setIsReportModalOpen(false)}
                                disabled={!reportReason}
                            >
                                신고하기
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <button className="fixed bottom-8 right-8 bg-[#3B6CFF] text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
                <MessageSquareQuote className="w-8 h-8" />
            </button>
        </div>
    );
}

export default QAProfessor;
