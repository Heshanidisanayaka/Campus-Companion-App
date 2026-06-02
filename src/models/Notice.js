import mongoose from 'mongoose';

const NoticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a notice title.'],
    maxlength: [200, 'Title cannot be more than 200 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide notice content.'],
  },
  category: {
    type: String,
    required: [true, 'Please specify a category.'],
    enum: ['Academic', 'Exam', 'Library', 'Events', 'General'],
    default: 'General',
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
  postedBy: {
    type: String,
    default: 'Admin',
  },
}, { timestamps: true });

export default mongoose.models.Notice || mongoose.model('Notice', NoticeSchema);
