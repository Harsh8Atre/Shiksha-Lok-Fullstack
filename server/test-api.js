import http from 'http';

const baseUrl = 'http://localhost:5000/api';

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

async function runTests() {
  console.log('--- STARTING SHIKSHALOK API INTEGRATION TESTS ---');

  // 1. Login Admin
  const adminLogin = await req('/auth/login', {
    method: 'POST',
    body: { email: 'admin@shikshalok.com', password: 'admin123' }
  });
  console.log('1. Admin Login:', adminLogin.status === 200 ? 'PASS' : 'FAIL', adminLogin.data.message);
  const adminToken = adminLogin.data.data.token;

  // 2. Login Teacher
  const teacherLogin = await req('/auth/login', {
    method: 'POST',
    body: { email: 'teacher@shikshalok.com', password: 'teacher123' }
  });
  console.log('2. Teacher Login:', teacherLogin.status === 200 ? 'PASS' : 'FAIL', teacherLogin.data.message);
  const teacherToken = teacherLogin.data.data.token;
  const teacherId = teacherLogin.data.data.user._id;

  // 3. Login Student
  const studentLogin = await req('/auth/login', {
    method: 'POST',
    body: { email: 'student1@shikshalok.com', password: 'student123' }
  });
  console.log('3. Student Login:', studentLogin.status === 200 ? 'PASS' : 'FAIL', studentLogin.data.message);
  const studentToken = studentLogin.data.data.token;
  const studentId = studentLogin.data.data.user._id;

  // 4. Test Student Register
  const testEmail = `student_${Date.now()}@shikshalok.com`;
  const registerRes = await req('/auth/register', {
    method: 'POST',
    body: { name: 'Automated Student', email: testEmail, password: 'password123', college: 'Testing Institute' }
  });
  console.log('4. Student Registration:', registerRes.status === 201 ? 'PASS' : 'FAIL', registerRes.data.message);

  // 5. Test Auth /me endpoint
  const meRes = await req('/auth/me', {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  console.log('5. Auth /me Verification:', meRes.status === 200 && meRes.data.data.user.email === 'student1@shikshalok.com' ? 'PASS' : 'FAIL');

  // 6. Test Role-Based Authorization: Student trying to create a course (should be 403 Forbidden)
  const forbiddenRes = await req('/courses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${studentToken}` },
    body: { title: 'Hacked Course', subject: 'CS', description: 'Should fail' }
  });
  console.log('6. Role Authorization (Student blocked from creating course):', forbiddenRes.status === 403 ? 'PASS (403 Forbidden)' : 'FAIL');

  // 7. Teacher creates a course
  const courseRes = await req('/courses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${teacherToken}` },
    body: { title: 'Automated Test Course', subject: 'Computer Science', description: 'Comprehensive test course.' }
  });
  console.log('7. Teacher Course Creation:', courseRes.status === 201 ? 'PASS' : 'FAIL');
  const courseId = courseRes.data.data._id;

  // 8. Student enrolls in course
  const enrollRes = await req(`/courses/${courseId}/enroll`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  console.log('8. Student Course Enrollment:', enrollRes.status === 200 ? 'PASS' : 'FAIL');

  // 9. Teacher creates a class
  const classRes = await req('/classes', {
    method: 'POST',
    headers: { Authorization: `Bearer ${teacherToken}` },
    body: {
      course: courseId,
      title: 'Automated Live Lecture',
      description: 'Testing live classroom functionality',
      scheduledAt: new Date(Date.now() + 60000).toISOString(),
      duration: 45
    }
  });
  console.log('9. Teacher Class Creation:', classRes.status === 201 ? 'PASS' : 'FAIL');
  const classId = classRes.data.data._id;
  const roomId = classRes.data.data.roomId;

  // 10. Teacher starts session
  const sessionRes = await req('/sessions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${teacherToken}` },
    body: { classId }
  });
  console.log('10. Teacher Live Session Creation:', sessionRes.status === 201 ? 'PASS' : 'FAIL');
  const sessionId = sessionRes.data.data._id;

  // 11. Fetch session by roomId
  const roomRes = await req(`/sessions/room/${roomId}`, {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  console.log('11. Fetch Session By RoomId:', roomRes.status === 200 ? 'PASS' : 'FAIL');

  // 12. Teacher sends Alert
  const alertRes = await req('/alerts', {
    method: 'POST',
    headers: { Authorization: `Bearer ${teacherToken}` },
    body: {
      title: 'Exam Alert',
      message: 'This is an integration test alert',
      type: 'urgent',
      courseId
    }
  });
  console.log('12. Alert Creation:', alertRes.status === 201 ? 'PASS' : 'FAIL');
  const alertId = alertRes.data.data._id;

  // 13. Student reads alerts
  const studentAlerts = await req('/alerts', {
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  console.log('13. Student Fetch Alerts:', studentAlerts.status === 200 ? 'PASS' : 'FAIL');

  // 14. Student marks alert as read
  const readRes = await req(`/alerts/${alertId}/read`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${studentToken}` }
  });
  console.log('14. Mark Alert as Read:', readRes.status === 200 ? 'PASS' : 'FAIL');

  // 15. Admin lists users
  const usersRes = await req('/users', {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('15. Admin User Management List:', usersRes.status === 200 && Array.isArray(usersRes.data.data) ? 'PASS' : 'FAIL');

  console.log('--- ALL INTEGRATION TESTS COMPLETE ---');
}

runTests().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
