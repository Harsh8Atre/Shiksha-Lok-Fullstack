import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'urgent', 'announcement'],
    default: 'info'
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipients: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }]
}, { timestamps: true });

alertSchema.index({ recipients: 1, createdAt: -1 });

export default mongoose.model('Alert', alertSchema);
