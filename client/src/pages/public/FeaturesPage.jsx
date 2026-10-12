import React from 'react';
import Card from '../../components/Card';
import { FiVideo, FiCheckSquare, FiEye, FiBell, FiFileText, FiLock, FiMessageSquare } from 'react-icons/fi';

const FeaturesPage = () => {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          Platform Features & Capabilities
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
          Explore the academic tooling and real-time infrastructure designed into ShikshaLok.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <Card>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: '12px', color: 'white' }}>
              <FiVideo size={32} />
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.35rem' }}>1. WebRTC Live Virtual Classrooms</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                Conduct live face-to-face academic sessions using browser-native WebRTC peer connections. Does not rely on fake video elements or external meeting links.
              </p>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                <li>Low-latency adaptive video grid rendering teacher and student streams.</li>
                <li>In-session camera and microphone toggling with out-of-band signaling sync.</li>
                <li>Teacher session controls: one-click "Go Live" broadcast and "End Session" triggers.</li>
                <li>Clean fallbacks and permission recovery modals for denied hardware access.</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '1rem', background: 'var(--accent)', borderRadius: '12px', color: 'white' }}>
              <FiCheckSquare size={32} />
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.35rem' }}>2. Automated Participation Attendance</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                Attendance is not a static checkbox. The system measures real attendance from session socket presence.
              </p>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                <li>Automatic timestamping of exact join times upon room connection.</li>
                <li>Calculation of total active duration (seconds) upon leaving or session completion.</li>
                <li>Audit reports broken down by course, lecture, and student profile.</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '1rem', background: 'var(--warning)', borderRadius: '12px', color: 'white' }}>
              <FiEye size={32} />
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.35rem' }}>3. Real-Time Student Monitoring</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                Non-invasive faculty monitor allowing instructors to supervise classroom engagement without intrusive spyware.
              </p>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                <li>Live participant status cards (Online / Disconnected).</li>
                <li>Camera readiness and microphone mute status indicators.</li>
                <li>Elapsed connection time display for every active participant.</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '1rem', background: 'var(--danger)', borderRadius: '12px', color: 'white' }}>
              <FiBell size={32} />
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.35rem' }}>4. Instant Push Announcements & Alerts</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                Keep students informed about timetable changes, exam dates, and urgent institutional notices.
              </p>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                <li>Socket.IO live delivery for immediately connected devices.</li>
                <li>Persistent storage in MongoDB for review by students when offline.</li>
                <li>Color-coded severity tags (Info, Warning, Urgent, Announcement) and read confirmations.</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
            <div style={{ padding: '1rem', background: 'var(--secondary)', borderRadius: '12px', color: 'white' }}>
              <FiMessageSquare size={32} />
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.35rem' }}>5. In-Session Classroom Chat</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1rem' }}>
                Enables questions and feedback without interrupting the speaker's audio stream.
              </p>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                <li>Scoped to the active classroom room ID—messages do not leak across lectures.</li>
                <li>Archived to MongoDB with timestamps and sender metadata.</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FeaturesPage;
