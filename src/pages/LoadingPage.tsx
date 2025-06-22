const LoadingPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#F8FAFC]">
      <h2 className="text-[#191A1C] text-sm mb-6">실시간 질문 페이지로 이동 중..</h2>
      <div className="dot-spinner">
        <div></div><div></div><div></div><div></div>
        <div></div><div></div><div></div><div></div>
      </div>
    </div>
  );
};

export default LoadingPage;
