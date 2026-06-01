import mongoose from 'mongoose';

const DeadlineSchema = new mongoose.Schema({
  userId: {
    type: String, // Temporarily String since we don't have user auth fully set up
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
    maxlength: [150, 'Title cannot be more than 150 characters'],
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject.'],
    maxlength: [100, 'Subject cannot be more than 100 characters'],
  },
  type: {
    type: String,
    required: [true, 'Please specify the deadline type.'],
    enum: ['Assignment', 'Quiz', 'Exam'],
  },
  dueDate: {
    type: Date,
    required: [true, 'Please specify a due date.'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'],
    default: 'Pending',
  },
}, { timestamps: true });

export default mongoose.models.Deadline || mongoose.model('Deadline', DeadlineSchema);
