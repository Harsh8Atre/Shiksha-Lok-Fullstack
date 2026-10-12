import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import ErrorMessage from '../../components/ErrorMessage';
import courseService from '../../services/courseService';

const TeacherCreateCourse = () => {
  const [formData, setFormData] = useState({ title: '', subject: '', description: '', thumbnail: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await courseService.createCourse(formData);
      navigate('/teacher/courses');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Create New Course</h1>
      <Card>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit}>
          <Input label="Course Title" name="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <Input label="Subject" name="subject" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} required />
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
            <textarea className="form-input" rows="4" style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} required></textarea>
          </div>
          <Input label="Thumbnail URL (Optional)" name="thumbnail" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} placeholder="https://..." />
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button type="submit" variant="primary" loading={loading} style={{ flex: 1 }}>Create Course</Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)} style={{ flex: 1 }}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TeacherCreateCourse;
