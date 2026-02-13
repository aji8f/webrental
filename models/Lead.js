import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    company: { type: String },
    eventType: { type: String },
    attendees: { type: String },
    message: { type: String },
    services: [{ type: String }],
    status: { type: String, default: 'new' },
    // id kept for backward compatibility if needed, but _id is standard
    // If we need custom numeric IDs, we'd handle that, but for now let's stick to standard Mongo _id for new ones
    // or use a counter. db.json had numeric IDs.
    // To avoid breaking frontend that might rely on numeric id, we might want to auto-increment or just use _id and map it.
    // For simplicity and robustness, let's use Mongoose _id and map 'id' in toJSON if needed,
    // BUT db.json used numbers. Let's see if we can just use the Number if we migrate.
    // Ideally string/ObjectId is better.
    oldId: { type: Number }
}, { timestamps: true });

// Ensure virtuals are included in JSON
leadSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
    }
});

export default mongoose.model('Lead', leadSchema);
