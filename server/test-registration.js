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

async function runRegistrationTests() {
  console.log('--- STARTING SHIKSHALOK REGISTRATION & AUTH FLOW TESTS ---');
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

  const timestamp = Date.now();

  // Test 1: Student Registration
  const studentEmail = `student_${timestamp}@test.edu`;
  const studentReg = await req('/auth/register', {
    method: 'POST',
    body: {
      name: 'Aditi Verma',
      email: studentEmail,
      password: 'password123',
      college: 'Delhi University',
      phone: '9876543210',
      role: 'student'
    }
  });
  assert(
    'Student Registration Succeeds with Role=student',
    studentReg.status === 201 && studentReg.data.data.user.role === 'student' && !!studentReg.data.data.token,
    JSON.stringify(studentReg.data)
  );

  // Test 2: Teacher Registration with College
  const teacherEmail = `teacher_${timestamp}@test.edu`;
  const teacherReg = await req('/auth/register', {
    method: 'POST',
    body: {
      name: 'Dr. Suresh Menon',
      email: teacherEmail,
      password: 'password123',
      college: 'IIT Madras',
      phone: '9876543211',
      role: 'teacher'
    }
  });
  assert(
    'Teacher Registration Succeeds with Role=teacher and Institutional Info',
    teacherReg.status === 201 && teacherReg.data.data.user.role === 'teacher' && !!teacherReg.data.data.token,
    JSON.stringify(teacherReg.data)
  );

  // Test 3: Teacher Registration Fails Without College
  const teacherNoCollege = await req('/auth/register', {
    method: 'POST',
    body: {
      name: 'Prof. Ramesh Rao',
      email: `teacher_nocollege_${timestamp}@test.edu`,
      password: 'password123',
      college: '',
      role: 'teacher'
    }
  });
  assert(
    'Teacher Registration Fails When College Is Missing',
    teacherNoCollege.status === 400 && teacherNoCollege.data.message.includes('college or institutional affiliation'),
    JSON.stringify(teacherNoCollege.data)
  );

  // Test 4: Admin Registration Attempt via Public Endpoint is Blocked / Coerced
  const adminAttemptEmail = `fakeadmin_${timestamp}@test.edu`;
  const adminAttempt = await req('/auth/register', {
    method: 'POST',
    body: {
      name: 'Attacker Admin',
      email: adminAttemptEmail,
      password: 'password123',
      role: 'admin'
    }
  });
  assert(
    'Admin Role Cannot Be Registered (Forced to Student)',
    adminAttempt.status === 201 && adminAttempt.data.data.user.role === 'student',
    JSON.stringify(adminAttempt.data)
  );

  // Test 5: Password Length Validation (< 6 chars rejected)
  const shortPass = await req('/auth/register', {
    method: 'POST',
    body: {
      name: 'Short Pass User',
      email: `shortpass_${timestamp}@test.edu`,
      password: '123',
      role: 'student'
    }
  });
  assert(
    'Password Under 6 Characters Rejected (400)',
    shortPass.status === 400 && shortPass.data.message.includes('at least 6 characters'),
    JSON.stringify(shortPass.data)
  );

  // Test 6: Duplicate Email Registration Blocked
  const dupReg = await req('/auth/register', {
    method: 'POST',
    body: {
      name: 'Duplicate Aditi',
      email: studentEmail,
      password: 'password123',
      role: 'student'
    }
  });
  assert(
    'Duplicate Email Registration Rejected (400)',
    dupReg.status === 400 && dupReg.data.message.includes('already in use'),
    JSON.stringify(dupReg.data)
  );

  // Test 7: Seeded Admin Login Works
  const adminLogin = await req('/auth/login', {
    method: 'POST',
    body: { email: 'admin@shikshalok.com', password: 'admin123' }
  });
  assert(
    'Seeded Admin Login Works (role=admin)',
    adminLogin.status === 200 && adminLogin.data.data.user.role === 'admin' && !!adminLogin.data.data.token,
    JSON.stringify(adminLogin.data)
  );

  // Test 8: Seeded Teacher Login Works
  const teacherLogin = await req('/auth/login', {
    method: 'POST',
    body: { email: 'teacher@shikshalok.com', password: 'teacher123' }
  });
  assert(
    'Seeded Teacher Login Works (role=teacher)',
    teacherLogin.status === 200 && teacherLogin.data.data.user.role === 'teacher' && !!teacherLogin.data.data.token,
    JSON.stringify(teacherLogin.data)
  );

  // Test 9: Seeded Student Login Works
  const studentLogin = await req('/auth/login', {
    method: 'POST',
    body: { email: 'student1@shikshalok.com', password: 'student123' }
  });
  assert(
    'Seeded Student Login Works (role=student)',
    studentLogin.status === 200 && studentLogin.data.data.user.role === 'student' && !!studentLogin.data.data.token,
    JSON.stringify(studentLogin.data)
  );

  console.log(`--- SUMMARY: ${passCount}/${totalTests} TESTS PASSED ---`);
  if (passCount !== totalTests) {
    process.exit(1);
  }
}

runRegistrationTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
