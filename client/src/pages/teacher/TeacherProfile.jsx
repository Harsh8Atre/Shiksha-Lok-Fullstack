import React, { useState } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';

const TeacherProfile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    college: user?.college || '',
    phone: user?.phone || ''
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);
    try {
      await updateUser(formData);
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Faculty Profile</h1>
      <Card>
        {success && (
          <div style={{ padding: '0.75rem 1rem', background: 'var(--success)', color: 'white', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem' }}>
            {success}
          </div>
        )}
        {error && <ErrorMessage message={error} />}

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: 0 }}>{user?.name}</h2>
            <div style={{ color: 'var(--text-secondary)' }}>{user?.email}</div>
            <span style={{ display: 'inline-block', marginTop: '0.35rem', padding: '0.2rem 0.6rem', background: 'var(--primary-light)', color: 'white', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
              FACULTY / TEACHER
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Input label="Full Name" name="name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
          <Input label="College / Department" name="college" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} placeholder="e.g. Department of Computer Science" />
          <Input label="Phone Number" name="phone" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91..." />
          <Button type="submit" variant="primary" loading={saving} style={{ marginTop: '1rem', width: '100%' }}>
            Save Changes
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default TeacherProfile;
