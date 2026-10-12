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
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Welcome back, {user?.name}!</h1>
        <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>{user?.college || 'Student Portal'}</p>
      </div>
      
      <div className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: '12px', color: 'white' }}>
              <FiBook size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.courses}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Enrolled Courses</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--warning)', borderRadius: '12px', color: 'white' }}>
              <FiVideo size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.upcomingClasses}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Upcoming Classes</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--success)', borderRadius: '12px', color: 'white' }}>
              <FiCheckSquare size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.attendanceRate}%</div>
              <div style={{ color: 'var(--text-secondary)' }}>Attendance Rate</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: stats.unreadAlerts > 0 ? 'var(--danger)' : 'var(--text-secondary)', borderRadius: '12px', color: 'white' }}>
              <FiBell size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.unreadAlerts}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Unread Alerts</div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Upcoming & Live Lectures</h3>
            <Link to="/student/classes" style={{ color: 'var(--primary)', fontWeight: '500' }}>View All</Link>
          </div>
          {upcomingClasses.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', padding: '1.5rem 0', textAlign: 'center' }}>
              No classes currently scheduled.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingClasses.map(c => (
                <ClassCard
                  key={c._id}
                  classItem={c}
                  showJoin={c.status === 'live'}
                  onJoin={() => navigate(`/student/live/${c.roomId}`)}
                />
              ))}
            </div>
          )}
        </Card>
        
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Recent Announcements</h3>
            <Link to="/student/alerts" style={{ color: 'var(--primary)', fontWeight: '500' }}>View All</Link>
          </div>
          {recentAlerts.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', padding: '1.5rem 0', textAlign: 'center' }}>
              No recent alerts or announcements.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recentAlerts.map(a => (
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
