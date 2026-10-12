import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import User from '../models/User.js';
import Course from '../models/Course.js';
import Class from '../models/Class.js';
import LiveSession from '../models/LiveSession.js';
import Attendance from '../models/Attendance.js';
import Resource from '../models/Resource.js';
import Alert from '../models/Alert.js';
import ChatMessage from '../models/ChatMessage.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await Promise.all([
      User.deleteMany(), Course.deleteMany(), Class.deleteMany(),
      LiveSession.deleteMany(), Attendance.deleteMany(), Resource.deleteMany(),
      Alert.deleteMany(), ChatMessage.deleteMany()
    ]);

    const users = await User.create([
      { name: 'Admin User', email: 'admin@shikshalok.com', password: 'admin123', role: 'admin', college: 'ShikshaLok Admin' },
      { name: 'Dr. Rajesh Kumar', email: 'teacher@shikshalok.com', password: 'teacher123', role: 'teacher', college: 'IIT Delhi' },
      { name: 'Prof. Anita Sharma', email: 'teacher2@shikshalok.com', password: 'teacher123', role: 'teacher', college: 'NIT Trichy' },
      { name: 'Rahul Sharma', email: 'student1@shikshalok.com', password: 'student123', role: 'student', college: 'IIT Delhi' },
      { name: 'Priya Patel', email: 'student2@shikshalok.com', password: 'student123', role: 'student', college: 'NIT Trichy' },
      { name: 'Aman Verma', email: 'student3@shikshalok.com', password: 'student123', role: 'student', college: 'BITS Pilani' },
      { name: 'Sneha Gupta', email: 'student4@shikshalok.com', password: 'student123', role: 'student', college: 'IIT Bombay' },
      { name: 'Vikram Singh', email: 'student5@shikshalok.com', password: 'student123', role: 'student', college: 'DTU Delhi' }
    ]);

    const admin = users[0];
    const t1 = users[1], t2 = users[2];
    const s1 = users[3], s2 = users[4], s3 = users[5], s4 = users[6], s5 = users[7];

    const courses = await Course.create([
      { title: 'Data Structures & Algorithms', teacher: t1._id, subject: 'Computer Science', students: [s1._id, s2._id, s3._id] },
      { title: 'Web Development', teacher: t1._id, subject: 'Computer Science', students: [s1._id, s2._id, s4._id, s5._id] },
      { title: 'Database Management Systems', teacher: t2._id, subject: 'Computer Science', students: [s2._id, s3._id, s5._id] }
    ]);

    const classes = await Class.create([
      { course: courses[0]._id, teacher: t1._id, title: 'DSA Intro', scheduledAt: new Date(Date.now() + 86400000), status: 'scheduled' },
      { course: courses[0]._id, teacher: t1._id, title: 'Arrays and Strings', scheduledAt: new Date(Date.now() - 86400000), status: 'completed' },
      { course: courses[1]._id, teacher: t1._id, title: 'HTML Basics', scheduledAt: new Date(Date.now() + 172800000), status: 'scheduled' },
      { course: courses[1]._id, teacher: t1._id, title: 'CSS Flexbox', scheduledAt: new Date(Date.now() - 172800000), status: 'completed' },
      { course: courses[2]._id, teacher: t2._id, title: 'ER Models', scheduledAt: new Date(Date.now() + 259200000), status: 'scheduled' },
      { course: courses[2]._id, teacher: t2._id, title: 'SQL Joins', scheduledAt: new Date(Date.now() - 259200000), status: 'completed' }
    ]);

    await Alert.create([
      { title: 'Welcome', message: 'Welcome to ShikshaLok', type: 'info', sender: admin._id, recipients: [s1._id, s2._id] },
      { title: 'Class Rescheduled', message: 'DSA Intro moved', type: 'warning', sender: t1._id, recipients: [s1._id, s2._id, s3._id], courseId: courses[0]._id },
      { title: 'Exam Tomorrow', message: 'DBMS Exam', type: 'urgent', sender: t2._id, recipients: [s2._id, s3._id, s5._id], courseId: courses[2]._id }
    ]);

    console.log('Database seeded successfully');
    console.log('Test Credentials:');
    console.log('Admin: admin@shikshalok.com / admin123');
    console.log('Teacher: teacher@shikshalok.com / teacher123');
    console.log('Student: student1@shikshalok.com / student123');
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
