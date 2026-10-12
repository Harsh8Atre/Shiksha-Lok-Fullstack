import mongoose from 'mongoose';

const liveSessionSchema = new mongoose.Schema({
  classId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  startedAt: {
    type: Date
  },
  endedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'ended', 'completed'],
    default: 'active'
  },
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    socketId: String,
    joinedAt: {
      type: Date,
      default: Date.now
    },
    leftAt: Date,
    role: {
      type: String,
      enum: ['teacher', 'student']
    }
  }]
}, { timestamps: true });

liveSessionSchema.index({ classId: 1 });
liveSessionSchema.index({ status: 1 });

export default mongoose.model('LiveSession', liveSessionSchema);
