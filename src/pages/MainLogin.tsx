import { useState, useEffect } from "react";
import StudentIdAuth from "../components/StudentIdAuth";
import { Dialog, DialogContent } from "../components/ui/dialog";
import { CircleCheck, XCircle } from "lucide-react";

const VAPID_PUBLIC_KEY = "BPLBsiS3Q-aqnk1QB9Y5H6ZcOySv0evIVqDXwDLW18Or0sEPFQUYGZfeBTmWAzTUI9xruBM5rvxizshLpp8mxVY";

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

async function subscribeUserToPush() {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
        });
        await fetch('http://localhost:3000/api/save-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(subscription)
        });
        console.log('푸시 구독 완료!');
    }
}

export function MainLogin() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"default" | "loading" | "success" | "error">("default");
    const [showAuthModal, setShowAuthModal] = useState(false);
    const isFirstUser = true; // 이메일 인증 후 받아올 값 대체

    useEffect(() => {
        if (email.length > 0 && status !== "success") {
            setStatus("loading");
        } else if (email.length === 0) {
            setStatus("default");
        }
    }, [email, status]);

    // 서비스워커 등록 및 푸시 구독
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker 등록 성공:', registration);
                    // 서비스워커 등록 성공 후 푸시 구독
                    subscribeUserToPush();
                    // 알림 권한 요청
                    if ('Notification' in window && Notification.permission !== 'granted') {
                        Notification.requestPermission();
                    }
                })
                .catch(error => {
                    console.log('Service Worker 등록 실패:', error);
                });
        }
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = () => {
        if (!email || status === "success") return;
        setStatus("loading");
        setTimeout(() => {
            setStatus("success");
            if (isFirstUser) setShowAuthModal(true);
        }, 1500);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    // StudentIdAuth에서 인증 결과를 받아 처리
    const handleAuthResult = (result: "success" | "error") => {
        setShowAuthModal(false);
        setStatus(result);
    };

    return (
        <div
            className="absolute top-0 left-0 w-full min-h-screen flex flex-col font-pretendard"
            style={{ backgroundImage: "url('./mainBackground.png')" }}
        >
            <header className="bg-transparent px-8 py-4 w-full">
                <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                    </div>
                </div>
            </header>
            <div className="flex justify-center items-center min-h-screen">
                <main className="p-8">
                    <h1 className="font-pretendard text-[#191A1C] text-2xl font-bold text-center mb-2">
                        티키? 타카!
                    </h1>
                    <h1 className="font-pretendard text-[#3B6CFF] text-2xl font-bold text-center mb-8 max-w-5xl mx-auto">
                        실시간 Q&A, 티키타카
                    </h1>
                    <h5 className="font-pretendard text-[#191A1C] text-24px font-semibold text-center mb-12">
                        티키타카는 교수와 학생이 수업 중 자유롭게 질문하고, <p>
                            실시간으로 소통하며 함께 만들어가는 참여형 학습 서비스 입니다.</p>
                    </h5>
                    <div className="relative w-[700px] max-w-5xl mt-6 mx-auto">
                        <input
                            type="text"
                            placeholder="단국대학교 이메일 인증"
                            value={email}
                            onChange={handleInputChange}
                            onKeyDown={handleInputKeyDown}
                            className={`w-full h-[70px] pl-10 pr-12 text-[#191A1C] bg-white placeholder-[#C8CFD6] text-base rounded-[18px] border focus:outline-none 
                                ${email ? "border-[#3B6CFF] ring-1 ring-[#3B6CFF]" : "border-[#A5C7FF]"}
                            `}
                        />
                        <button
                            type="button"
                            disabled={!email || status === "success"}
                            onClick={handleSubmit}
                            className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200"
                        >
                            {status === "success" ? (
                                <img src="/checkSuccessIcon.png" alt="success" className="w-full h-full" />
                            ) : status === "loading" ? (
                                <img src="/checkLoadingIcon.png" alt="loading" className="w-full h-full" />
                            ) : (
                                <img src="/checkDefaultIcon.png" alt="default" className="w-full h-full" />
                            )}
                        </button>
                    </div>
                    <div className="min-h-[24px] mt-2 text-center" >
                        {status === "success" && (
                            <p className="flex items-center justify-center gap-1 text-[#3B6CFF] text-sm">
                                <CircleCheck className="w-4 h-4" color="#3B6CFF" />
                                인증이 완료되었어요. 이제 티키타카를 시작해보세요!
                            </p>
                        )}
                        {status === "error" && (
                            <p className="flex items-center justify-center gap-1 text-[#FF4D4F] text-sm">
                                <XCircle className="w-4 h-4" color="#FF4D4F" />
                                인증에 실패했어요. 이메일 주소를 확인하고 다시 시도해주세요.
                            </p>
                        )}
                    </div>
                </main>
            </div>
            <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
                <DialogContent className="p-0 bg-transparent border-none shadow-none max-w-md">
                    <StudentIdAuth onAuthResult={handleAuthResult} />
                </DialogContent>
            </Dialog>
        </div>
    )
}
export default MainLogin;
