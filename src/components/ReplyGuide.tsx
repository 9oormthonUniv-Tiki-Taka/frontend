import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState } from "react";

interface ReplyModalProps {
  open: boolean;
  onClose: () => void;
  questionContents?: string[];
  questionIDs?: string[];
  lectureId?: string;
  onSubmit?: (replyText: string) => void; 
}

interface QuestionResponse {
  id: string;
  status: string;
  content: string;
  createdAt: string;
}

interface ApiResponse {
  questions: QuestionResponse[];
}

export default function ReplyGuide({ open, onClose, questionContents, questionIDs, lectureId, onSubmit }: ReplyModalProps) {
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!replyText.trim()) {
      alert("응답 내용을 입력해주세요.");
      return;
    }

    if (!lectureId) {
      alert("강의 ID가 없습니다.");
      return;
    }

    if (!questionIDs || questionIDs.length === 0) {
      alert("응답할 질문이 선택되지 않았습니다.");
      return;
    }

    setIsLoading(true);

    try {
      // 일괄응답 API 호출
      const response = await fetch(`https://api.tikitaka.o-r.kr/api/lecture/${lectureId}/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          questionIDs: questionIDs,
          content: replyText
        })
      });

      if (response.ok) {
        const result: ApiResponse = await response.json();
        console.log("일괄응답 완료:", result);
        alert("일괄응답이 완료되었습니다.");
        
        if (onSubmit) {
          onSubmit(replyText);
        }
        setReplyText("");
        onClose();
      } else {
        console.error("일괄응답 실패:", response.status);
        const errorText = await response.text();
        console.error("에러 응답:", errorText);
        alert("일괄응답에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error) {
      console.error("일괄응답 중 오류:", error);
      alert("일괄응답 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
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
            disabled={isLoading}
        />

        <div className="flex flex-row gap-4 mt-6 w-full">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-gray-300 text-gray-700 px-6 w-1/2"
            disabled={isLoading}
          >
            AI 응답
          </Button>
          <Button 
            size="lg" 
            className="bg-[#3B6CFF] hover:bg-[#3B6CFF]/90 px-6 w-1/2 disabled:opacity-50" 
            onClick={handleSubmit}
            disabled={isLoading || !replyText.trim()}
          >
            {isLoading ? "응답 중..." : "작성 완료"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
