import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
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
        awarded: api.medal ? true : false,
        flaged: false,
    }
}

export default function LiveProfessor() {
    const [qas, setQAs] = useState<QAItem[]>([])
    const [answerInput, setAnswerInput] = useState("")
    const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
    const [reportModalOpen, setReportModalOpen] = useState(false)

    useEffect(() => {
        fetch(`/api/lectures/${lectureId}/live/questions`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data.questions)) {
                    setQAs(data.questions.map(mapApiToQAItem))
                }
            })
            .catch(() => setQAs([]))
    }, [])

    const handleSelectQuestion = (id: string) => {
        setSelectedQuestionId((prev) => (prev === id ? null : id))
    }

    const handleSendAnswer = () => {
        if (!answerInput.trim() || !selectedQuestionId) return

        const ws = new WebSocket(`wss://${window.location.host}/api/lectures/${lectureId}/live`);
        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "answer",
                request: {
                    questionId: selectedQuestionId,
                    content: answerInput
                }
            }));
            ws.close();
        };

        setAnswerInput("")
        setSelectedQuestionId(null)
    }

    const handleToggleAward = (id: string) => {
        setQAs((prev) => prev.map((qa) => (qa.id === id ? { ...qa, awarded: !qa.awarded } : qa)))
    }

    const handleToggleFlag = (id: string) => {
        setQAs((prev) =>
            prev.map((qa) => (qa.id === id ? { ...qa, flaged: !qa.flaged } : qa))
        )
        setReportModalOpen(true)
    }

    return (
        <div className="absolute top-0 left-0 w-full min-h-screen flex flex-col bg-[#F2F6F9]">
            <Header />
            <main className="w-full flex-1 flex justify-center">
                <div className="w-full max-w-[1000px] px-4">                {qas.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center text-center px-8">
                        <p className="text-2xl font-semibold text-gray-600">아직 올라온 질문이 없어요 🥲</p>
                    </div>
                ) : (
                    <div className="px-8">
                        <div className="space-y-8">
                            {qas.map((qa) => (
                                <div key={qa.id} className="space-y-4">
                                    <div className="flex gap-4">
                                        <Avatar className="h-12 w-12 bg-gray-300 flex-shrink-0">
                                            <AvatarFallback className="text-base font-medium">{qa.user.slice(-2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <Card
                                                className={`group cursor-pointer border-none shadow-none rounded-tl-none ${selectedQuestionId === qa.id ? "ring-1 ring-[#3B6CFF]" : ""
                                                    }`}
                                                onClick={() => handleSelectQuestion(qa.id)}
                                            >
                                                <CardContent className="p-5 pb-3">
                                                    <p className="text-gray-900 whitespace-pre-line text-base leading-relaxed">{qa.question}</p>
                                                    <span className="text-sm text-gray-500 mt-2 block">{qa.timestamp}</span>
                                                    <div className="hidden group-hover:flex gap-2 mt-3">
                                                        <button
                                                            onClick={() => handleToggleAward(qa.id)}
                                                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-200 text-sm"
                                                        >
                                                            <img
                                                                src={qa.awarded ? "/checkAwardIcon.png" : "/normalAwardIcon.png"}
                                                                alt="award"
                                                                className="h-6 w-6"
                                                            />
                                                        </button>
                                                        <button
                                                            onClick={() => handleToggleFlag(qa.id)}
                                                            className="flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-200 text-sm"
                                                        >
                                                            <img
                                                                src={qa.flaged ? "/checkFlagIcon.png" : "/normalFlagIcon.png"}
                                                                alt="flag"
                                                                className="h-6 w-6"
                                                            />
                                                        </button>
                                                        <button className="flex items-center gap-1 px-2 py-1 rounded-md bg-white border border-gray-200 shadow-sm hover:bg-gray-200 text-sm">
                                                            답변 완료
                                                        </button>
                                                    </div>
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
                                                <div className="relative mt-4">
                                                    <div className="absolute left-1 top-0 w-5 h-7">
                                                        <div className="absolute left-0 top-0 w-px h-7 bg-gray-400"></div>
                                                        <div className="absolute left-0 bottom-0 w-5 h-px bg-gray-400"></div>
                                                    </div>
                                                    <div className="ml-6 bg-white rounded-lg p-5 border border-gray-200">
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
            <ReportGuide open={reportModalOpen} onClose={() => setReportModalOpen(false)} />

            {selectedQuestionId && (
                <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 px-8">
                    <div className="flex gap-4">
                        <Input
                            value={answerInput}
                            onChange={(e) => setAnswerInput(e.target.value)}
                            placeholder="답변을 입력해주세요"
                            className="flex-1 rounded-full border border-gray-300 px-6 py-4 text-base"
                        />
                        <Button variant="ghost" onClick={handleSendAnswer} disabled={!answerInput.trim()}>
                            <img src="/sendIcon.png" alt="send" className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
