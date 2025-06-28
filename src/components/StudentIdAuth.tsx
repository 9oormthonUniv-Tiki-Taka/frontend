import { useState, useRef } from "react";

interface StudentIdAuthProps {
  onAuthResult: (result: "success" | "error" | "existing_user", authInfo?: { sub: string; code: string; studentId: string }) => void;
}

const StudentIdAuth = ({ onAuthResult }: StudentIdAuthProps) => {
  const [studentId, setStudentId] = useState("");
  const [status, setStatus] = useState<"default" | "requested" | "codeInput" | "success">("default");
  const [authCode, setAuthCode] = useState("");
  const [requestLabel, setRequestLabel] = useState("인증 요청");
  const [studentIdReadOnly, setStudentIdReadOnly] = useState(true);
  const [studentIdFocus, setStudentIdFocus] = useState(false);
  const [authCodeFocus, setAuthCodeFocus] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const authCodeInputRef = useRef<HTMLInputElement>(null);

  const handleRequestAuth = async () => {
    if (studentId.length < 1) return;
    setIsLoading(true);
    setRequestLabel("다시 요청");

    try {
      // 학번을 저장하고 구글 로그인 시작
      const sub = localStorage.getItem('userSub')
      console.log(sub);
      if (!sub) {
        console.error("sub가 localStorage에 존재하지 않습니다");
        onAuthResult("error");
        return;
      }
      await fetch(`https://api.tikitaka.o-r.kr/auth/code?sub=${sub}&studentId=${studentId}`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
      });
      setIsLoading(false);
    } catch (error) {
      console.error('코드 수령 실패:', error);
      setIsLoading(false);
      onAuthResult("error");
    }
  };

  const handleComplete = async () => {
    if (authCode.length < 1 || status !== "codeInput") return;
    setIsLoading(true);
    const sub = localStorage.getItem('userSub')

    try {
      // 학생 인증 API 호출
      const response = await fetch(`https://api.tikitaka.o-r.kr/auth/verify?sub=${sub}&code=${authCode}&studentId=${studentId}`, {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setStatus("success");
        onAuthResult("success", {
          sub: "", // 서버에서 처리하므로 빈 값
          code: authCode,
          studentId: studentId
        });
      } else {
        setStatus("default");
        setAuthCode("");
        onAuthResult("error");
      }
    } catch (error) {
      console.error('학생 인증 실패:', error);
      setStatus("default");
      setAuthCode("");
      onAuthResult("error");
    } finally {
      setIsLoading(false);
    }
  };

  const studentIdBorder = studentIdFocus || studentId.length > 0 ? "border-[#3B6CFF]" : "border-[#A5C7FF]";
  const authCodeBorder = authCodeFocus || authCode.length > 0 ? "border-[#3B6CFF]" : "border-[#A5C7FF]";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <h2 className="text-xl font-bold mb-2">사용자 인증</h2>
        <p className="text-sm text-[#828C95] mb-6">
          처음 방문하셨군요! 티키타카는 교수님과 학생의 역할에 따라 기능이 다르게 제공되며, 이를 위해 최초 1회 사용자 인증이 필요합니다.
        </p>
        <hr className="mb-6" />
        <div className="mb-4">
          <label className="block text-[#191A1C] font-semibold mb-2">학번 인증</label>
          <div className={`flex items-center h-[70px] border-2 ${studentIdBorder} rounded-xl overflow-hidden bg-white`}>
            <input
              type="text"
              placeholder="학번 입력"
              value={studentId}
              onChange={e => setStudentId(e.target.value)}
              readOnly={studentIdReadOnly || status !== "default"}
              onClick={() => {
                if (studentIdReadOnly && status === "default") setStudentIdReadOnly(false);
              }}
              onFocus={() => setStudentIdFocus(true)}
              onBlur={() => setStudentIdFocus(false)}
              className="flex-1 px-4 py-3 outline-none bg-white cursor-pointer"
            />
            <button
              type="button"
              onClick={handleRequestAuth}
              disabled={studentId.length < 1 || status !== "default" || isLoading}
              className="px-4 py-2 h-[40px] mr-5 bg-[#464B51] text-white font-md rounded-md disabled:opacity-50"
            >
              {isLoading ? "요청 중..." : requestLabel}
            </button>
          </div>
        </div>
        <div className="mb-8">
          <input
            ref={authCodeInputRef}
            type="text"
            placeholder="인증번호 입력"
            value={authCode}
            onChange={e => setAuthCode(e.target.value)}
            onFocus={() => setAuthCodeFocus(true)}
            onBlur={() => setAuthCodeFocus(false)}
            className={`w-full h-[70px] border-2 ${authCodeBorder} rounded-xl px-4 py-3 outline-none bg-white cursor-pointer`}
          />
        </div>
        <button
          type="button"
          onClick={handleComplete}
          disabled={authCode.length < 1 || isLoading}
          className="w-[400px] h-[40px] py-3 rounded-xl text-white bg-[#C8CFD6] disabled:bg-[#C8CFD6] enabled:bg-[#3B6CFF] transition-colors flex items-center justify-center text-center"
        >
          {isLoading ? "인증 중..." : "사용자 인증 완료"}
        </button>
      </div>
    </div>
  );
};

export default StudentIdAuth;
