import { io } from 'socket.io-client';

async function testSockets() {
  console.log('--- STARTING SOCKET.IO & WEBRTC SIGNALING TESTS ---');

  // 1. Authenticate Teacher and Student to get tokens
  const teacherRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'teacher@shikshalok.com', password: 'teacher123' })
  });
  const teacherData = await teacherRes.json();
  const teacherToken = teacherData.data.token;
  const teacherUser = teacherData.data.user;

  const studentRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student1@shikshalok.com', password: 'student123' })
  });
  const studentData = await studentRes.json();
  const studentToken = studentData.data.token;
  const studentUser = studentData.data.user;

  const testRoomId = `test_room_${Date.now()}`;

  // 2. Connect Teacher Socket
  const teacherSocket = io('http://localhost:5000', {
    auth: { token: teacherToken },
    transports: ['websocket']
  });

  await new Promise((resolve) => teacherSocket.on('connect', resolve));
  console.log('1. Teacher Socket Connected:', teacherSocket.connected ? 'PASS' : 'FAIL');

  // 3. Connect Student Socket
  const studentSocket = io('http://localhost:5000', {
    auth: { token: studentToken },
    transports: ['websocket']
  });

  await new Promise((resolve) => studentSocket.on('connect', resolve));
  console.log('2. Student Socket Connected:', studentSocket.connected ? 'PASS' : 'FAIL');

  // 4. Teacher joins session room
  teacherSocket.emit('join-session', { roomId: testRoomId });

  // 5. Student joins and teacher receives user-joined
  const userJoinedPromise = new Promise((resolve) => {
    teacherSocket.on('user-joined', (data) => {
      resolve(data);
    });
  });

  studentSocket.emit('join-session', { roomId: testRoomId });
  const joinedData = await userJoinedPromise;
  console.log('3. Session Room user-joined event:', joinedData.name === studentUser.name ? 'PASS' : 'FAIL');

  // 6. Test Chat messaging
  const chatPromise = new Promise((resolve) => {
    teacherSocket.on('receive-message', (data) => {
      resolve(data);
    });
  });

  studentSocket.emit('send-message', {
    roomId: testRoomId,
    message: 'Hello Professor, can you hear me?'
  });

  const chatMsg = await chatPromise;
  console.log('4. Live Chat receive-message:', chatMsg.message === 'Hello Professor, can you hear me?' ? 'PASS' : 'FAIL');

  // 7. Test WebRTC Offer relay
  const offerPromise = new Promise((resolve) => {
    studentSocket.on('webrtc-offer', (data) => {
      resolve(data);
    });
  });

  teacherSocket.emit('webrtc-offer', {
    targetSocketId: studentSocket.id,
    sdp: { type: 'offer', sdp: 'fake_v=0_offer' }
  });

  const offerReceived = await offerPromise;
  console.log('5. WebRTC Offer Signaling Relay:', offerReceived.sdp.type === 'offer' ? 'PASS' : 'FAIL');

  // 8. Test WebRTC Answer relay
  const answerPromise = new Promise((resolve) => {
    teacherSocket.on('webrtc-answer', (data) => {
      resolve(data);
    });
  });

  studentSocket.emit('webrtc-answer', {
    targetSocketId: teacherSocket.id,
    sdp: { type: 'answer', sdp: 'fake_v=0_answer' }
  });

  const answerReceived = await answerPromise;
  console.log('6. WebRTC Answer Signaling Relay:', answerReceived.sdp.type === 'answer' ? 'PASS' : 'FAIL');

  // 9. Test Media State Toggle relay
  const mediaTogglePromise = new Promise((resolve) => {
    studentSocket.on('media-state-change', (data) => {
      resolve(data);
    });
  });

  teacherSocket.emit('media-state-change', {
    roomId: testRoomId,
    audio: false,
    video: true
  });

  const mediaState = await mediaTogglePromise;
  console.log('7. Media State Change Relay:', mediaState.audio === false && mediaState.video === true ? 'PASS' : 'FAIL');

  teacherSocket.disconnect();
  studentSocket.disconnect();

  console.log('--- ALL SOCKET & WEBRTC TESTS COMPLETE ---');
  process.exit(0);
}

testSockets().catch(err => {
  console.error('Socket Test Failed:', err);
  process.exit(1);
});
