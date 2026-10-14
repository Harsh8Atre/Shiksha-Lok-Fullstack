import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import ClassCard from '../../components/ClassCard';
import AlertCard from '../../components/AlertCard';
import { useAuth } from '../../context/AuthContext';
import { FiBook, FiVideo, FiCheckSquare, FiBell } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';
import classService from '../../services/classService';
import attendanceService from '../../services/attendanceService';
import alertService from '../../services/alertService';
import '../../assets/styles/pages.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ courses: 0, upcomingClasses: 0, attendanceRate: 100, unreadAlerts: 0 });
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [recentAlerts, setRecentAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [cRes, clRes, aRes, alRes] = await Promise.all([
          courseService.getCourses(),
          classService.getClasses(),
          attendanceService.getStudentAttendance(user._id),
          alertService.getAlerts()
        ]);

        const courses = cRes.data || cRes || [];
        const classes = clRes.data || clRes || [];
        const attendances = aRes.data || aRes || [];
        const alerts = alRes.data || alRes || [];

        // Calculate actual attendance percentage
        let rate = 100;
        if (attendances.length > 0) {
          const presentCount = attendances.filter(a => a.status === 'present').length;
          rate = Math.round((presentCount / attendances.length) * 100);
        }

        // Count unread alerts
        const unreadCount = alerts.filter(a => !a.readBy || !a.readBy.includes(user._id)).length;

        // Upcoming classes (scheduled or live)
        const upcoming = classes
          .filter(c => c.status === 'scheduled' || c.status === 'live')
          .slice(0, 3);

        setStats({
          courses: courses.length,
          upcomingClasses: upcoming.length,
          attendanceRate: rate,
          unreadAlerts: unreadCount
        });
        setUpcomingClasses(upcoming);
        setRecentAlerts(alerts.slice(0, 3));
      } catch (err) {
        console.error('Failed to load student dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDashboard();
    }
  }, [user]);

  if (loading) return <Loader fullPage={false} />;

  return (
    <div className="student-dashboard">
      <div className="responsive-page-header student-dashboard-header">
        <div className="responsive-page-heading">
          <h1>Welcome back, {user?.name}!</h1>
          <p>{user?.college || "Student Portal"}</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="dashboard-grid student-stats-grid">
        <Card>
          <div className="student-stat-item">
            <div className="student-stat-icon student-stat-icon-primary">
              <FiBook size={24} />
            </div>
            <div className="student-stat-content">
              <div className="student-stat-value">{stats.courses}</div>
              <div className="student-stat-label">Enrolled Courses</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="student-stat-item">
            <div className="student-stat-icon student-stat-icon-warning">
              <FiVideo size={24} />
            </div>
            <div className="student-stat-content">
              <div className="student-stat-value">{stats.upcomingClasses}</div>
              <div className="student-stat-label">Upcoming Classes</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="student-stat-item">
            <div className="student-stat-icon student-stat-icon-success">
              <FiCheckSquare size={24} />
            </div>
            <div className="student-stat-content">
              <div className="student-stat-value">{stats.attendanceRate}%</div>
              <div className="student-stat-label">Attendance Rate</div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="student-stat-item">
            <div
              className={`student-stat-icon ${
                stats.unreadAlerts > 0
                  ? "student-stat-icon-danger"
                  : "student-stat-icon-muted"
              }`}
            >
              <FiBell size={24} />
            </div>
            <div className="student-stat-content">
              <div className="student-stat-value">{stats.unreadAlerts}</div>
              <div className="student-stat-label">Unread Alerts</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming Classes and Announcements */}
      <div className="student-dashboard-sections">
        <Card>
          <div className="student-section-header">
            <h3>Upcoming &amp; Live Lectures</h3>
            <Link to="/student/classes" className="student-section-link">
              View All
            </Link>
          </div>

          {upcomingClasses.length === 0 ? (
            <div className="student-empty-message">
              No classes currently scheduled.
            </div>
          ) : (
            <div className="student-dashboard-list">
              {upcomingClasses.map((c) => (
                <ClassCard
                  key={c._id}
                  classItem={c}
                  showJoin={c.status === "live"}
                  onJoin={() => navigate(`/student/live/${c.roomId}`)}
                />
              ))}
            </div>
          )}
        </Card>

        <Card>
          <div className="student-section-header">
            <h3>Recent Announcements</h3>
            <Link to="/student/alerts" className="student-section-link">
              View All
            </Link>
          </div>

          {recentAlerts.length === 0 ? (
            <div className="student-empty-message">
              No recent alerts or announcements.
            </div>
          ) : (
            <div className="student-dashboard-list student-alert-list">
              {recentAlerts.map((a) => (
                <AlertCard key={a._id} alert={a} />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
