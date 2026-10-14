import React, { useState, useEffect } from 'react';
import AttendanceTable from '../../components/AttendanceTable';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import sessionService from '../../services/sessionService';
import attendanceService from '../../services/attendanceService';
import '../../assets/styles/pages.css';

const TeacherAttendance = () => {
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await sessionService.getSessions();
        const list = res.data || res || [];
        setSessions(list);
        if (list.length > 0) {
          setSelectedSessionId(list[0]._id);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load sessions');
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  useEffect(() => {
    if (!selectedSessionId) {
      setRecords([]);
      return;
    }

    const fetchRecords = async () => {
      setLoadingRecords(true);
      try {
        const res = await attendanceService.getSessionAttendance(selectedSessionId);
        const list = res.data || res || [];
        setRecords(list);
      } catch (err) {
        console.error('Failed to load session attendance', err);
      } finally {
        setLoadingRecords(false);
      }
    };
    fetchRecords();
  }, [selectedSessionId]);

  if (loading) return <Loader fullPage={false} />;

  return (
    <div>
      <div className="responsive-page-header attendance-reports-header">
        <div className="responsive-page-heading">
          <h1>Class Attendance Reports</h1>
        </div>

        {sessions.length > 0 && (
          <div className="attendance-session-filter">
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(e.target.value)}
              aria-label="Select session for attendance report"
            >
              {sessions.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.classId?.title || "Session"} (
                  {new Date(s.createdAt).toLocaleDateString()}) -{" "}
                  {s.status?.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      {sessions.length === 0 ? (
        <EmptyState
          title="No live sessions recorded yet"
          message="When you conduct live classes, attendance will be automatically tracked here."
        />
      ) : loadingRecords ? (
        <Loader fullPage={false} />
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <AttendanceTable records={records} showClass={true} showStudent={true} />
        </Card>
      )}
    </div>
  );
};

export default TeacherAttendance;
