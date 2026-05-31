import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
  userId: {
    type: String, // Temporarily String since we don't have user authentication fully setup
    required: true,
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject for the class.'],
    maxlength: [100, 'Subject cannot be more than 100 characters'],
  },
  day: {
    type: String,
    required: [true, 'Please specify the day.'],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  },
  startTime: {
    type: String,
    required: [true, 'Please specify the start time.'],
  },
  endTime: {
    type: String,
    required: [true, 'Please specify the end time.'],
  },
  venue: {
    type: String,
    required: [true, 'Please specify the venue.'],
    maxlength: [100, 'Venue cannot be more than 100 characters'],
  },
}, { timestamps: true });

export default mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);
