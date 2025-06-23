import { Button } from "./ui/button";
import ProfilePopover from "./ProfilePopover";

export default function Header() {
  return (
    <header className="w-full bg-[#F2F6F9]">
      <div className="max-w-6xl w-full mx-auto px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <img src="/bellIcon.png" alt="bell" className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon">
            <img src="/settingIcon.png" alt="setting" className="h-6 w-6" />
          </Button>
          <ProfilePopover />
        </div>
      </div>
    </header>
  );
}
