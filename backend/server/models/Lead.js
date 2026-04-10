import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  source: { type: String },
  status: { type: String, default: 'New' },
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model('Lead', leadSchema);
