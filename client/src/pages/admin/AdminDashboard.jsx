import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import { FiUsers, FiBook, FiVideo, FiActivity, FiUserCheck, FiAward } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import userService from '../../services/userService';
import courseService from '../../services/courseService';
import classService from '../../services/classService';
import sessionService from '../../services/sessionService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    teachers: 0,
    totalCourses: 0,
    totalClasses: 0,
    activeSessions: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const [uRes, cRes, clRes, sRes] = await Promise.all([
          userService.getUsers(),
          courseService.getCourses({ all: 'true' }),
          classService.getClasses(),
          sessionService.getSessions()
        ]);

        const users = uRes.data || uRes || [];
        const courses = cRes.data || cRes || [];
        const classes = clRes.data || clRes || [];
        const sessions = sRes.data || sRes || [];

        const studentCount = users.filter(u => u.role === 'student').length;
        const teacherCount = users.filter(u => u.role === 'teacher').length;
        const activeCount = sessions.filter(s => s.status === 'active').length;

        setStats({
          totalUsers: users.length,
          students: studentCount,
          teachers: teacherCount,
          totalCourses: courses.length,
          totalClasses: classes.length,
          activeSessions: activeCount
        });
      } catch (err) {
        console.error('Failed to load admin stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) return <Loader fullPage={false} />;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Platform Administration Overview</h1>
      
      <div className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: '12px', color: 'white' }}>
              <FiUsers size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalUsers}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Total Registered Users</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--secondary)', borderRadius: '12px', color: 'white' }}>
              <FiUserCheck size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.students}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Active Students</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--accent)', borderRadius: '12px', color: 'white' }}>
              <FiAward size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.teachers}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Faculty / Teachers</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--warning)', borderRadius: '12px', color: 'white' }}>
              <FiBook size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalCourses}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Created Courses</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--success)', borderRadius: '12px', color: 'white' }}>
              <FiVideo size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalClasses}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Scheduled Classes</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: stats.activeSessions > 0 ? 'var(--accent)' : 'var(--danger)', borderRadius: '12px', color: 'white' }}>
              <FiActivity size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.activeSessions}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Active Live Sessions</div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card>
          <h3 style={{ margin: '0 0 1rem 0' }}>Quick Administration</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/admin/users" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontWeight: '500' }}>
                👥 Manage Users & Roles &rarr;
              </div>
            </Link>
            <Link to="/admin/courses" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontWeight: '500' }}>
                📚 View & Moderate Courses &rarr;
              </div>
            </Link>
            <Link to="/admin/sessions" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontWeight: '500' }}>
                🔴 Monitor Live Classroom Sessions &rarr;
              </div>
            </Link>
            <Link to="/admin/alerts" style={{ textDecoration: 'none' }}>
              <div style={{ padding: '0.75rem 1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontWeight: '500' }}>
                📢 Send Platform-wide Announcements &rarr;
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
