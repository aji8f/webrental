import mongoose from 'mongoose';

const contactClickSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['whatsapp', 'email', 'phone'],
        required: true
    },
    source: {
        type: String,
        enum: ['home', 'contact', 'footer', 'floating'],
        required: true
    }
}, { timestamps: true });

// Index for efficient aggregation queries
contactClickSchema.index({ createdAt: -1 });
contactClickSchema.index({ type: 1 });

export default mongoose.model('ContactClick', contactClickSchema);
