import { useState, useRef } from "react";

interface StudentIdAuthProps {
  onAuthResult: (result: "success" | "error") => void;
}

const StudentIdAuth = ({ onAuthResult }: StudentIdAuthProps) => {
  const [studentId, setStudentId] = useState("");
  const [status, setStatus] = useState<"default" | "requested" | "codeInput" | "success">("default");
  const [authCode, setAuthCode] = useState("");
  const [requestLabel, setRequestLabel] = useState("인증 요청");
  const [studentIdReadOnly, setStudentIdReadOnly] = useState(true);
  const [studentIdFocus, setStudentIdFocus] = useState(false);
  const [authCodeFocus, setAuthCodeFocus] = useState(false);
  const authCodeInputRef = useRef<HTMLInputElement>(null);

  const handleRequestAuth = () => {
    if (studentId.length < 1) return;
    setRequestLabel("다시 요청");
    setStatus("codeInput");
    setTimeout(() => {
      authCodeInputRef.current?.focus();
    }, 0);
  };

  const handleComplete = () => {
    if (authCode === "1234") {
      setStatus("success");
      onAuthResult("success");
    } else {
      setStatus("default");
      setAuthCode("");
      onAuthResult("error");
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
              disabled={studentId.length < 1 || status !== "default"}
              className="px-4 py-2 h-[40px] mr-5 bg-[#464B51] text-white font-md rounded-md"
            >
              {requestLabel}
            </button>
          </div>
        </div>
        <div className="mb-8">
          <input
            ref={authCodeInputRef}
            type="text"
            placeholder="인증번호 입력"
            value={authCode}
            onChange={e => {
              if (status === "codeInput") setAuthCode(e.target.value);
            }}
            readOnly={status !== "codeInput"}
            onFocus={() => setAuthCodeFocus(true)}
            onBlur={() => setAuthCodeFocus(false)}
            className={`w-full h-[70px] border-2 ${authCodeBorder} rounded-xl px-4 py-3 outline-none bg-white cursor-pointer`}
          />
        </div>
        <button
          type="button"
          onClick={handleComplete}
          disabled={authCode.length < 1 || status !== "codeInput"}
          className="w-[400px] h-[40px] py-3 rounded-xl text-white bg-[#C8CFD6] disabled:bg-[#C8CFD6] enabled:bg-[#3B6CFF] transition-colors flex items-center justify-center text-center"
        >
          사용자 인증 완료
        </button>
      </div>
    </div>
  );
};

export default StudentIdAuth;
