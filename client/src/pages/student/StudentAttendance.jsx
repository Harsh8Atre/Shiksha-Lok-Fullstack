import React, { useState, useEffect } from 'react';
import AttendanceTable from '../../components/AttendanceTable';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import EmptyState from '../../components/EmptyState';
import ErrorMessage from '../../components/ErrorMessage';
import { useAuth } from '../../context/AuthContext';
import attendanceService from '../../services/attendanceService';

const StudentAttendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await attendanceService.getStudentAttendance(user._id);
      const list = res.data || res || [];
      setRecords(list);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchAttendance();
    }
  }, [user]);

  if (loading) return <Loader fullPage={false} />;

  // Metrics
  const total = records.length;
  const present = records.filter(r => r.status === 'present').length;
  const rate = total > 0 ? Math.round((present / total) * 100) : 100;
  const totalSeconds = records.reduce((acc, curr) => acc + (curr.duration || 0), 0);
  const totalHours = (totalSeconds / 3600).toFixed(1);

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>My Attendance Record</h1>

      {error && <ErrorMessage message={error} onRetry={fetchAttendance} />}

      <div className="dashboard-grid" style={{ marginBottom: '2rem' }}>
        <Card>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{rate}%</div>
          <div style={{ color: 'var(--text-secondary)' }}>Attendance Rate</div>
        </Card>
        <Card>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>{present} / {total}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Sessions Attended</div>
        </Card>
        <Card>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{totalHours} hrs</div>
          <div style={{ color: 'var(--text-secondary)' }}>Total Live Time</div>
        </Card>
      </div>

      {records.length === 0 ? (
        <EmptyState
          title="No attendance records found"
          message="When you attend live class sessions, your join time and duration will be logged here automatically."
        />
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <AttendanceTable records={records} showClass={true} showStudent={false} />
        </Card>
      )}
    </div>
  );
};

export default StudentAttendance;
