import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogOut, User } from "lucide-react";

export default function ProfilePopover() {
  return (
    <Popover>
      <PopoverTrigger>
  <Avatar className="cursor-pointer">
    <AvatarFallback className="bg-[#d1d5db] text-xs text-white">
      DK
    </AvatarFallback>
  </Avatar>
</PopoverTrigger>
      <PopoverContent className="w-64 p-4 space-y-3">
        <div>
          <p className="text-sm font-bold">김단국 (32251234)</p>
          <p className="text-xs text-muted-foreground">kimdankook@dankook.ac.kr</p>
        </div>
        <div className="bg-[#F2F6F9] p-2 rounded-md text-sm">
          나의 포인트 <span className="float-right font-semibold">2000P</span>
        </div>
        <div className="flex justify-between gap-4 text-sm pt-2">
  <button className="flex items-center gap-2 hover:bg-[#E9EEF2] active:bg-[#D1D5DB] px-2 py-1 rounded-md transition-colors">
    <User className="w-4 h-4" /> 마이페이지
  </button>
  <button className="flex items-center gap-2 hover:bg-[#E9EEF2] active:bg-[#D1D5DB] px-2 py-1 rounded-md transition-colors">
    <LogOut className="w-4 h-4" /> 로그아웃
  </button>
</div>
      </PopoverContent>
    </Popover>
    
  );
}