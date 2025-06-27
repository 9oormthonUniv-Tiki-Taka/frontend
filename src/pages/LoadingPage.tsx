export default function LoadingPage() {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="text-[#191A1C] text-xl mb-6">실시간 질문 페이지로 이동 중..</h2>
        <div className="dot-spinner">
          <div></div><div></div><div></div><div></div>
          <div></div><div></div><div></div><div></div>
        </div>
      </div>
    </div>
  );
}
