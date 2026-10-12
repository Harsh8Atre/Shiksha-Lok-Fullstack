import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import { FiTrash2, FiFileText, FiDownload } from 'react-icons/fi';
import courseService from '../../services/courseService';
import resourceService from '../../services/resourceService';

const TeacherResources = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [resources, setResources] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const fetchCourses = async () => {
    try {
      const res = await courseService.getCourses();
      const list = res.data || res || [];
      setCourses(list);
      if (list.length > 0) {
        setSelectedCourseId(list[0]._id);
      }
    } catch (err) {
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchResources = async (courseId) => {
    if (!courseId) return;
    try {
      const res = await resourceService.getCourseResources(courseId);
      setResources(res.data || res || []);
    } catch (err) {
      console.error('Failed to load resources', err);
    }
  };

  useEffect(() => {
    if (selectedCourseId) {
      fetchResources(selectedCourseId);
    } else {
      setResources([]);
    }
  }, [selectedCourseId]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) {
      alert('Please select a course');
      return;
    }
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('courseId', selectedCourseId);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('file', file);

      await resourceService.uploadResource(formData);
      setTitle('');
      setDescription('');
      setFile(null);
      // Reset file input
      const fileInput = document.getElementById('resource-file-input');
      if (fileInput) fileInput.value = '';

      await fetchResources(selectedCourseId);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload resource');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this resource?')) return;
    try {
      await resourceService.deleteResource(id);
      setResources(resources.filter(r => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete resource');
    }
  };

  if (loading) return <Loader fullPage={false} />;

  const currentCourse = courses.find(c => c._id === selectedCourseId);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0 }}>Course Resources</h1>
        {courses.length > 0 && (
          <select
            style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
            value={selectedCourseId}
            onChange={e => setSelectedCourseId(e.target.value)}
          >
            {courses.map(c => (
              <option key={c._id} value={c._id}>{c.title} ({c.subject})</option>
            ))}
          </select>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <Card>
          <h3 style={{ margin: '0 0 1rem 0' }}>Upload Resource</h3>
          <form onSubmit={handleUpload}>
            <Input label="Resource Title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Chapter 1 Slides" required />
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>Description</label>
              <textarea
                className="form-input"
                rows="2"
                style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Optional notes or instructions..."
              ></textarea>
            </div>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>File</label>
              <input
                id="resource-file-input"
                type="file"
                className="form-input"
                style={{ width: '100%' }}
                onChange={e => setFile(e.target.files[0])}
                required
              />
            </div>
            <Button type="submit" variant="primary" loading={uploading} style={{ width: '100%' }}>
              Upload File
            </Button>
          </form>
        </Card>
        
        <div>
          <h3 style={{ margin: '0 0 1rem 0' }}>Resources for {currentCourse?.title || 'Selected Course'}</h3>
          {resources.length === 0 ? (
            <EmptyState
              title="No resources uploaded yet"
              message="Upload lecture slides, notes, or reference documents for your students."
            />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {resources.map(res => (
                <Card key={res._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ padding: '0.75rem', background: 'var(--primary-light)', borderRadius: '8px', color: 'white' }}>
                      <FiFileText size={22} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, marginBottom: '0.25rem' }}>{res.title}</h4>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                        {res.fileType || 'File'} &bull; {new Date(res.createdAt).toLocaleDateString()}
                      </div>
                      {res.description && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginTop: '0.25rem' }}>
                          {res.description}
                        </div>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <a
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      style={{
                        padding: '0.5rem 0.75rem',
                        background: 'var(--bg-primary)',
                        borderRadius: 'var(--radius-sm)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        textDecoration: 'none',
                        fontSize: '0.9rem'
                      }}
                    >
                      <FiDownload /> Download
                    </a>
                    <button
                      onClick={() => handleDelete(res._id)}
                      style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', padding: '0.5rem' }}
                      title="Delete resource"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherResources;
