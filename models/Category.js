import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  slug: { type: String, required: true },
  description: { type: String },
  count: { type: Number, default: 0 },
  type: { type: String, default: 'service' },
  icon: { type: String },
  image: { type: String },
  startingPrice: { type: String }
}, { timestamps: true });

export default mongoose.model('Category', categorySchema);
