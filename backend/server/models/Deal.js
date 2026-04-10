import mongoose from 'mongoose';

const dealSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true },
  value: { type: Number, default: 0 },
  stage: { type: String, default: 'Prospect' },
}, { timestamps: true });

export default mongoose.models.Deal || mongoose.model('Deal', dealSchema);
