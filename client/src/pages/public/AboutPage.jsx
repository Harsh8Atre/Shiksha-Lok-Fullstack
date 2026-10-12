import React from 'react';
import Card from '../../components/Card';
import { FiCheckCircle, FiCpu, FiLayers, FiCompass } from 'react-icons/fi';

const AboutPage = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>
          About ShikshaLok
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
          Bridging teaching infrastructure gaps in regional colleges through verified virtual classrooms and reliable academic tooling.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--primary-light)', borderRadius: '10px', color: 'white' }}>
              <FiCompass size={24} />
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.35rem' }}>The Mission Behind ShikshaLok</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Across many regional and community colleges, students and professors face acute limitations in laboratory space, physical classroom availability, and access to specialized faculty. ShikshaLok was engineered to establish a standardized, lightweight virtual classroom environment where verified teaching, attendance tracking, and resource management occur without costly infrastructure.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--accent)', borderRadius: '10px', color: 'white' }}>
              <FiCheckCircle size={24} />
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.35rem' }}>The Problem We Address</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                Generic meeting platforms treat education like corporate video calls—they lack integrated course enrollments, automated participation audit logs, teacher-controlled student monitoring, and persistent document repositories. ShikshaLok integrates curriculum scheduling directly with low-latency WebRTC streams and cryptographically verified presence tracking.
              </p>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--secondary)', borderRadius: '10px', color: 'white' }}>
              <FiCpu size={24} />
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.35rem' }}>Underlying Technology Architecture</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', marginBottom: '1rem' }}>
                ShikshaLok is built on a clean full-stack monorepo:
              </p>
              <ul style={{ paddingLeft: '1.5rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                <li><strong>Frontend:</strong> React 18 with Vite, React Router v7, and CSS custom properties design tokens.</li>
                <li><strong>Backend:</strong> Node.js, Express REST API, and Mongoose ODM with structured relation indexing.</li>
                <li><strong>Real-time Layer:</strong> Socket.IO for low-latency session room state, live chat, and instant push alerts.</li>
                <li><strong>Audio/Video:</strong> Native browser WebRTC APIs utilizing STUN candidate discovery and SDP negotiation for peer-to-peer media delivery.</li>
              </ul>
            </div>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--warning)', borderRadius: '10px', color: 'white' }}>
              <FiLayers size={24} />
            </div>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.35rem' }}>Future Scope & Road Ahead</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>
                While the current MVP uses an optimized mesh topology ideal for intimate seminars (5-8 peers), the signaling architecture is modular and designed to transition seamlessly to Selective Forwarding Units (SFUs) such as LiveKit or Mediasoup for auditorium-scale lectures. Future additions include interactive whiteboards, break-out rooms, and automated lecture transcription.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;
