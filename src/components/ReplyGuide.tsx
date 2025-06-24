import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react";

interface ReplyModalProps {
  open: boolean;
  onClose: () => void;
  questionContents?: string[]
  onSubmit?: (replyText: string) => void; 
}

export default function ReplyGuide({ open, onClose, questionContents, onSubmit }: ReplyModalProps) {
  const [replyText, setReplyText] = useState("");

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(replyText);
    }
    setReplyText("");
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <img src="/replyIcon.png" alt="Reply" className="w-6 h-6" />
            <DialogTitle className="text-xl font-bold text-gray-900">일괄 응답</DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-sm text-[#828C95]">
            일괄 응답 질문 수: <span className="font-bold text-[#464B51]">{questionContents?.length ?? 0}</span>개
        </p>

        <div className="w-full h-px my-2 bg-[#C8CFD6]" />

        <textarea
            className="w-full h-32 p-4 border rounded-lg bg-[#F5F9FC] border-[#F5F9FC] focus:outline-none focus:ring-0 focus:border-transparent"
            placeholder="응답을 입력하세요."
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
        />

        <div className="flex flex-row gap-4 mt-6 w-full">
          <Button variant="outline" size="lg" className="border-gray-300 text-gray-700 px-6 w-1/2">AI 응답</Button>
          <Button size="lg" className="bg-[#3B6CFF] hover:bg-[#3B6CFF]/90 px-6 w-1/2" onClick={handleSubmit}>작성 완료</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
