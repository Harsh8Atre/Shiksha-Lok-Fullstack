import React, { useState, useEffect } from 'react';
import AttendanceTable from '../../components/AttendanceTable';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import sessionService from '../../services/sessionService';
import attendanceService from '../../services/attendanceService';

const AdminAttendance = () => {
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
        setError('Failed to load sessions for attendance');
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
        setRecords(res.data || res || []);
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ margin: 0 }}>Platform Attendance Audits</h1>
        {sessions.length > 0 && (
          <select
            style={{ padding: '0.6rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}
            value={selectedSessionId}
            onChange={e => setSelectedSessionId(e.target.value)}
          >
            {sessions.map(s => (
              <option key={s._id} value={s._id}>
                {s.classId?.title || 'Session'} &bull; {s.teacherId?.name || 'Faculty'} ({new Date(s.createdAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      {sessions.length === 0 ? (
        <EmptyState
          title="No live sessions recorded"
          message="Attendance records will be generated automatically when students join live classrooms."
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

export default AdminAttendance;
