import { useState, useRef, useEffect } from "react";

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
  const [pendingStudentId, setPendingStudentId] = useState<string | null>(null);
  const authCodeInputRef = useRef<HTMLInputElement>(null);

  // OAuth 콜백 처리
  useEffect(() => {
    const handleOAuthCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const state = urlParams.get('state');
      const token = urlParams.get('token');

      console.log('=== OAuth 콜백 처리 시작 ===');
      console.log('현재 URL:', window.location.href);
      console.log('URL 파라미터:', { code, state, token });
      console.log('pendingStudentId:', pendingStudentId);

      // OAuth 콜백에서 설정한 상태 확인
      const authStatus = localStorage.getItem('authStatus');
      const storedStudentId = localStorage.getItem('pendingStudentId');
      
      if (authStatus === 'codeInput' && storedStudentId) {
        console.log('OAuth 콜백에서 설정된 인증번호 입력 모드로 전환');
        setStatus('codeInput');
        setStudentId(storedStudentId);
        setPendingStudentId(storedStudentId);
        localStorage.removeItem('authStatus');
        localStorage.removeItem('pendingStudentId');
        setTimeout(() => {
          authCodeInputRef.current?.focus();
        }, 0);
        return;
      }

      // 토큰이 직접 전달된 경우 (백엔드에서 처리 후)
      if (token && pendingStudentId) {
        console.log('토큰으로 처리 시작');
        try {
          // 토큰으로 사용자 정보 조회하여 sub 가져오기
          const userResponse = await fetch('https://api.tikitaka.o-r.kr/api/users/me', {
            method: 'GET',
            headers: {
              'accept': '*/*',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          console.log('사용자 정보 응답 상태:', userResponse.status);

          if (userResponse.ok) {
            const userData = await userResponse.json();
            console.log('사용자 데이터:', userData);
            const sub = userData.user?.sub || userData.user?.id || userData.sub;

            console.log('추출된 sub:', sub);

            if (sub) {
              // sub와 학번으로 /auth/code 요청
              const authResponse = await fetch('https://api.tikitaka.o-r.kr/auth/code', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                  sub: sub,
                  studentId: pendingStudentId 
                })
              });

              console.log('auth/code 응답 상태:', authResponse.status);

              if (authResponse.ok) {
                console.log('신규 사용자 - 인증번호 입력 모드로 전환');
                // 신규 사용자 - 인증번호 입력 모드로 전환
                setStatus("codeInput");
                setStudentId(pendingStudentId);
                setPendingStudentId(null);
                setTimeout(() => {
                  authCodeInputRef.current?.focus();
                }, 0);
              } else {
                const errorData = await authResponse.json();
                console.log('auth/code 에러 응답:', errorData);
                if (errorData.status === "ERROR" && errorData.message === "인증에 실패했습니다.") {
                  console.log('기존 사용자로 처리');
                  // 기존 사용자
                  onAuthResult("existing_user");
                } else {
                  console.log('기타 에러로 처리');
                  // 기타 에러
                  onAuthResult("error");
                }
              }
            } else {
              console.error('sub를 찾을 수 없습니다');
              onAuthResult("error");
            }
          } else {
            console.error('사용자 정보 조회 실패:', userResponse.status);
            onAuthResult("error");
          }
        } catch (error) {
          console.error('토큰 처리 실패:', error);
          onAuthResult("error");
        }
      } else if (code && state && pendingStudentId) {
        console.log('code와 state로 처리 시작');
        // 백엔드 OAuth 콜백 처리 (code와 state가 있는 경우)
        try {
          // 백엔드에 code와 state를 보내서 토큰을 받아옴
          const tokenResponse = await fetch('https://api.tikitaka.o-r.kr/api/oauth/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, state })
          });

          console.log('토큰 교환 응답 상태:', tokenResponse.status);

          if (tokenResponse.ok) {
            const tokenData = await tokenResponse.json();
            console.log('토큰 응답:', tokenData);
            
            if (tokenData.token) {
              // 토큰으로 사용자 정보 조회하여 sub 가져오기
              const userResponse = await fetch('https://api.tikitaka.o-r.kr/api/users/me', {
                method: 'GET',
                headers: {
                  'accept': '*/*',
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${tokenData.token}`
                }
              });

              if (userResponse.ok) {
                const userData = await userResponse.json();
                const sub = userData.user?.sub || userData.user?.id || userData.sub;

                // sub와 학번으로 /auth/code 요청
                const authResponse = await fetch('https://api.tikitaka.o-r.kr/auth/code', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ 
                    sub: sub,
                    studentId: pendingStudentId 
                  })
                });

                console.log('auth/code 응답 상태:', authResponse.status);

                if (authResponse.ok) {
                  // 신규 사용자 - 인증번호 입력 모드로 전환
                  setStatus("codeInput");
                  setStudentId(pendingStudentId);
                  setPendingStudentId(null);
                  setTimeout(() => {
                    authCodeInputRef.current?.focus();
                  }, 0);
                } else {
                  const errorData = await authResponse.json();
                  if (errorData.status === "ERROR" && errorData.message === "인증에 실패했습니다.") {
                    // 기존 사용자
                    onAuthResult("existing_user");
                  } else {
                    // 기타 에러
                    onAuthResult("error");
                  }
                }
              } else {
                onAuthResult("error");
              }
            } else {
              onAuthResult("error");
            }
          } else {
            console.error('토큰 교환 실패:', tokenResponse.status);
            onAuthResult("error");
          }
        } catch (error) {
          console.error('백엔드 OAuth 콜백 처리 실패:', error);
          onAuthResult("error");
        }
      } else {
        console.log('OAuth 콜백 조건에 맞지 않음');
      }
    };

    handleOAuthCallback();
  }, []);

  const handleRequestAuth = async () => {
    if (studentId.length < 1) return;
    setIsLoading(true);
    setRequestLabel("다시 요청");
    
    try {
      // 학번을 저장하고 구글 로그인 시작
      setPendingStudentId(studentId);
      
      // 직접 구글 OAuth 사용 (백엔드에서 처리하도록)
      const googleAuthUrl = `https://api.tikitaka.o-r.kr/oauth2/authorization/google?redirect_uri=${encodeURIComponent(window.location.origin)}`;
      
      console.log('구글 OAuth URL:', googleAuthUrl);
      window.location.href = googleAuthUrl;
    } catch (error) {
      console.error('구글 로그인 시작 실패:', error);
      setIsLoading(false);
      onAuthResult("error");
    }
  };

  const handleComplete = async () => {
    if (authCode.length < 1 || status !== "codeInput") return;
    setIsLoading(true);
    
    try {
      // 학생 인증 API 호출
      const response = await fetch('https://api.tikitaka.o-r.kr/auth/verify', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: authCode,
          studentId: studentId
        })
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
          disabled={authCode.length < 1 || status !== "codeInput" || isLoading}
          className="w-[400px] h-[40px] py-3 rounded-xl text-white bg-[#C8CFD6] disabled:bg-[#C8CFD6] enabled:bg-[#3B6CFF] transition-colors flex items-center justify-center text-center"
        >
          {isLoading ? "인증 중..." : "사용자 인증 완료"}
        </button>
      </div>
    </div>
  );
};

export default StudentIdAuth;
