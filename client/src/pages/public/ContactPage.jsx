import React, { useState } from 'react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{ padding: '3.5rem 1.5rem', maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Contact Institutional Support
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0 }}>
          Have questions about onboarding your college or troubleshooting live sessions? Reach out to our technical team.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 2fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <FiMail color="var(--primary)" size={20} />
              <strong style={{ fontSize: '0.95rem' }}>Academic Inquiries</strong>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>support@shikshalok.edu</div>
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <FiPhone color="var(--accent)" size={20} />
              <strong style={{ fontSize: '0.95rem' }}>Help Desk Helpline</strong>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>+91 11 2659 1000 (Mon - Fri)</div>
          </Card>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <FiMapPin color="var(--warning)" size={20} />
              <strong style={{ fontSize: '0.95rem' }}>Campus Operations</strong>
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ShikshaLok Digital Learning Initiative, New Delhi, India</div>
          </Card>
        </div>

        <Card>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Inquiry Received</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                Thank you for reaching out. Our academic engineering desk will respond to <strong>{formData.email}</strong> within 1 business day.
              </p>
              <Button variant="outline" onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <Input
                label="Full Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. / Prof. / Student Name"
                required
              />
              <Input
                label="Institution Email"
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@college.edu"
                required
              />
              <Input
                label="Subject"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                placeholder="e.g. Setting up Virtual Classroom for Department"
                required
              />
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Message</label>
                <textarea
                  className="form-input"
                  rows="4"
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist your faculty or cohort?"
                  required
                ></textarea>
              </div>
              <Button type="submit" variant="primary" style={{ width: '100%' }}>
                Submit Message
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
