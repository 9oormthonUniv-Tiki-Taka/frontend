import { useState } from "react"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react";

const reasons = [
  "스팸홍보/도배입니다.",
  "음란물입니다.",
  "불법정보를 포함하고 있습니다.",
  "욕설/생명경시/혐오/차별적 표현입니다.",
  "개인정보가 노출되었습니다.",
  "명예훼손 또는 불쾌한 표현이 있습니다.",
  "기타",
]

interface ReportModalProps {
  open: boolean
  onClose: () => void
  onSubmit?: () => void
  questionContent?: string
  targetType?: string
  targetId?: number
}

export default function ReportGuide({ open, onClose, onSubmit, questionContent, targetType, targetId }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string | null>(null)
  const [etcReason, setEtcReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    if (!selectedReason) return
    
    setIsLoading(true)
    
    try {
      // 신고 사유 결정 (기타인 경우 사용자 입력 사용)
      const finalReason = selectedReason === "기타" ? etcReason : selectedReason
      
      if (selectedReason === "기타" && !etcReason.trim()) {
        alert("기타 사유를 입력해주세요.")
        setIsLoading(false)
        return
      }

      // 신고 API 호출
      const response = await fetch('https://api.tikitaka.o-r.kr/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          targetType: targetType || "question", // 기본값 설정
          targetId: targetId || 0,
          reason: finalReason
        })
      })

      if (response.ok) {
        const result = await response.json()
        console.log("신고 등록 완료:", result)
        alert("신고가 등록되었습니다.")
        
        if (onSubmit) onSubmit();
        onClose()
      } else {
        console.error("신고 등록 실패:", response.status)
        alert("신고 등록에 실패했습니다. 다시 시도해주세요.")
      }
    } catch (error) {
      console.error("신고 등록 중 오류:", error)
      alert("신고 등록 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md">
        <DialogHeader className="text-lg font-semibold">
          <span className="flex items-center gap-2">
            <img
              src={"/normalFlagIcon.png"}
              alt="flag"
              className="h-6 w-6"
            />
            신고하기
          </span>
        </DialogHeader>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-[#828C95]">내용:</span>
          <span className="text-[#464B51]">{typeof questionContent === "string" ? questionContent : ""}</span>
        </div>

        <div className="w-full h-px my-2 bg-[#C8CFD6]" />
        <p className="font-semibold text-base text-[#191A1C]">사유 선택</p>

        <div className="border border-[#C8CFD6] overflow-hidden mt-4">
          {reasons.map((reason, idx) => {
            const selected = selectedReason === reason;
            const isLast = idx === reasons.length - 1;
            const isEtc = reason === '기타';
            return (
              <div
                key={idx}
                onClick={() => setSelectedReason(reason)}
                className={`flex items-center cursor-pointer px-4 py-3 transition-colors bg-white border-b select-none text-sm font-semibold
                          ${selected ? 'border-[#3B6CFF] z-10' : 'border-[#C8CFD6]'}
                        `}
                style={{ borderWidth: 1, borderBottomWidth: isLast ? 0 : 1, borderColor: selected ? '#3B6CFF' : '#C8CFD6' }}
              >
                <span className="mr-3 flex items-center justify-center">
                  {selected ? (
                    <img src="/reportcheckIcon.png" alt="선택됨" className="w-5 h-5" />
                  ) : (
                    <span className="inline-block w-5 h-5 rounded-full border border-[#C8CFD6] bg-white" />
                  )}
                </span>
                <span className={`flex-1 text-base ${selected ? 'text-[#191A1C]' : 'text-[#464B51]'}`}>{reason}</span>
                {isEtc && (
                  <span className="ml-2 flex items-center">
                    {selected
                      ? <ChevronDown className="w-5 h-5 text-[#B1BAC1]" />
                      : <ChevronUp className="w-5 h-5 text-[#B1BAC1]" />
                    }
                  </span>
                )}
              </div>
            )
          })}
          {selectedReason === '기타' && (
            <div className="bg-[#F5F9FC] border-t border-[#C8CFD6] px-4 py-4" style={{ margin: '0.5rem 0', background: '#fff' }}>
              <div className="bg-[#F5F9FC] rounded p-3">
                <textarea
                  value={etcReason}
                  onChange={(e) => setEtcReason(e.target.value)}
                  className="w-full h-16 p-2 rounded bg-[#F5F9FC] border border-[#F5F9FC] focus:outline-none focus:ring-0 focus:border-transparent text-sm"
                  placeholder="기타 사유 작성"
                />
              </div>
            </div>
          )}
        </div>
        <Button 
          onClick={handleSubmit} 
          disabled={!selectedReason || isLoading} 
          className="w-full mt-4 bg-[#3B6CFF] hover:bg-[#3B6CFF] active:bg-[#3B6CFF] focus:bg-[#3B6CFF] border-none text-white disabled:opacity-50"
        >
          {isLoading ? "신고 중..." : "신고하기"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}