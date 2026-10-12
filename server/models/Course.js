import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title']
  },
  description: {
    type: String
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Please add a teacher']
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: []
  }],
  subject: {
    type: String
  },
  thumbnail: {
    type: String,
    default: ''
  }
}, { timestamps: true });

courseSchema.index({ teacher: 1 });

export default mongoose.model('Course', courseSchema);
