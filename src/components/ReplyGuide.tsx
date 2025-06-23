import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { FilePenLine } from "lucide-react"

interface ReplyModalProps {
  open: boolean;
  onClose: () => void;
  questionContents?: string[]
  onSubmit?: () => void; 
}

export default function ReplyGuide({ open, onClose, questionContents, onSubmit }: ReplyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <FilePenLine className="w-6 h-6 text-gray-800" />
            <DialogTitle className="text-xl font-bold text-gray-900">일괄 응답</DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-sm text-gray-600 mb-4">
            일괄 응답 질문 수: <span className="font-bold text-[#3B6CFF]">{questionContents?.length ?? 0}</span>개
        </p>

        <div className="h-60 overflow-y-auto bg-gray-50 rounded-lg p-4 border space-y-3 text-sm text-gray-700">
            {(questionContents ?? []).map((content, idx) => (
                <p key={idx}>{content}</p>
            ))}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 px-6">AI 응답</Button>
          <Button size="lg" className="bg-[#3B6CFF] hover:bg-[#3B6CFF]/90 px-6" onClick={onSubmit}>작성 완료</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
