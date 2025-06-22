import { useState, useEffect } from "react";
import { ArrowRight, CircleCheck, XCircle } from "lucide-react";

export function MainLogin() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"default" | "loading" | "success" | "error">("default");

    useEffect(() => {
        if (email.length > 0 && status !== "success") {
            setStatus("loading");
        } else if (email.length === 0) {
            setStatus("default");
        }
    }, [email]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = () => {
        if (!email || status === "success") return;

        setStatus("loading");

        setTimeout(() => {
        setStatus("success");
        }, 1500);
    };

    // 화살표 버튼 클래스
    const buttonClass = () => {
        if (status === "success") return "bg-[#3B6CFF] text-[#FFFFFF]";
        if (status === "loading") return "bg-[#828C95] text-[#FFFFFF]";
        return "bg-[#C8CFD6] text-[#FFFFFF]";
    };

    return (
        <div
            className="absolute inset-0 z-0 bg-cover bg-center"
            style={{ backgroundImage: "url('./mainBackground.png')" }}
        >
            {/* header */}
            <header className="bg-transparent px-8 py-4 w-full">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                    </div>
                </div>
            </header>

            {/* main content */}
            <div className="flex justify-center items-center min-h-screen">
                <main className="p-8">
                    <h1 className="font-pretendard text-[#191A1C] text-2xl font-bold text-center mb-2">
                        티키? 타카!
                    </h1>
                    <h1 className="font-pretendard text-[#3B6CFF] text-2xl font-bold text-center mb-5">
                        실시간 Q&A, 티키타카
                    </h1>
                    <h5 className="font-pretendard text-[#191A1C] text-24px font-semibold text-center mb-10">
                    티키타카는 교수와 학생이 수업 중 자유롭게 질문하고, <p>
                        실시간으로 소통하며 함께 만들어가는 참여형 학습 서비스 입니다.</p>
                    </h5>

                    <div className="relative w-full max-w-md mt-6 mx-auto">
                        <input
                            type="text"
                            placeholder="단국대학교 이메일 인증"
                            value={email}
                            onChange={handleInputChange}
                            className={`w-full h-[70px] pl-5 pr-12 text-[#191A1C] bg-white placeholder-[#C8CFD6] text-base rounded-[18px] border focus:outline-none 
                                ${email ? "border-[#3B6CFF] ring-1 ring-[#3B6CFF]" : "border-[#A5C7FF]"}
                            `}
                        />
                        <button
                            type="button"
                            disabled={!email || status === "success"}
                            onClick={handleSubmit}
                            className={`absolute right-3 top-[50%] translate-y-[-50%] rounded-full w-8 h-8 flex items-center justify-center shadow transition-all duration-200 
                                ${buttonClass()} 
                                ${status === "loading" ? "animate-spin-slow" : ""}
                            `}
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                        <div className="min-h-[24px] mt-2 text-center" >
                            {status === "success" && (
                                <p className="flex items-center justify-center gap-1 text-[#3B6CFF] text-sm">
                                    <CircleCheck className="w-4 h-4" />
                                    인증이 완료되었어요. 이제 티키타카를 시작해보세요!
                                </p>
                            )}
                            {status === "error" && (
                                <p className="flex items-center justify-center gap-1 text-[#FF4D4F] text-sm">
                                    <XCircle className="w-4 h-4" />
                                    인증에 실패했어요. 이메일 주소를 확인하고 다시 시도해주세요.
                                </p>
                            )}
                        </div>
                </main>
            </div>
        </div>
    )
}

export default MainLogin;