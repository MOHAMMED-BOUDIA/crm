import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, required: true },
  phone: { type: String },
  status: { type: String, default: 'Active' },
}, { timestamps: true });

export default mongoose.models.Customer || mongoose.model('Customer', customerSchema);
