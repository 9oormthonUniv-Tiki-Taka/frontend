import { useState } from "react"
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

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
}

export default function ReportGuide({ open, onClose }: ReportModalProps) {
    const [selectedReason, setSelectedReason] = useState<string | null>(null)

    const handleSubmit = () => {
        if (!selectedReason) return
        console.log("신고 사유:", selectedReason)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-md">
                <DialogHeader className="text-lg font-semibold"><img
                    src={"/normalFlagIcon.png"}
                    alt="flag"
                    className="h-6 w-6"
                /> 신고하기</DialogHeader>
                <p className="text-sm text-gray-500">
                    내용: 질문내용질문내용질문내용질문내용...
                </p>
                <RadioGroup className="space-y-3 mt-4" onValueChange={setSelectedReason}>
                    {reasons.map((reason, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                            <RadioGroupItem value={reason} id={`r-${idx}`} />
                            <Label htmlFor={`r-${idx}`}>{reason}</Label>
                        </div>
                    ))}
                </RadioGroup>
                <Button onClick={handleSubmit} disabled={!selectedReason} className="w-full mt-4">
                    신고하기
                </Button>
            </DialogContent>
        </Dialog>
    )
}
