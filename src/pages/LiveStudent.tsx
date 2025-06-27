import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Header from "@/components/Header"
import ReportGuide from "@/components/ReportGuide"

interface QAItem {
    id: string
    user: string
    timestamp: string
    question: string
    answer?: string
    likeCount?: number
    curiousCount?: number
    liked?: boolean
    curious?: boolean
    awarded?: boolean
    flaged?: boolean
}

const lectureId = "1"

function mapApiToQAItem(api: any): QAItem {
    return {
        id: api.id,
        user: api.user?.nickname ?? "익명",
        timestamp: api.created_at ?? "",
        question: api.content ?? "",
        answer: api.answer?.content ?? undefined,
        likeCount: api.likes ?? 0,
        curiousCount: api.wonder ?? 0,
        liked: api.likedByCurrentUser,
        curious: api.wonderedByCurrentUser,
        awarded: api.medal ? true : false,
        flaged: false,
    }
}

export default function LiveStudent() {
    const [qas, setQAs] = useState<QAItem[]>([])
    const [answerInput, setAnswerInput] = useState("")
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
    const [reportModalOpen, setReportModalOpen] = useState(false)

    const fetchQuestions = async () => {
        try {
            const res = await fetch(`http://localhost:3001/api/lectures/${lectureId}/live/questions`);
            const data = await res.json();
            console.log("질문 데이터:", data);
            if (Array.isArray(data.questions)) {
                console.log("질문 개수:", data.questions.length, data.questions);
                setQAs(data.questions.map(mapApiToQAItem));
            }
        } catch {
            setQAs([]);
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, [])

    const handleSelectQuestion = (id: string) => {
        setSelectedQuestionId((prev) => (prev === id ? null : id))
    }

    const handleLike = (id: string) => {
        setQAs((prev) =>
            prev.map((qa) =>
                qa.id === id
                    ? {
                        ...qa,
                        liked: !qa.liked,
                        likeCount: qa.liked
                            ? Math.max(0, (qa.likeCount ?? 1) - 1)
                            : (qa.likeCount ?? 0) + 1,
                    }
                    : qa
            )
        );
        // 최신 상태를 기반으로 전송
        setTimeout(() => {
            const updated = qas.find((qa) => qa.id === id);
            const isLiked = updated?.liked ?? false;
            const likeCount = updated?.likeCount ?? 0;
            const newLiked = !isLiked;
            const newLikeCount = newLiked
                ? likeCount + 1
                : Math.max(0, likeCount - 1);

            console.log(`like 클릭: id=${id}, liked(이전)=${isLiked}, liked(다음)=${newLiked}, likeCount(전송)=${newLikeCount}`);

            const ws = new WebSocket(`ws://localhost:3001/api/lectures/${lectureId}/live`);
            ws.onopen = () => {
                ws.send(JSON.stringify({
                    type: "like",
                    request: {
                        questionId: id,
                        type: "",
                        amount: newLikeCount
                    }
                }));
                ws.close();
            };
            ws.onclose = () => {
                fetchQuestions();
            };
        }, 0);
    }

    const handleCurious = (id: string) => {
        setQAs((prev) =>
            prev.map((qa) =>
                qa.id === id
                    ? {
                        ...qa,
                        curious: !qa.curious,
                        curiousCount: qa.curious
                            ? Math.max(0, (qa.curiousCount ?? 1) - 1)
                            : (qa.curiousCount ?? 0) + 1,
                    }
                    : qa
            )
        );
        setTimeout(() => {
            const updated = qas.find((qa) => qa.id === id);
            const isCurious = updated?.curious ?? false;
            const curiousCount = updated?.curiousCount ?? 0;
            const newCurious = !isCurious;
            const newCuriousCount = newCurious
                ? curiousCount + 1
                : Math.max(0, curiousCount - 1);

            console.log(`wonder 클릭: id=${id}, curious(이전)=${isCurious}, curious(다음)=${newCurious}, curiousCount(전송)=${newCuriousCount}`);

            const ws = new WebSocket(`ws://localhost:3001/api/lectures/${lectureId}/live`);
            ws.onopen = () => {
                ws.send(JSON.stringify({
                    type: "wonder",
                    request: {
                        questionId: id,
                        type: "",
                        amount: newCuriousCount
                    }
                }));
                ws.close();
            };
            ws.onclose = () => {
                fetchQuestions();
            };
        }, 0);
    }

    const handleEdit = (id: string) => {
        const target = qas.find((qa) => qa.id === id)
        if (target) {
            setSelectedQuestionId(id)
            setAnswerInput(target.question)
        }
    }

    const [reportTargetId, setReportTargetId] = useState<string | null>(null);

    const handleReport = (id: string) => {
        setReportTargetId(id);
        setReportModalOpen(true);
    }

    const handleSendAnswer = () => {
        if (!answerInput.trim()) return

        if (selectedQuestionId) {
            setQAs((prev) =>
                prev.map((qa) => (qa.id === selectedQuestionId ? { ...qa, question: answerInput } : qa))
            )
        } else {
            const ws = new WebSocket(`ws://localhost:3001/api/lectures/${lectureId}/live`);
            ws.onopen = () => {
                ws.send(JSON.stringify({
                    type: "question",
                    request: {
                        content: answerInput
                    }
                }));
                ws.close();
                fetchQuestions();
            };
        }

        setAnswerInput("")
        setSelectedQuestionId(null)
    }

    return (
        <div className="absolute top-0 left-0 w-full min-h-screen flex flex-col bg-[#F2F6F9]">
            <Header />
            <main className="w-full flex-1 flex justify-center">
                <div className="w-full max-w-[1000px] px-4">
                    {qas.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center text-center px-8">
                            <p className="text-2xl font-semibold text-gray-600">아직 올라온 질문이 없어요 🥲</p>
                        </div>
                    ) : (
                        <div className="px-8">
                            <div className="space-y-8">
                                {qas.map((qa) => (
                                    <div key={qa.id + qa.question} className="space-y-4">
                                        <div className="flex gap-4">
                                            <Avatar className="h-12 w-12 bg-gray-300 flex-shrink-0">
                                                <AvatarFallback className="text-base font-medium">{qa.user.slice(-2)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <Card
                                                    className={`group relative cursor-pointer border-none shadow-none rounded-tl-none ${selectedQuestionId === qa.id ? "ring-1 ring-[#3B6CFF]" : ""}`}
                                                    onClick={() => handleSelectQuestion(qa.id)}
                                                >
                                                    <CardContent className="p-5 pb-3 relative">
                                                        <div className="absolute top-5 right-5 z-10">
                                                            <div className="flex overflow-hidden rounded-xl border border-gray-300 bg-white shadow-sm">
                                                                <div className="flex">
                                                                    <button
                                                                        className="flex items-center justify-center p-2 hover:bg-gray-100"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleLike(qa.id);
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={qa.liked ? "/likeIcon.png" : "/normalLikeIcon.png"}
                                                                            alt="like"
                                                                            className="h-6 w-6"
                                                                        />
                                                                    </button>

                                                                    <button
                                                                        className="flex items-center justify-center p-2 hover:bg-gray-100"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleCurious(qa.id);
                                                                        }}
                                                                    >
                                                                        <img
                                                                            src={qa.curious ? "/wonderIcon.png" : "/normalWonderIcon.png"}
                                                                            alt="curious"
                                                                            className="h-6 w-6"
                                                                        />
                                                                    </button>
                                                                    <button className="flex items-center justify-center p-2 hover:bg-gray-100">
                                                                        답변 완료
                                                                    </button>
                                                                </div>

                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <button
                                                                            className="flex items-center justify-center p-2 hover:bg-gray-100 border-l border-gray-300"
                                                                            onClick={(e) => e.stopPropagation()}
                                                                        >
                                                                            <img src="/othersIcon.png" alt="menu" className="h-6 w-6" />
                                                                        </button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent
                                                                        side="bottom"
                                                                        align="end"
                                                                        className="w-28"
                                                                    >
                                                                        <DropdownMenuItem onClick={() => handleReport(qa.id)}>
                                                                            신고하기
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleEdit(qa.id)}>
                                                                            수정하기
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-900 whitespace-pre-line text-base leading-relaxed">{qa.question}</p>
                                                        <span className="text-sm text-gray-500 mt-2 block">{qa.timestamp}</span>
                                                    </CardContent>
                                                </Card>


                                                <div className="mt-2 flex gap-2">
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-gray-200 text-sm">
                                                        <img src="/likeIcon.png" alt="like" className="h-6 w-6" />
                                                        {qa.likeCount ?? 0}
                                                    </div>
                                                    <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-gray-200 text-sm">
                                                        <img src="/wonderIcon.png" alt="curious" className="h-6 w-6" />
                                                        {qa.curiousCount ?? 0}
                                                    </div>
                                                </div>

                                                {qa.answer && (
                                                    <div className="relative mt-4 ml-6">
                                                        <div className="absolute left-[-1.5rem] top-0 w-5 h-7">
                                                            <div className="absolute left-0 top-0 w-px h-7 bg-gray-400"></div>
                                                            <div className="absolute left-0 bottom-0 w-5 h-px bg-gray-400"></div>
                                                        </div>
                                                        <div className="bg-white rounded-lg p-5 border border-gray-200">
                                                            <p className="text-gray-900 leading-relaxed text-base">{qa.answer}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <ReportGuide
                open={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                questionContent={
                    reportTargetId
                        ? qas.find((qa) => qa.id === reportTargetId)?.question ?? ""
                        : ""
                }
                onSubmit={async (reason: string) => {
                    if (!reportTargetId) return;
                    const payload = {
                        targetType: "question",
                        targetId: reportTargetId,
                        reason,
                    };
                    console.log("신고 데이터 전송:", payload);
                    await fetch("/api/reports", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(payload),
                    });
                    setReportModalOpen(false);
                }}
            />

            <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 px-8">
                <div className="flex gap-4">
                    <Input
                        value={answerInput}
                        onChange={(e) => setAnswerInput(e.target.value)}
                        placeholder="질문을 입력하거나 수정을 완료하세요"
                        className="flex-1 rounded-full border border-gray-300 px-6 py-4 text-base"
                    />
                    <Button variant="ghost" onClick={handleSendAnswer} disabled={!answerInput.trim()}>
                        <img src="/sendIcon.png" alt="send" className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
