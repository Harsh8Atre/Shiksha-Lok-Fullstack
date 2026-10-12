import React from 'react';
import { Link } from 'react-router-dom';
import { FiVideo, FiCheckSquare, FiEye, FiFileText, FiBell, FiShield, FiArrowRight } from 'react-icons/fi';
import Button from '../../components/Button';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <span style={{ display: 'inline-block', padding: '0.4rem 1rem', background: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary)', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
            Next-Generation Virtual Learning & Classroom Infrastructure
          </span>
          <h1 style={{ fontSize: '3.2rem', color: 'var(--text-primary)', marginBottom: '1.25rem', lineHeight: '1.15', fontWeight: '800' }}>
            ShikshaLok
          </h1>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--primary-dark)', marginBottom: '1.5rem', fontWeight: '600' }}>
            Bringing quality digital education closer to every student.
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '2.5rem' }}>
            Designed for colleges and institutions where access to quality teaching infrastructure may be limited. Empower faculty with low-latency live classrooms, automated participation tracking, and real-time student monitoring.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <Button variant="primary" size="lg" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Get Started Free <FiArrowRight />
              </Button>
            </Link>
            <Link to="/features">
              <Button variant="outline" size="lg">Explore Platform</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section style={{ padding: '2rem 1.5rem', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          <div style={{ padding: '1rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--primary)' }}>100%</div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Live Classrooms</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Peer-to-peer WebRTC video</div>
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--accent)' }}>Automated</div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Attendance Logs</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Exact join, leave & duration</div>
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--warning)' }}>Real-time</div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Smart Monitoring</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Camera & audio engagement</div>
          </div>
          <div style={{ padding: '1rem' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--secondary)' }}>Instant</div>
            <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Broadcast Alerts</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Socket.io live delivery</div>
          </div>
        </div>
      </section>

      {/* How it Works / Workflow Architecture */}
      <section style={{ padding: '4.5rem 1.5rem', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '1rem', fontWeight: '700' }}>
            How ShikshaLok Works
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 3.5rem' }}>
            A unified workflow connecting faculty instruction to verified student participation.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 'bold' }}>1</div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Faculty Creates Class</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Course teachers schedule lectures with custom syllabi and duration.</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 'bold' }}>2</div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Teacher Goes Live</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>One-click classroom stream start with full camera & mic controls.</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 'bold' }}>3</div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Students Join In</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Students enter the session room with interactive video & live chat.</p>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '1.75rem 1.25rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontWeight: 'bold' }}>4</div>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>Auto Attendance & Audit</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>Join/leave times logged in MongoDB for verified institution records.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Pillars */}
      <section style={{ padding: '4.5rem 1.5rem', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '2.2rem', marginBottom: '1rem', fontWeight: '700' }}>
            Core Platform Capabilities
          </h2>
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto 3rem' }}>
            Built specifically for academic rigor, operational reliability, and ease of use.
          </p>

          <div className="feature-grid">
            <div className="card">
              <FiVideo size={36} color="var(--primary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0' }}>WebRTC Live Classroom</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Actual browser camera and microphone streams powered by WebRTC mesh architecture. Adaptive video grids, device toggles, and live text chat.
              </p>
            </div>
            <div className="card">
              <FiCheckSquare size={36} color="var(--accent)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Participation Attendance</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Attendance is computed from actual presence and seconds attended in live sessions rather than simply opening the class page.
              </p>
            </div>
            <div className="card">
              <FiEye size={36} color="var(--warning)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Faculty Student Monitor</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Non-invasive faculty monitor displaying real-time connection status, camera readiness, join times, and elapsed session duration.
              </p>
            </div>
            <div className="card">
              <FiBell size={36} color="var(--danger)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Targeted Real-time Alerts</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Faculty and administrators can broadcast categorized alerts directly to connected student devices via Socket.IO with read confirmations.
              </p>
            </div>
            <div className="card">
              <FiFileText size={36} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Course Resource Storage</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Structured multi-format file uploads (PDF, PPT, DOC, code files) organized by course with direct download access for enrolled students.
              </p>
            </div>
            <div className="card">
              <FiShield size={36} color="var(--primary-dark)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Role-Based Access Control</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Strict multi-tier security with JWT authentication and granular role authorization for Student, Teacher, and Administrator accounts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section style={{ padding: '4.5rem 1.5rem', background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)', color: 'white', textAlign: 'center' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '1rem', color: 'white' }}>
            Ready to experience ShikshaLok?
          </h2>
          <p style={{ color: '#C7D2FE', fontSize: '1.1rem', marginBottom: '2.5rem', lineHeight: '1.6' }}>
            Create an account today or login with pre-configured faculty and student test accounts to explore the live virtual classroom.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register">
              <Button variant="primary" size="lg" style={{ background: '#4F46E5', borderColor: '#6366F1' }}>
                Register as Student
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" style={{ color: 'white', borderColor: 'white' }}>
                Sign In to Portal
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
