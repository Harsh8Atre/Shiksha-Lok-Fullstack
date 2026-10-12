import { io } from '../client/node_modules/socket.io-client/build/esm/index.js';

const baseUrl = 'http://localhost:5000/api';
const socketUrl = 'http://localhost:5000';

async function req(endpoint, options = {}) {
  const url = `${baseUrl}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function runEndSessionTests() {
  console.log('--- STARTING SHIKSHALOK END SESSION INTEGRATION TESTS ---');
  let passCount = 0;
  let totalTests = 0;

  function assert(title, condition, detail = '') {
    totalTests++;
    if (condition) {
      passCount++;
      console.log(`[PASS] ${totalTests}. ${title}`);
    } else {
      console.error(`[FAIL] ${totalTests}. ${title} -> ${detail}`);
    }
  }

  // 1. Authenticate Teacher 1
  const t1Login = await req('/auth/login', {
    method: 'POST',
    body: { email: 'teacher@shikshalok.com', password: 'teacher123' }
  });
  const t1Token = t1Login.data.data.token;
  const t1User = t1Login.data.data.user;

  // 2. Authenticate Teacher 2 (unauthorized teacher)
  const t2Login = await req('/auth/login', {
    method: 'POST',
    body: { email: 'teacher2@shikshalok.com', password: 'teacher123' }
  });
  const t2Token = t2Login.data.data.token;

  // 3. Authenticate Students
  const s1Login = await req('/auth/login', {
    method: 'POST',
    body: { email: 'student1@shikshalok.com', password: 'student123' }
  });
  const s1Token = s1Login.data.data.token;
  const s1User = s1Login.data.data.user;

  const s2Login = await req('/auth/login', {
    method: 'POST',
    body: { email: 'student2@shikshalok.com', password: 'student123' }
  });
  const s2Token = s2Login.data.data.token;
  const s2User = s2Login.data.data.user;

  // 4. Create a Course & Class for Teacher 1
  const courseRes = await req('/courses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${t1Token}` },
    body: {
      title: `EndSession Test Course ${Date.now()}`,
      subject: 'Computer Science',
      description: 'Testing live class termination'
    }
  });
  const courseId = courseRes.data.data._id;

  const classRes = await req('/classes', {
    method: 'POST',
    headers: { Authorization: `Bearer ${t1Token}` },
    body: {
      course: courseId,
      title: 'Active Live Lecture',
      scheduledAt: new Date(),
      duration: 60
    }
  });
  const classId = classRes.data.data._id;
  const classRoomId = classRes.data.data.roomId;

  // 5. Create Live Session for this class
  const sessionRes = await req('/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${t1Token}` },
    body: { classId }
  });
  const sessionId = sessionRes.data.data._id;

  assert('Live Session Created & Active', sessionRes.status === 201 && sessionRes.data.data.status === 'active');

  // Also create a SEPARATE second session to verify isolation (Scenario 9)
  const otherClassRes = await req('/classes', {
    method: 'POST',
    headers: { Authorization: `Bearer ${t1Token}` },
    body: {
      course: courseId,
      title: 'Other Unaffected Class',
      scheduledAt: new Date(),
      duration: 60
    }
  });
  const otherClassId = otherClassRes.data.data._id;
  const otherSessionRes = await req('/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${t1Token}` },
    body: { classId: otherClassId }
  });
  const otherSessionId = otherSessionRes.data.data._id;
  const otherRoomId = otherClassRes.data.data.roomId;

  // Connect Sockets: Teacher 1, Student 1, Student 2, and a student in the other room
  const teacherSocket = io(socketUrl, { auth: { token: t1Token }, transports: ['websocket'] });
  const student1Socket = io(socketUrl, { auth: { token: s1Token }, transports: ['websocket'] });
  const student2Socket = io(socketUrl, { auth: { token: s2Token }, transports: ['websocket'] });
  const otherRoomSocket = io(socketUrl, { auth: { token: s1Token }, transports: ['websocket'] });

  await new Promise(r => setTimeout(r, 600));

  // Join rooms
  teacherSocket.emit('join-session', { roomId: classRoomId, sessionId });
  student1Socket.emit('join-session', { roomId: classRoomId, sessionId });
  student2Socket.emit('join-session', { roomId: classRoomId, sessionId });
  otherRoomSocket.emit('join-session', { roomId: otherRoomId, sessionId: otherSessionId });

  await new Promise(r => setTimeout(r, 600));

  // Test Student calling endSession directly -> should be 403 Forbidden
  const studentEndAttempt = await req(`/sessions/${sessionId}/end`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${s1Token}` }
  });
  assert('Student Blocked from Calling End Session API (403)', studentEndAttempt.status === 403);

  // Test Unauthorized Teacher calling endSession -> should be 403 Forbidden
  const unauthTeacherEndAttempt = await req(`/sessions/${sessionId}/end`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${t2Token}` }
  });
  assert('Unauthorized Teacher Blocked from Ending Session (403)', unauthTeacherEndAttempt.status === 403);

  // Setup broadcast listeners
  let teacherReceivedEnd = false;
  let student1ReceivedEnd = false;
  let student2ReceivedEnd = false;
  let otherRoomReceivedEnd = false;

  teacherSocket.on('session-ended', (data) => {
    if (data.roomId === classRoomId) teacherReceivedEnd = true;
  });
  student1Socket.on('session-ended', (data) => {
    if (data.roomId === classRoomId) student1ReceivedEnd = true;
  });
  student2Socket.on('session-ended', (data) => {
    if (data.roomId === classRoomId) student2ReceivedEnd = true;
  });
  otherRoomSocket.on('session-ended', (data) => {
    if (data.roomId === classRoomId) otherRoomReceivedEnd = true;
  });

  // Now Authorized Teacher ends the session via API
  const endRes = await req(`/sessions/${sessionId}/end`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${t1Token}` }
  });
  assert('Teacher Successfully Ends Session via API (200)', endRes.status === 200 && endRes.data.data.status === 'completed');

  // Wait for socket events propagation
  await new Promise(r => setTimeout(r, 800));

  assert('Teacher Socket Received session-ended Event', teacherReceivedEnd);
  assert('Student 1 Socket Received session-ended Event', student1ReceivedEnd);
  assert('Student 2 Socket Received session-ended Event', student2ReceivedEnd);
  assert('Other Class Room Did NOT Receive Event (Room Isolation)', !otherRoomReceivedEnd);

  // Check Database: LiveSession status = completed, endedAt set
  const sessionCheck = await req(`/sessions/${sessionId}`, {
    headers: { Authorization: `Bearer ${t1Token}` }
  });
  assert(
    'Database LiveSession Status is completed and endedAt is Set',
    sessionCheck.status === 200 &&
    sessionCheck.data.data.status === 'completed' &&
    !!sessionCheck.data.data.endedAt
  );

  // Check Database: Class status = completed
  const classCheck = await req(`/classes/${classId}`, {
    headers: { Authorization: `Bearer ${t1Token}` }
  });
  assert(
    'Parent Class Status is completed',
    classCheck.status === 200 && classCheck.data.data.status === 'completed'
  );

  // Check Database: Student Attendance records finalized with leftAt
  const attendanceCheck = await req(`/attendance/session/${sessionId}`, {
    headers: { Authorization: `Bearer ${t1Token}` }
  });
  const records = attendanceCheck.data.data;
  assert(
    'Attendance Records Finalized with leftAt and duration',
    Array.isArray(records) && records.length > 0 && records.every(r => !!r.leftAt)
  );

  // Safe/idempotent test: calling End Session again on already ended session
  const repeatEnd = await req(`/sessions/${sessionId}/end`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${t1Token}` }
  });
  assert('Repeated End Session Request is Safe & Returns 200', repeatEnd.status === 200);

  // Prevent rejoining completed session: new student socket trying to join ended session
  let rejoinRejected = false;
  const lateStudentSocket = io(socketUrl, { auth: { token: s1Token }, transports: ['websocket'] });
  lateStudentSocket.on('session-ended', (data) => {
    if (data.message && data.message.includes('already ended')) {
      rejoinRejected = true;
    }
  });
  lateStudentSocket.emit('join-session', { roomId: classRoomId, sessionId });

  await new Promise(r => setTimeout(r, 800));
  assert('Joining Ended Session is Rejected with "already ended" notification', rejoinRejected);

  // Cleanup test sockets
  teacherSocket.disconnect();
  student1Socket.disconnect();
  student2Socket.disconnect();
  otherRoomSocket.disconnect();
  lateStudentSocket.disconnect();

  console.log(`--- SUMMARY: ${passCount}/${totalTests} END SESSION TESTS PASSED ---`);
  if (passCount !== totalTests) {
    process.exit(1);
  }
}

runEndSessionTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
