import React from 'react';
import Badge from './Badge';
import { formatTime, formatDuration } from '../utils/constants';

const AttendanceTable = ({ records = [], showStudent = true, showClass = true }) => {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid var(--border)', background: 'var(--bg-primary)' }}>
            {showStudent && <th style={{ padding: '1rem' }}>Student</th>}
            {showClass && <th style={{ padding: '1rem' }}>Class</th>}
            <th style={{ padding: '1rem' }}>Join Time</th>
            <th style={{ padding: '1rem' }}>Leave Time</th>
            <th style={{ padding: '1rem' }}>Duration</th>
            <th style={{ padding: '1rem' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                No attendance records found.
              </td>
            </tr>
          ) : (
            records.map((record) => {
              const studentName = record.student?.name || record.studentId?.name || (typeof record.studentId === 'string' ? record.studentId : 'Unknown Student');
              const classTitle = record.session?.class?.title || record.classId?.title || record.classTitle || (record.sessionId?.classId?.title) || 'Live Class';
              const join = record.joinTime || record.joinedAt;
              const leave = record.leaveTime || record.leftAt;
              const duration = record.duration || 0;

              return (
                <tr key={record._id} style={{ borderBottom: '1px solid var(--border)' }}>
                  {showStudent && <td style={{ padding: '1rem', fontWeight: '500' }}>{studentName}</td>}
                  {showClass && <td style={{ padding: '1rem' }}>{classTitle}</td>}
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{join ? formatTime(join) : '-'}</td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{leave ? formatTime(leave) : '-'}</td>
                  <td style={{ padding: '1rem' }}>{formatDuration(duration)}</td>
                  <td style={{ padding: '1rem' }}>
                    <Badge variant={record.status === 'present' ? 'success' : record.status === 'partial' ? 'warning' : 'danger'}>
                      {record.status?.toUpperCase() || 'PRESENT'}
                    </Badge>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
