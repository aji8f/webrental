import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true }, // slug or id reference, keeping as string to match db.json for now
    price_daily: { type: Number },
    unit: { type: String },
    inventory_count: { type: Number, default: 0 },
    status: { type: String, default: 'published' },
    image: { type: String }
}, { timestamps: true });

export default mongoose.model('Service', serviceSchema);
