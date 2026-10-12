import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const classSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Please add a course']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a teacher']
  },
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  description: {
    type: String
  },
  scheduledAt: {
    type: Date,
    required: [true, 'Please add scheduled date']
  },
  duration: {
    type: Number,
    default: 60
  },
  status: {
    type: String,
    enum: ['scheduled', 'live', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  roomId: {
    type: String,
    unique: true
  }
}, { timestamps: true });

classSchema.index({ course: 1 });
classSchema.index({ teacher: 1 });
classSchema.index({ scheduledAt: 1 });

classSchema.pre('save', function(next) {
  if (!this.roomId) {
    this.roomId = uuidv4();
  }
  next();
});

export default mongoose.model('Class', classSchema);
