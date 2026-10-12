import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LiveSession',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

chatMessageSchema.index({ sessionId: 1, createdAt: 1 });

export default mongoose.model('ChatMessage', chatMessageSchema);
