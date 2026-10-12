import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaGraduationCap, FaChalkboardTeacher, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useAuth } from '../../context/AuthContext';

const RegisterPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'teacher' ? 'teacher' : (searchParams.get('role') === 'student' ? 'student' : null);

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setError('');
    setSearchParams({ role });
  };

  const handleBackToRoles = () => {
    setSelectedRole(null);
    setError('');
    setSearchParams({});
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Please enter your full name';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      return 'Please enter a valid email address';
    }
    if (selectedRole === 'teacher' && !formData.college.trim()) {
      return 'Please enter your college or institutional affiliation';
    }
    if (!formData.password || formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const data = await register({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        college: formData.college.trim(),
        phone: formData.phone.trim(),
        role: selectedRole
      });

      const role = data?.user?.role || selectedRole;
      navigate(`/${role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your information and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      {!selectedRole ? (
        /* STEP 1: ROLE SELECTION CARDS */
        <Card style={{ padding: '2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Join ShikshaLok
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto' }}>
              Choose how you would like to participate in the virtual education platform to get started.
            </p>
          </div>

          <div className="role-selection-grid">
            {/* Student Role Card */}
            <div
              className="role-card student-card"
              tabIndex={0}
              role="button"
              aria-label="Register as Student"
              onClick={() => handleSelectRole('student')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectRole('student'); }}
            >
              <div>
                <div className="role-icon-wrapper role-icon-student">
                  <FaGraduationCap />
                </div>
                <h3 className="role-title">Register as Student</h3>
                <p className="role-description">
                  Join courses, attend online classes, access study materials, track attendance, and receive announcements.
                </p>
                <ul className="role-features">
                  <li className="role-feature-item">
                    <span className="role-feature-bullet"></span>
                    <span>Browse & enroll in college courses</span>
                  </li>
                  <li className="role-feature-item">
                    <span className="role-feature-bullet"></span>
                    <span>Interactive live video classroom with chat</span>
                  </li>
                  <li className="role-feature-item">
                    <span className="role-feature-bullet"></span>
                    <span>Automated attendance & learning resources</span>
                  </li>
                </ul>
              </div>
              <Button
                type="button"
                variant="primary"
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={(e) => { e.stopPropagation(); handleSelectRole('student'); }}
              >
                <FaGraduationCap style={{ marginRight: '0.5rem' }} />
                Register as Student
              </Button>
            </div>

            {/* Teacher Role Card */}
            <div
              className="role-card teacher-card"
              tabIndex={0}
              role="button"
              aria-label="Register as Teacher"
              onClick={() => handleSelectRole('teacher')}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelectRole('teacher'); }}
            >
              <div>
                <div className="role-icon-wrapper role-icon-teacher">
                  <FaChalkboardTeacher />
                </div>
                <h3 className="role-title">Register as Teacher</h3>
                <p className="role-description">
                  Create and manage courses, schedule classes, conduct live sessions, monitor attendance, share resources, and send announcements.
                </p>
                <ul className="role-features">
                  <li className="role-feature-item">
                    <span className="role-feature-bullet"></span>
                    <span>Design curriculum & schedule classes</span>
                  </li>
                  <li className="role-feature-item">
                    <span className="role-feature-bullet"></span>
                    <span>Host WebRTC live video classes & monitor students</span>
                  </li>
                  <li className="role-feature-item">
                    <span className="role-feature-bullet"></span>
                    <span>Upload course materials & broadcast alerts</span>
                  </li>
                </ul>
              </div>
              <Button
                type="button"
                variant="secondary"
                style={{ width: '100%', marginTop: 'auto' }}
                onClick={(e) => { e.stopPropagation(); handleSelectRole('teacher'); }}
              >
                <FaChalkboardTeacher style={{ marginRight: '0.5rem' }} />
                Register as Teacher
              </Button>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.925rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>
              Login here
            </Link>
          </p>
        </Card>
      ) : (
        /* STEP 2: REUSABLE ADAPTIVE REGISTRATION FORM */
        <Card style={{ maxWidth: '520px', margin: '0 auto', padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <button
              type="button"
              onClick={handleBackToRoles}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontSize: '0.875rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                padding: '0.25rem 0.5rem',
                borderRadius: 'var(--radius-sm)'
              }}
              aria-label="Go back to role selection"
            >
              <FaArrowLeft /> Back to role selection
            </button>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.25rem 0.75rem',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: '600',
                background: selectedRole === 'teacher' ? '#E0F2FE' : '#EEF2FF',
                color: selectedRole === 'teacher' ? 'var(--secondary)' : 'var(--primary)'
              }}
            >
              {selectedRole === 'teacher' ? <FaChalkboardTeacher /> : <FaGraduationCap />}
              {selectedRole === 'teacher' ? 'Teacher Account' : 'Student Account'}
            </span>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
              {selectedRole === 'teacher' ? 'Teacher Registration' : 'Student Registration'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {selectedRole === 'teacher'
                ? 'Create your instructor profile to start conducting live classes.'
                : 'Create your student profile to access courses and join live sessions.'}
            </p>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: '#FEE2E2',
                border: '1px solid #FCA5A5',
                color: 'var(--danger)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.25rem',
                fontSize: '0.875rem',
                textAlign: 'left'
              }}
              role="alert"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <Input
              label="Full Name *"
              name="name"
              placeholder="e.g. Rahul Sharma"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              label="Email Address *"
              type="email"
              name="email"
              placeholder="e.g. rahul@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <div style={{ marginBottom: '1rem' }}>
              <Input
                label={selectedRole === 'teacher' ? 'College / University Affiliation *' : 'College / Institution (Optional)'}
                name="college"
                placeholder={selectedRole === 'teacher' ? 'e.g. IIT Delhi, NIT Trichy' : 'e.g. Delhi University'}
                value={formData.college}
                onChange={handleChange}
                required={selectedRole === 'teacher'}
                disabled={loading}
              />
              {selectedRole === 'teacher' && (
                <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'block', marginTop: '-0.5rem' }}>
                  Institutional affiliation is required for educator verification and course hosting.
                </small>
              )}
            </div>

            <Input
              label="Phone Number (Optional)"
              type="tel"
              name="phone"
              placeholder="e.g. +91 9876543210"
              value={formData.phone}
              onChange={handleChange}
              disabled={loading}
            />

            <Input
              label="Password (min. 6 characters) *"
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Input
              label="Confirm Password *"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={loading}
            />

            <Button
              type="submit"
              variant={selectedRole === 'teacher' ? 'secondary' : 'primary'}
              loading={loading}
              disabled={loading}
              style={{ width: '100%', marginTop: '1rem', padding: '0.75rem' }}
            >
              {loading
                ? 'Creating Account...'
                : selectedRole === 'teacher'
                ? 'Complete Teacher Registration'
                : 'Complete Student Registration'}
            </Button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '600' }}>
              Login
            </Link>
          </p>
        </Card>
      )}
    </div>
  );
};

export default RegisterPage;
