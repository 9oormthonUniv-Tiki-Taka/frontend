import { Button } from "./ui/button";

export default function Header() {
  return (
    <header className="bg-[#F2F6F9] w-full px-4 sm:px-6 md:px-8 py-3 sm:py-4">
      <div className="flex items-center justify-between w-full">
        {/* 로고 */}
        <div className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-6 sm:h-8 w-auto"
          />
        </div>

        {/* 아이콘 버튼들 */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon">
            <img
              src="/bellIcon.png"
              alt="bell"
              className="h-5 sm:h-6 w-5 sm:w-6"
            />
          </Button>
          <Button variant="ghost" size="icon">
            <img
              src="/settingIcon.png"
              alt="setting"
              className="h-5 sm:h-6 w-5 sm:w-6"
            />
          </Button>
          <Button
            variant="ghost"
            className="p-2 sm:p-3 h-auto"
          >
            <img
              src="/logoutIcon.png"
              alt="logout"
              className="h-6 sm:h-8 w-auto"
            />
          </Button>
        </div>
      </div>
    </header>
  );
}
