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
import '../../assets/styles/pages.css';

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
   <div className="course-resources-page">
  {/* Page Header */}
  <div className="responsive-page-header course-resources-header">
    <div className="responsive-page-heading">
      <h1>Course Resources</h1>
    </div>

    {courses.length > 0 && (
      <div className="course-resources-filter">
        <select
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
          aria-label="Select course resources"
        >
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title} ({c.subject})
            </option>
          ))}
        </select>
      </div>
    )}
  </div>

  {error && <ErrorMessage message={error} />}

  {/* Upload Form and Resource List */}
  <div className="course-resources-layout">
    <Card>
      <h3 className="resource-form-title">Upload Resource</h3>

      <form onSubmit={handleUpload}>
        <Input
          label="Resource Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Chapter 1 Slides"
          required
        />

        <div className="form-group resource-form-group">
          <label className="form-label" htmlFor="resource-description">
            Description
          </label>
          <textarea
            id="resource-description"
            className="form-input"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional notes or instructions..."
          />
        </div>

        <div className="form-group resource-form-group resource-file-group">
          <label className="form-label" htmlFor="resource-file-input">
            File
          </label>
          <input
            id="resource-file-input"
            type="file"
            className="form-input"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={uploading}
          style={{ width: "100%" }}
        >
          Upload File
        </Button>
      </form>
    </Card>

    <section className="course-resource-list">
      <h3 className="resource-list-title">
        Resources for {currentCourse?.title || "Selected Course"}
      </h3>

      {resources.length === 0 ? (
        <EmptyState
          title="No resources uploaded yet"
          message="Upload lecture slides, notes, or reference documents for your students."
        />
      ) : (
        <div className="resource-items">
          {resources.map((res) => (
            <Card key={res._id} style={{ minWidth: 0, maxWidth: "100%" }}>
              <div className="resource-item">
                <div className="resource-item-info">
                  <div className="resource-file-icon">
                    <FiFileText size={22} />
                  </div>

                  <div className="resource-item-details">
                    <h4>{res.title}</h4>

                    <div className="resource-item-meta">
                      {res.fileType || "File"} &bull;{" "}
                      {new Date(res.createdAt).toLocaleDateString()}
                    </div>

                    {res.description && (
                      <p className="resource-item-description">
                        {res.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="resource-item-actions">
                  <a
                    href={res.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="resource-download-link"
                  >
                    <FiDownload />
                    <span>Download</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(res._id)}
                    className="resource-delete-button"
                    title="Delete resource"
                    aria-label={`Delete ${res.title}`}
                  >
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  </div>
</div>
  );
};

export default TeacherResources;
