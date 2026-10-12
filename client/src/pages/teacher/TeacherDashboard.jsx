import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import ClassCard from '../../components/ClassCard';
import { useAuth } from '../../context/AuthContext';
import { FiBook, FiVideo, FiUsers, FiActivity, FiPlus } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import courseService from '../../services/courseService';
import classService from '../../services/classService';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ courses: 0, classes: 0, students: 0, live: 0 });
  const [upcomingClasses, setUpcomingClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [courseRes, classRes] = await Promise.all([
          courseService.getCourses(),
          classService.getClasses()
        ]);

        const courses = courseRes.data || courseRes || [];
        const classes = classRes.data || classRes || [];

        // Count unique students across all teacher's courses
        const studentSet = new Set();
        courses.forEach(c => {
          if (Array.isArray(c.students)) {
            c.students.forEach(s => {
              const sId = typeof s === 'object' ? s._id : s;
              if (sId) studentSet.add(sId.toString());
            });
          }
        });

        const liveCount = classes.filter(c => c.status === 'live').length;
        const upcoming = classes
          .filter(c => c.status === 'scheduled' || c.status === 'live')
          .slice(0, 3);

        setStats({
          courses: courses.length,
          classes: classes.length,
          students: studentSet.size,
          live: liveCount
        });
        setUpcomingClasses(upcoming);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <Loader fullPage={false} />;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Welcome, {user?.name}!</h1>
          <p style={{ color: 'var(--text-secondary)', margin: '0.5rem 0 0 0' }}>{user?.college || 'Faculty'}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="primary" onClick={() => navigate('/teacher/classes/create')}>
            <FiPlus style={{ marginRight: '0.5rem' }} /> Schedule Class
          </Button>
          <Button variant="secondary" onClick={() => navigate('/teacher/courses/create')}>
            <FiPlus style={{ marginRight: '0.5rem' }} /> New Course
          </Button>
        </div>
      </div>
      
      <div className="dashboard-grid" style={{ marginBottom: '2.5rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: '12px', color: 'white' }}>
              <FiBook size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.courses}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Total Courses</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--warning)', borderRadius: '12px', color: 'white' }}>
              <FiVideo size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.classes}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Total Classes</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'var(--success)', borderRadius: '12px', color: 'white' }}>
              <FiUsers size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.students}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Enrolled Students</div>
            </div>
          </div>
        </Card>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: stats.live > 0 ? 'var(--accent)' : 'var(--danger)', borderRadius: '12px', color: 'white' }}>
              <FiActivity size={24} />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.live}</div>
              <div style={{ color: 'var(--text-secondary)' }}>Live Sessions Now</div>
            </div>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>Upcoming / Live Classes</h3>
            <Link to="/teacher/classes" style={{ color: 'var(--primary)', fontWeight: '500' }}>View All</Link>
          </div>
          {upcomingClasses.length === 0 ? (
            <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1.5rem 0' }}>
              No classes currently scheduled.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {upcomingClasses.map(c => (
                <ClassCard key={c._id} classItem={c} showJoin={false} />
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h3 style={{ margin: '0 0 1rem 0' }}>Quick Actions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Button variant="outline" onClick={() => navigate('/teacher/alerts')} style={{ justifyContent: 'flex-start' }}>
              📢 Send Class Announcement / Alert
            </Button>
            <Button variant="outline" onClick={() => navigate('/teacher/resources')} style={{ justifyContent: 'flex-start' }}>
              📁 Upload Learning Resource / Notes
            </Button>
            <Button variant="outline" onClick={() => navigate('/teacher/attendance')} style={{ justifyContent: 'flex-start' }}>
              📊 View Class Attendance Reports
            </Button>
            <Button variant="outline" onClick={() => navigate('/teacher/students')} style={{ justifyContent: 'flex-start' }}>
              👥 View Enrolled Students Directory
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TeacherDashboard;
