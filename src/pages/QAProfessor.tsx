import { ChevronDown, ChevronRight, MessageSquareText } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import ReportGuide from "@/components/ReportGuide"
import ReplyGuide from "@/components/ReplyGuide";
import Header from "@/components/Header"
import Footer from "@/components/Footer"

type QuestionStatus = "전체" | "미응답" | "응답완료";

// API 응답 타입 정의
interface User {
  email: string;
  studentId: string;
  point: number;
  name: string;
  avatar: string;
}

interface Answer {
  id: number;
  user: {
    nickname: string;
    role: string;
  };
  content: string;
  createdAt: string;
}

interface Question {
  id: number;
  content: string;
  status: string;
  user: User;
  answer: Answer[];
  answerCount: number;
  createdAt: string;
  medal: string;
  likes: number;
  likedByCurrentUser: boolean;
  wonder: number;
  wonderedByCurrentUser: boolean;
}

interface ApiResponse {
  [key: string]: Question[];
}

const initialQuestions: Array<{
    id: number;
    content: string;
    date: string;
    status: string;
    answers: Array<{
        content: string;
        createdAt: string;
        user: {
            nickname: string;
            role: string;
        };
    }>;
}> = [
];

export function QAProfessor() {
    const [questions, setQuestions] = useState(initialQuestions);
    const [filter, setFilter] = useState<QuestionStatus>("전체");
    const [replyModalOpen, setReplyModalOpen] = useState(false);
    const [reportModalOpen, setReportModalOpen] = useState(false)
    const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);
    const [fabHover, setFabHover] = useState(false);
    const [openQuestionId, setOpenQuestionId] = useState<number | null>(null);
    const [answerInput, setAnswerInput] = useState("");
    const [answerEditIndex, setAnswerEditIndex] = useState<number | null>(null);
    const [lectureId, setLectureId] = useState<number | null>(null);
    const [lectureName, setLectureName] = useState<string>("");
    const [roomName, setRoomName] = useState<string>("");

    // 답변 저장 함수
    const saveComment = async (questionId: number, content: string) => {
        const API_BASE_URL = 'https://api.tikitaka.o-r.kr';
        try {
            const response = await fetch(`${API_BASE_URL}/api/lectures/${lectureId}/questions/${questionId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('Authorization'),
                },
                body: JSON.stringify({
                    userId: 1,
                    content: content
                })
            });
            
            if (response.ok) {
                console.log('답변 저장 성공');
                // 로컬 상태 업데이트
                setQuestions(prev => prev.map(qq => qq.id === questionId ? { ...qq, answers: [...(qq.answers || []), { content, createdAt: new Date().toISOString(), user: { nickname: '교수님', role: 'professor' } }], status: "응답완료" } : qq));
                setAnswerInput("");
                setAnswerEditIndex(null);
            } else {
                console.error('답변 저장 실패:', response.status);
                alert('답변 저장에 실패했습니다.');
            }
        } catch (error) {
            console.error('답변 저장 중 오류:', error);
            alert('답변 저장 중 오류가 발생했습니다.');
        }
    };

    // AI 답변 조회 함수
    const getAIResponse = async (questionId: number) => {
        const API_BASE_URL = 'https://api.tikitaka.o-r.kr';
        try {
            const response = await fetch(`${API_BASE_URL}/api/lectures/${lectureId}/questions/${questionId}/ai`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('Authorization'),
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('AI 답변 조회 성공:', data);
                setAnswerInput(data.content); // textarea에 AI 답변 설정
            } else {
                console.error('AI 답변 조회 실패:', response.status);
                alert('AI 답변 조회에 실패했습니다.');
            }
        } catch (error) {
            console.error('AI 답변 조회 중 오류:', error);
            alert('AI 답변 조회 중 오류가 발생했습니다.');
        }
    };

    // 실시간 질문 조회 API
    const fetchLiveQuestions = async (lectureId: number) => {
        const API_BASE_URL = 'https://api.tikitaka.o-r.kr';
        try {
            const url = `${API_BASE_URL}/api/lectures/${lectureId}/live/questions`;
            const res = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'accept': '*/*',
                    'Authorization': 'Bearer ' + localStorage.getItem('Authorization'),
                }
            });
            
            if (res.ok) {
                const data: ApiResponse = await res.json();
                console.log("실시간 질문 데이터:", data);
                
                // API 응답에서 질문 데이터 추출 및 변환
                const allQuestions: Question[] = [];
                Object.values(data).forEach(questionArray => {
                    if (Array.isArray(questionArray)) {
                        allQuestions.push(...questionArray);
                    }
                });
                
                // 기존 형식에 맞게 변환
                const convertedQuestions = allQuestions.map((q: Question) => ({
                    id: q.id,
                    content: q.content,
                    date: new Date(q.createdAt).toLocaleDateString('ko-KR'),
                    status: selectedQuestionIds.includes(q.id) ? "미응답" : 
                           (q.status === "WAITING" ? "미응답" : 
                           q.status === "ANSWERED" ? "응답완료" : q.status),
                    answers: q.answer.map(ans => ({
                        content: ans.content,
                        createdAt: ans.createdAt,
                        user: ans.user
                    })),
                }));
                
                setQuestions(convertedQuestions);
            } else {
                console.error('실시간 질문 조회 실패:', res.status);
                // 실패 시 기존 더미 데이터 유지
            }
        } catch (error) {
            console.error('실시간 질문 조회 에러:', error);
            // 에러 시 기존 더미 데이터 유지
        }
    };

    // 컴포넌트 마운트 시 실시간 질문 조회
    useEffect(() => {
        // URL 파라미터에서 강의 ID, 강의 이름, 강의실 이름 가져오기
        const urlParams = new URLSearchParams(window.location.search);
        const lectureIdFromUrl = parseInt(urlParams.get('id') || '0'); // null 처리
        const lectureNameFromUrl = urlParams.get('name') || ''; // 강의 이름
        const roomNameFromUrl = urlParams.get('room') || ''; // 강의실 이름
        
        if (!isNaN(lectureIdFromUrl) && lectureIdFromUrl > 0) {
            setLectureId(lectureIdFromUrl); // state에 저장
            setLectureName(decodeURIComponent(lectureNameFromUrl)); // URL 디코딩
            setRoomName(decodeURIComponent(roomNameFromUrl)); // URL 디코딩
            fetchLiveQuestions(lectureIdFromUrl);
        } else {
            console.error('유효하지 않은 강의 ID입니다');
        }
    }, []);

    const handleCheckboxChange = (questionId: number) => {
        setSelectedQuestionIds((prev) =>
            prev.includes(questionId)
                ? prev.filter((id) => id !== questionId)
                : [...prev, questionId]
        );
    };

    const handleReplySubmit = (replyText: string) => {
        console.log("Submitted reply:", replyText);
        console.log("Selected question IDs:", selectedQuestionIds);
        
        setQuestions(prevQuestions =>
            prevQuestions.map(q =>
                selectedQuestionIds.includes(q.id) ? { ...q, status: "응답완료" } : q
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
                    <span className="font-semibold text-gray-700">{lectureName} ({roomName})</span>
                </div>

                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-800 mb-6">{lectureName}</h1>
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
                        {(["전체", "미응답", "응답완료"] as QuestionStatus[]).map((f) => (
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
                        {filteredQuestions.map((q) => {
                            const isOpen = openQuestionId === q.id;
                            return (
                                <div key={q.id} className={`bg-white rounded-lg ${isOpen ? 'border-[#646B72]' : 'border-gray-200'}`}>
                                    <div className={`flex justify-between items-center p-6 gap-4 cursor-pointer border-b border-b-[#DEE4E9]`}>
                                        <div className="flex items-center gap-4">
                                            <Checkbox 
                                                id={`q-${q.id}`}
                                                checked={selectedQuestionIds.includes(q.id)}
                                                onCheckedChange={() => handleCheckboxChange(q.id)}
                                            />
                                            <span className="font-bold text-[#191A1C]">질문 내용:</span>
                                            <span className="truncate max-w-[400px] text-[#191A1C]">{q.content}</span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <span className="text-sm text-gray-500">{q.date}</span>
                                            <span className={`w-20 text-center py-1 text-xs font-semibold rounded-lg text-white ${q.status === '응답완료' ? 'bg-[#5D89FF]' : 'bg-[#828C95]'}`}>{q.status}</span>
                                            <button onClick={() => setOpenQuestionId(isOpen ? null : q.id)}>
                                                <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                        </div>
                                    </div>
                                    {isOpen && (
                                        <div className="bg-white rounded-lg px-8 py-8 mt-4">
                                            <div className="text-[#646B72] mb-12 ml-4 text-sm font-semibold">내용: <span className="font-normal text-[#646B72]">{q.content}</span></div>
                                            <div className="w-full h-px my-4 bg-[#C8CFD6]" />
                                            {(answerEditIndex !== null) ? (
                                                <>
                                                    <textarea
                                                        className="w-full h-32 p-4 rounded-xl bg-[#F5F9FC] border-none focus:outline-none focus:ring-0 focus:border-none resize-none text-[#191A1C]"
                                                        placeholder="답변을 입력하세요."
                                                        value={answerInput}
                                                        onChange={e => setAnswerInput(e.target.value)}
                                                    />
                                                    <div className="flex justify-end gap-2 mt-4 font-semibold">
                                                        <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 px-6 font-semibold" onClick={() => getAIResponse(q.id)}>AI 응답</Button>
                                                        <Button size="lg" className="bg-[#3B6CFF] hover:bg-[#3B6CFF]/90 px-6 text-white font-semibold" onClick={() => {
                                                            if (!answerInput.trim()) return;
                                                            
                                                            // 서버에 답변 저장
                                                            saveComment(q.id, answerInput);
                                                        }}>작성 완료</Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    {(q.answers || []).map((ans, idx: number) => (
                                                        <div key={idx} className="bg-[#F5F9FC] rounded-xl p-6 relative mb-4">
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <div className="font-semibold text-[#646B72]">{'티키'} ({'교수님'})</div>
                                                                    <div className="text-xs text-[#C8CFD6]">{new Date(ans.createdAt).toLocaleString('ko-KR')}</div>
                                                                </div>
                                                                <button className="text-[#646B72] text-sm font-semibold hover:underline hover:decoration-[#646B72] underline-offset-4" onClick={() => {
                                                                    setAnswerInput(ans.content);
                                                                    setAnswerEditIndex(idx);
                                                                }}>수정하기</button>
                                                            </div>
                                                            <div className="mt-2 text-[#191A1C] whitespace-pre-line">{ans.content}</div>
                                                        </div>
                                                    ))}
                                                    <textarea
                                                        className="w-full h-32 p-4 rounded-xl bg-[#F5F9FC] border-none focus:outline-none focus:ring-0 focus:border-none resize-none text-[#191A1C] mt-2"
                                                        placeholder="답변을 입력하세요."
                                                        value={answerInput}
                                                        onChange={e => setAnswerInput(e.target.value)}
                                                    />
                                                    <div className="flex justify-end gap-2 mt-4">
                                                        <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 px-6 font-semibold" onClick={() => getAIResponse(q.id)}>AI 응답</Button>
                                                        <Button size="lg" className="bg-[#3B6CFF] hover:bg-[#3B6CFF]/90 px-6 text-white font-semibold" onClick={() => {
                                                            if (!answerInput.trim()) return;
                                                            
                                                            // 서버에 답변 저장
                                                            saveComment(q.id, answerInput);
                                                        }}>작성 완료</Button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="text-center mt-8">
                        <Button variant="outline" className="border-gray-300 text-gray-700 bg-[#F2F6F9]">
                            더보기 <ChevronDown className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>

            <ReplyGuide 
                open={replyModalOpen} 
                onClose={() => setReplyModalOpen(false)} 
                questionContents={selectedQuestionContents} 
                questionIDs={selectedQuestionIds.map(String)}
                lectureId={lectureId?.toString()}
                onSubmit={handleReplySubmit} 
            />
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