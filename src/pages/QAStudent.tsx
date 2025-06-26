import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";
import Header from "@/components/Header"
import { ChevronDown } from 'lucide-react';
import { Send } from 'lucide-react';

interface Question {
  id: number;
  content: string;
  date: string;
}

const QuestionItem = ({ question, isOpen, onToggle }: { question: Question, isOpen: boolean, onToggle: () => void }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1);
  const [comments, setComments] = useState([
    { author: '티키 01', time: '2024.00.00 오전 00:00', text: '댓글 내용' },
    { author: '티키 01', time: '2024.00.00 오전 00:00', text: '댓글 내용' },
  ]);
  const [newComment, setNewComment] = useState("");

  const handleLikeClick = () => {
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    setIsLiked(!isLiked);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    setComments([
      ...comments,
      { author: '나 (학생)', time: '2024.07.16 오후 03:30', text: newComment }
    ]);
    setNewComment("");
  };

  const userHasCommented = comments.some(comment => comment.author === '나 (학생)');

  return (
    <div className="bg-white rounded-lg">
      <div
        className="flex justify-between items-center p-6 gap-4 cursor-pointer border-b border-b-[#DEE4E9]"
        onClick={onToggle}
      >
        <div className="flex-grow">
          <p className="text-gray-500 text-sm">{question.id === 1 ? '질문 내용' : `질문내용 질문내용 질문내용 질문내용 질문내용 질문내용...`}</p>
          {isOpen && question.id === 1 && <p className="text-gray-800 mt-2">질문내용</p>}
        </div>
        <div className="flex items-center space-x-4">
          <p className="text-gray-500 text-sm">{question.date}</p>
          <ChevronDown
            className={`transform transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="bg-white px-8 py-8 mt-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <div>
              <div className="font-semibold text-[#646B72]">티키 01</div>
              <div className="text-xs text-[#C8CFD6]">2025.00.00 오전 00:00</div>
            </div>
            <button className="text-[#646B72] text-sm font-semibold">질문 신고</button>
          </div>
          <div className="text-[#191A1C] font-semibold mb-2">질문 내용</div>
          <div className="text-[#646B72] mb-4">{question.content}</div>
          <div className="bg-[#F5F9FC] rounded-xl p-6 mb-4">
            <div className="font-semibold text-[#646B72]">타카 (교수님)</div>
            <div className="text-xs text-[#C8CFD6]">2025.00.00 오전 00:00</div>
            <div className="mt-2 text-[#191A1C]">교수님 답변 교수님 답변 교수님 답변 교수님 답변 교수님 답변</div>
          </div>
          <div className="flex items-center mt-4 text-gray-500 border-b border-b-[#DEE4E9] pb-6">
            <div className="flex items-center">
              <img
                src={userHasCommented ? '/messageCircleDots.png' : '/normalMessageCircleDots.png'}
                alt="Comments"
                className="w-4 h-4 mr-1"
              />
              {comments.length}
            </div>
            <button onClick={handleLikeClick} className="flex items-center ml-4 focus:outline-none">
              <img 
                src={isLiked ? '/likeIcon.png' : '/normalLikeIcon.png'}
                alt="Like"
                className="w-4 h-4 mr-1"
              />
              {likeCount}
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {comments.map((comment, index) => (
              <div key={index} className="p-4 bg-white border-b border-b-[#DEE4E9] pb-6">
                <p className="font-semibold">{comment.author}</p>
                <p className="text-xs text-gray-500">{comment.time}</p>
                <p className="mt-2">{comment.text}</p>
              </div>
            ))}
          </div>
          <form onSubmit={handleCommentSubmit} className="mt-12 flex relative">
            <div className="relative w-full">
              <textarea
                placeholder="댓글을 입력하세요."
                className="flex-grow bg-[#F5F9FC] h-[100px] border-none pt-4 pr-12 pl-4 placeholder:text-[#B1BAC1] placeholder:text-sm placeholder:align-top resize-none rounded-xl w-full focus:outline-none"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
              />
              <Button variant="ghost" size="icon" type="submit" className="absolute right-4 top-1/4 -translate-y-1/4">
                <Send />
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};


export function QAStudent() {
  const [activeTab, setActiveTab] = useState("latest");
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(1);
  const [fabHover, setFabHover] = useState(false);

  const questions: Question[] = [
    { id: 1, content: "질문내용 질문내용 질문내용 질문내용 질문내용 질문내용...", date: "2025.00.00" },
    { id: 2, content: "질문내용 질문내용 질문내용 질문내용 질문내용 질문내용...", date: "2025.00.00" },
    { id: 3, content: "질문 내용", date: "2025.00.00" },
    { id: 4, content: "질문 내용", date: "2025.00.00" },
    { id: 5, content: "질문 내용", date: "2025.00.00" },
  ];

  const handleToggle = (id: number) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen flex flex-col bg-[#F2F6F9]">
      <Header />
        <div className="container mx-auto px-8 py-6">
          <div className="text-sm mb-8">
            <span className="text-[#B1BAC1]">나의 수강 과목  &gt; </span> <span className="text-[#464B51]">과목 이름 (강의실 이동)</span>
          </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-6">과목 이름</h1>
          <p className="text-gray-600">내가 수강하는 과목의 질문 목록을 확인 할 수 있어요.</p>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
            <div className="relative flex items-center">
                <Input type="search" placeholder="검색어를 입력하세요." className="w-full pl-4 pr-12 h-12 rounded-full border-[#3B6CFF] border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0 bg-white" />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#323639" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
        </div>

        <div className="rounded-lg p-8">
          <main>
            <div className="flex items-center gap-2 mb-6">
              <img src="/SWMIcon.png" alt="SWM Icon" className="w-6 h-6" />
              <h2 className="text-xl font-bold text-[#191A1C]">질문 목록</h2>
            </div>
            <div className="flex justify-start space-x-2 mb-6">
              <Button
                variant={activeTab === "latest" ? "default" : "ghost"}
                onClick={() => setActiveTab("latest")}
                className={`${activeTab === 'latest' ? 'bg-[#3B6CFF] text-white hover:bg-[#E9EEF2]' : 'text-[#323639] hover:bg-[#E9EEF2] border border-gray-300'}`}
              >
                최신순
              </Button>
              <Button
                variant={activeTab === "oldest" ? "default" : "ghost"}
                onClick={() => setActiveTab("oldest")}
                className={`${activeTab === 'oldest' ? 'bg-[#3B6CFF] text-white hover:bg-[#E9EEF2]' : 'text-[#323639] hover:bg-[#E9EEF2] border border-gray-300'}`}
              >
                오래된 순
              </Button>
            </div>

            <div className="space-y-4">
              {questions.map((q) => (
                <QuestionItem
                  key={q.id}
                  question={q}
                  isOpen={openQuestionId === q.id}
                  onToggle={() => handleToggle(q.id)}
                />
              ))}
            </div>

            <div className="text-center mt-8">
              <Button variant="outline" className="border-gray-300 text-gray-700 bg-[#F2F6F9]">
                더보기 <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </main>
        </div>
      </div>

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

export default QAStudent;