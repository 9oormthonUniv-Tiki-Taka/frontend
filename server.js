import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ 1단계: 프론트에서 구글 로그인 시작
app.get("/login", (req, res) => {
  const { redirect_uri } = req.query;

  if (!redirect_uri) {
    return res.status(400).send("Missing redirect_uri");
  }

  // state로 프론트의 redirect_uri를 그대로 넘긴다
  const state = encodeURIComponent(redirect_uri);

  const googleAuthUrl =
    `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=https://api.tikitaka.o-r.kr/login/oauth2/code/google` +
    `&response_type=code` +
    `&scope=openid%20email%20profile` +
    `&state=${state}`;

  res.redirect(googleAuthUrl);
});

// ✅ 2단계: Google OAuth 로그인 완료 후 콜백 처리
app.get("/login/oauth2/code/google", async (req, res) => {
  const { code, state } = req.query;

  if (!code || !state) {
    return res.status(400).send("Missing code or state");
  }

  try {
    // 🔐 access_token 요청
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code: String(code),
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "https://api.tikitaka.o-r.kr/login/oauth2/code/google",
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();
    const access_token = tokenData.access_token;

    if (!access_token) {
      console.error("❌ access_token 없음:", tokenData);
      return res.redirect("https://tikitaka.o-r.kr/login-failed");
    }

    // 👤 사용자 정보 요청
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const user = await userRes.json();
    console.log("✅ user:", user);

    // 🔁 프론트로 리디렉션
    const frontendRedirect = `${decodeURIComponent(state)}?sub=${user.id}`;
    console.log("🚀 redirecting to:", frontendRedirect);
    res.redirect(frontendRedirect);
  } catch (err) {
    console.error("❌ Google OAuth 처리 실패:", err);
    res.redirect("https://tikitaka.o-r.kr/login-failed");
  }
});

app.listen(3000, () => {
  console.log("✅ 서버 실행 중: http://localhost:3000");
});
