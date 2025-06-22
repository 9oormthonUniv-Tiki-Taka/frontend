export default function LoadingPage() {
  return (
    <main className="flex flex-col items-center justify-center h-[calc(100vh-72px)] bg-white pt-4">
      <img src="/logo.png" alt="logo" className="w-24 h-auto mb-4 animate-pulse" />
      <p className="text-[#202325] text-lg font-semibold mb-2">
        실시간 질문 페이지로 이동 중...
      </p>
      <div className="w-8 h-8 border-4 border-[#646B72] border-t-transparent rounded-full animate-spin mt-2" />
    </main>
  );
}