import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import StudentIdAuth from "@/components/StudentIdAuth";

const API_BASE_URL = 'http://localhost:8080';

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
      
        // 일단 sub만 저장
        localStorage.setItem('userSub', sub);

        // 학번은 아직 입력되지 않았으므로,
        // 메인 페이지로 이동해서 학번 입력 모달을 띄우도록 유도
        navigate('/?need_verification=true');
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