import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import StudentIdAuth from "@/components/StudentIdAuth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.tikitaka.o-r.kr';

export function OAuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const sub = urlParams.get('sub');
      const token = urlParams.get('token');
      const message = urlParams.get('message');

      console.log('OAuth 콜백 파라미터:', { sub, token, message });

      if (message === 'success' && sub && token) {
        // 로그인 성공
        console.log('로그인 성공:', { sub, token });
        
        // 토큰을 로컬스토리지에 저장
        localStorage.setItem('Authorization', token);
        localStorage.setItem('userSub', sub);
        
        // 메인 페이지로 리다이렉트
        navigate('/');
        
      } 
      else if (message === 'need_verification' && sub) {
        // 가입 필요
        console.log('가입 필요:', { sub });
      
        // 입력 받은 학번이랑, sub를 post요청 보냄
        localStorage.setItem('userSub', sub);
        
        try {
          // 로컬스토리지에서 학번 가져오기
          const studentId = localStorage.getItem('studentId');
          
          if (studentId) {
            // /auth/code로 POST 요청 보내기 (파라미터로 전달)
            const response = await fetch(`${API_BASE_URL}/auth/code?sub=${encodeURIComponent(sub)}&studentId=${encodeURIComponent(studentId)}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              }
            });

            if (response.ok) {
              console.log('인증 코드 요청 성공');
              // StudentIdAuth에서 인증번호 입력 화면을 바로 보여주도록 상태 설정
              localStorage.setItem('authStatus', 'codeInput');
              localStorage.setItem('pendingStudentId', studentId);
              // 메인 페이지로 이동 (StudentIdAuth가 표시됨)
              navigate('/?need_verification=true');
            } else {
              console.error('인증 코드 요청 실패:', response.status);
              navigate('/?login_failure=true');
            }
          } else {
            console.error('학번이 저장되지 않았습니다');
            navigate('/?login_failure=true');
          }
        } catch (error) {
          console.error('인증 코드 요청 중 오류:', error);
          navigate('/?login_failure=true');
        }
      } else if (message === 'failure') {
        // 로그인 실패
        console.error('로그인 실패');
        
        // 에러 페이지로 리다이렉트
        navigate('/?login_failure=true');
      } 
      else {
        // 잘못된 파라미터
        console.error('잘못된 OAuth 콜백 파라미터');
        navigate('/?login_failure=true');
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full min-h-screen flex flex-col font-pretendard bg-[#F2F6F9]">
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B6CFF] mx-auto mb-4"></div>
          <p className="text-[#191A1C] text-lg">로그인 처리 중...</p>
        </div>
      </div>
    </div>
  );
}

export default OAuthCallback; 