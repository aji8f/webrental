import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String },
    date: { type: String },
    location: { type: String },
    description: { type: String },
    visible: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    access: { type: String, default: 'public' },
    coverImage: { type: String },
    gallery: [{
        url: String,
        caption1: String,
        caption2: String
    }],
    id: { type: String, unique: true }, // Keeping string ID from db.json
    galleryCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Project', projectSchema);
