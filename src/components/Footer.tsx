export default function Footer() {
  return (
    <footer className="bg-[#F2F6F9] mt-16">
      <div className="container mx-auto px-8 py-6 text-sm flex flex-col gap-4">
        <div>
          <img src="/logo.png" alt="Logo" className="h-6 w-auto" />
        </div>

        <div className="flex justify-between items-center flex-wrap gap-y-2">
          <span className="text-[#191A1C]">© 2025 티키타카</span>
          <div className="flex gap-6 text-[#191A1C] flex-wrap">
            <a href="#" className="!text-[#191A1C] hover:!text-[#191A1C]">이용안내</a>
            <a href="#" className="!text-[#191A1C] hover:!text-[#191A1C]">문의하기</a>
            <a href="#" className="!text-[#191A1C] hover:!text-[#191A1C]">개인정보처리방침</a>
            <a href="#" className="!text-[#191A1C] hover:!text-[#191A1C]">관리자</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
