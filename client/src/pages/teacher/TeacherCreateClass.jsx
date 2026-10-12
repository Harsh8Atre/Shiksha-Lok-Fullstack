import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import ErrorMessage from '../../components/ErrorMessage';
import classService from '../../services/classService';
import courseService from '../../services/courseService';

const TeacherCreateClass = () => {
  const [formData, setFormData] = useState({ title: '', course: '', description: '', scheduledAt: '', duration: 60 });
  const [courses, setCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await courseService.getCourses();
        const list = res.data || res;
        setCourses(Array.isArray(list) ? list : []);
      } catch (err) {
        setError('Failed to load courses. Please create a course first.');
      } finally {
        setLoadingCourses(false);
      }
    };
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.course) {
      setError('Please select a course');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await classService.createClass(formData);
      navigate('/teacher/classes');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule class');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingCourses) return <Loader fullPage={false} />;

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Schedule Class</h1>
      <Card>
        {error && <ErrorMessage message={error} />}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Course</label>
            <select
              className="form-input"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
              value={formData.course}
              onChange={e => setFormData({...formData, course: e.target.value})}
              required
            >
              <option value="">Select a course</option>
              {courses.map(c => (
                <option key={c._id} value={c._id}>{c.title} ({c.subject})</option>
              ))}
            </select>
          </div>
          <Input label="Class Title" name="title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description (Optional)</label>
            <textarea
              className="form-input"
              rows="3"
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            ></textarea>
          </div>
          <Input label="Scheduled Time" type="datetime-local" name="scheduledAt" value={formData.scheduledAt} onChange={e => setFormData({...formData, scheduledAt: e.target.value})} required />
          <Input label="Duration (minutes)" type="number" name="duration" value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} min="15" max="300" required />
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <Button type="submit" variant="primary" loading={submitting} style={{ flex: 1 }}>Schedule Class</Button>
            <Button type="button" variant="outline" onClick={() => navigate(-1)} style={{ flex: 1 }}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default TeacherCreateClass;
