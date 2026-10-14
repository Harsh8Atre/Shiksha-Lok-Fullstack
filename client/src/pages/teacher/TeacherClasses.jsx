import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ClassCard from '../../components/ClassCard';
import Button from '../../components/Button';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import classService from '../../services/classService';
import sessionService from '../../services/sessionService';
import '../../assets/styles/pages.css';

const TeacherClasses = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startingId, setStartingId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchClasses = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await classService.getClasses();
      const list = res.data || res;
      setClasses(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleStartSession = async (cls) => {
    setStartingId(cls._id);
    try {
      // Create or retrieve active session for this class
      const res = await sessionService.createSession({ classId: cls._id });
      const session = res.data || res;
      const targetRoomId = session.roomId || cls.roomId;
      navigate(`/teacher/live/${targetRoomId}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to start session');
      setStartingId(null);
    }
  };

  const handleDeleteClass = async (id) => {
    if (!window.confirm('Are you sure you want to delete this class?')) return;
    try {
      await classService.deleteClass(id);
      setClasses(classes.filter(c => c._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete class');
    }
  };

  if (loading) return <Loader fullPage={false} />;

  return (
    <div className="my-classes-page">
      <div className="responsive-page-header">
        <div className="responsive-page-heading">
          <h1>My Classes</h1>
        </div>

        <div className="responsive-page-actions">
          <Link to="/teacher/classes/create" className="schedule-class-link">
            <Button variant="primary">+ Schedule Class</Button>
          </Link>
        </div>
      </div>

      {error && (
        <ErrorMessage message={error} onRetry={fetchClasses} />
      )}

      {classes.length === 0 ? (
        <EmptyState
          title="No classes scheduled"
          message="Schedule a class to conduct live lectures for your students."
          action={{
            label: "Schedule Class",
            onClick: () => navigate("/teacher/classes/create"),
          }}
        />
      ) : (
        <div className="teacher-classes-grid">
          {classes.map((c) => (
            <div className="teacher-class-item" key={c._id}>
              <ClassCard classItem={c} showJoin={false} />

              <div className="teacher-class-actions">
                {c.status !== "completed" &&
                c.status !== "cancelled" ? (
                  <Button
                    variant="success"
                    loading={startingId === c._id}
                    onClick={() => handleStartSession(c)}
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    {c.status === "live"
                      ? "Resume Live Session"
                      : "Go Live / Start"}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    disabled
                    style={{ flex: 1, minWidth: 0 }}
                  >
                    Completed
                  </Button>
                )}

                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteClass(c._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeacherClasses;
