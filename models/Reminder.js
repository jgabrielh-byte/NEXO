import mongoose from 'mongoose';

const ReminderSchema = new mongoose.Schema({
  title: { type: String, required: true },
  dateTime: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Reminder', ReminderSchema);