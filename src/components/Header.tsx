import { Button } from "./ui/button";
import ProfilePopover from "./ProfilePopover";

export default function Header() {
    return (
        <header className="bg-[#F2F6F9] px-8 py-4 w-full">
            <div className="flex items-center justify-between w-full">
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
    )
}