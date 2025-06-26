import express from 'express';
import webpush from 'web-push';
import { Server } from 'socket.io';
import http from 'http';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: '/api/lectures/live', // socket.io 엔드포인트
  cors: {
    origin: '*', // 개발용, 실제 배포시에는 도메인 지정
    methods: ['GET', 'POST']
  }
});

// CORS 설정
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(express.json());

// VAPID 키 (실제 값으로 교체)
const vapidKeys = {
  publicKey: 'BPLBsiS3Q-aqnk1QB9Y5H6ZcOySv0evIVqDXwDLW18Or0sEPFQUYGZfeBTmWAzTUI9xruBM5rvxizshLpp8mxVY',
  privateKey: 'SI8gdwiIfIxQQZNKiGC8v77PkMTNNK5QKE4CrlzK7zc'
};
webpush.setVapidDetails(
  'mailto:your@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const subs = [];

// 구독 정보 저장 API
app.post('/api/save-subscription', (req, res) => {
  const subscription = req.body;
  subs.push(subscription);
  console.log('구독 정보 저장됨:', subscription);
  res.status(201).json({ message: '구독 완료!' });
});

app.get('/test-push', (req, res) => {
  if (subs.length === 0) {
    return res.status(400).json({ error: '구독자가 없습니다.' });
  }

  webpush.sendNotification(subs[0], JSON.stringify({
    title: '테스트 알림',
    body: '서버에서 보낸 테스트 메시지입니다.',
    url: '/LiveProfessor'
  }), {
    TTL: 1000 * 60 * 60 * 12
  });

  res.json({ message: '테스트 알림 전송 완료!' });
});

// 소켓 연결 및 채팅 메시지 감지
io.on('connection', (socket) => {
  console.log('소켓 연결됨:', socket.id);

  socket.on('chat message', (data) => {
    const { sender, message, lectureId } = data;
    // 푸시 알림 전송
    subs.forEach(subscription => {
      webpush.sendNotification(subscription, JSON.stringify({
        title: '새 채팅 메시지',
        body: `${sender}: ${message}`,
        url: `/LiveProfessor?lectureId=${lectureId}`
      })).catch(console.error);
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log('VAPID Public Key:', vapidKeys.publicKey);
});