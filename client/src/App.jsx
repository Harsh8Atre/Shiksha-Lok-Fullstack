import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import ProtectedRoute from './components/ProtectedRoute';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import StudentLayout from './layouts/StudentLayout';
import TeacherLayout from './layouts/TeacherLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutPage from './pages/public/AboutPage';
import FeaturesPage from './pages/public/FeaturesPage';
import ContactPage from './pages/public/ContactPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentCourses from './pages/student/StudentCourses';
import StudentClasses from './pages/student/StudentClasses';
import StudentClassDetail from './pages/student/StudentClassDetail';
import StudentLiveClassroom from './pages/student/StudentLiveClassroom';
import StudentAttendance from './pages/student/StudentAttendance';
import StudentResources from './pages/student/StudentResources';
import StudentAlerts from './pages/student/StudentAlerts';
import StudentProfile from './pages/student/StudentProfile';

// Teacher Pages
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherCourses from './pages/teacher/TeacherCourses';
import TeacherCreateCourse from './pages/teacher/TeacherCreateCourse';
import TeacherClasses from './pages/teacher/TeacherClasses';
import TeacherCreateClass from './pages/teacher/TeacherCreateClass';
import TeacherLiveClassroom from './pages/teacher/TeacherLiveClassroom';
import TeacherAttendance from './pages/teacher/TeacherAttendance';
import TeacherStudents from './pages/teacher/TeacherStudents';
import TeacherResources from './pages/teacher/TeacherResources';
import TeacherAlerts from './pages/teacher/TeacherAlerts';
import TeacherProfile from './pages/teacher/TeacherProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminClasses from './pages/admin/AdminClasses';
import AdminSessions from './pages/admin/AdminSessions';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminAlerts from './pages/admin/AdminAlerts';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Route>

          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Student Routes */}
          <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="courses" element={<StudentCourses />} />
            <Route path="classes" element={<StudentClasses />} />
            <Route path="class/:id" element={<StudentClassDetail />} />
            <Route path="live/:roomId" element={<StudentLiveClassroom />} />
            <Route path="attendance" element={<StudentAttendance />} />
            <Route path="resources" element={<StudentResources />} />
            <Route path="alerts" element={<StudentAlerts />} />
            <Route path="profile" element={<StudentProfile />} />
          </Route>

          {/* Teacher Routes */}
          <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<TeacherDashboard />} />
            <Route path="courses" element={<TeacherCourses />} />
            <Route path="courses/create" element={<TeacherCreateCourse />} />
            <Route path="classes" element={<TeacherClasses />} />
            <Route path="classes/create" element={<TeacherCreateClass />} />
            <Route path="live/:roomId" element={<TeacherLiveClassroom />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="resources" element={<TeacherResources />} />
            <Route path="alerts" element={<TeacherAlerts />} />
            <Route path="alerts/create" element={<TeacherAlerts />} />
            <Route path="profile" element={<TeacherProfile />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="courses" element={<AdminCourses />} />
            <Route path="classes" element={<AdminClasses />} />
            <Route path="sessions" element={<AdminSessions />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="alerts" element={<AdminAlerts />} />
          </Route>
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
