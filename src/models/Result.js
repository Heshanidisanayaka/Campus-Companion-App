import mongoose from 'mongoose';

const ResultSchema = new mongoose.Schema({
  userId: {
    type: String, // Temporarily String since we don't have user auth fully set up
    required: true,
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject.'],
    maxlength: [100, 'Subject cannot be more than 100 characters'],
  },
  grade: {
    type: String,
    required: [true, 'Please specify the grade.'],
  },
  credits: {
    type: Number,
    required: [true, 'Please specify the number of credits.'],
    min: [1, 'Credits must be at least 1'],
    max: [20, 'Credits cannot exceed 20 per subject'],
  },
}, { timestamps: true });

export default mongoose.models.Result || mongoose.model('Result', ResultSchema);
