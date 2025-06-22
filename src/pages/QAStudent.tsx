import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Footer from "@/components/Footer";
import Header from "@/components/Header"
import { ChevronDown, MessageSquareText, Send, ThumbsUp, Heart } from 'lucide-react';

interface Question {
  id: number;
  content: string;
  date: string;
}

const QuestionItem = ({ question, isOpen, onToggle }: { question: Question, isOpen: boolean, onToggle: () => void }) => (
  <div className="bg-white rounded-lg shadow-sm">
    <div
      className="flex justify-between items-center p-4 cursor-pointer"
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
      <div className="p-4 bg-gray-50">
        <button className="text-xs text-gray-500 float-right">질문 신고</button>
        <div className="mt-4">
            <p className="font-semibold">티키 01</p>
            <p className="text-xs text-gray-500">2024.00.00 오전 00:00</p>
        </div>
        
        <div className="mt-4 p-4 bg-white rounded-md">
          <p className="font-semibold text-blue-600">티키 (교수님)</p>
          <p className="text-xs text-gray-500">2024.00.00 오전 00:00</p>
          <p className="mt-2">교수님 답변 교수님 답변 교수님 답변 교수님 답변 교수님 답변</p>
          <div className="flex items-center mt-4 text-gray-500">
            <Heart size={16} className="mr-1" /> 1
            <ThumbsUp size={16} className="ml-4 mr-1" /> 2
          </div>
        </div>

        <div className="mt-4 space-y-4">
            <div className="p-4 bg-white rounded-md">
                <p className="font-semibold">티키 01</p>
                <p className="text-xs text-gray-500">2024.00.00 오전 00:00</p>
                <p className="mt-2">댓글 내용</p>
            </div>
             <div className="p-4 bg-white rounded-md">
                <p className="font-semibold">티키 01</p>
                <p className="text-xs text-gray-500">2024.00.00 오전 00:00</p>
                <p className="mt-2">댓글 내용</p>
            </div>
        </div>

        <div className="mt-4 flex">
          <Input type="text" placeholder="댓글을 입력하세요." className="flex-grow"/>
          <Button variant="ghost" size="icon">
            <Send />
          </Button>
        </div>
      </div>
    )}
  </div>
);


export function QAStudent() {
  const [activeTab, setActiveTab] = useState("latest");
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(1);

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
    <div className="min-h-screen bg-[#F2F6F9]">
    <Header />
      <div className="container mx-auto px-8 py-6">
        <div className="text-sm mb-8">
          <span className="text-[#B1BAC1]">나의 수강 과목  &gt; </span> <span className="text-[#464B51]">과목 이름 (강의실 이동)</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">과목 이름</h1>
          <p className="text-gray-600 mt-2">내가 수강하는 과목의 질문 목록을 확인 할 수 있어요.</p>
        </div>

        <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
                <Input type="search" placeholder="검색어를 입력하세요." className="w-full pl-4 pr-12 h-12 rounded-full border-[#3B6CFF] border-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus:ring-0" />
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#323639" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
        </div>

        <div className="rounded-lg p-8">
          <main>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                    <MessageSquareText className="w-6 h-6 text-[#191A1C]" />
                    <h2 className="text-xl font-bold text-[#191A1C]">질문 목록</h2>
                </div>
              <div className="flex space-x-2">
                <Button
                  variant={activeTab === "latest" ? "default" : "ghost"}
                  onClick={() => setActiveTab("latest")}
                  className={activeTab === 'latest' ? 'bg-blue-500 text-white' : 'text-gray-500'}
                >
                  최신순
                </Button>
                <Button
                  variant={activeTab === "oldest" ? "default" : "ghost"}
                  onClick={() => setActiveTab("oldest")}
                  className={activeTab === 'oldest' ? 'bg-blue-500 text-white' : 'text-gray-500'}
                >
                  오래된 순
                </Button>
              </div>
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
              <Button variant="outline">더보기</Button>
            </div>
          </main>
        </div>
      </div>

        <button className="fixed top-1/2 -translate-y-1/2 right-10 bg-blue-500 text-white rounded-full p-4 shadow-lg">
            <MessageSquareText size={24} />
        </button>
      <Footer />
    </div>
  );
}

export default QAStudent;