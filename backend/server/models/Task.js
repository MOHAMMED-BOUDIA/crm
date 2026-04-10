import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  desc: { type: String },
  date: { type: String },
  priority: { type: String, default: 'Medium' },
  deal: { type: String },
  overdue: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.Task || mongoose.model('Task', taskSchema);
