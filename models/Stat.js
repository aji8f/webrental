import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
    // We can store stats as a single document or individual entries. 
    // db.json has a 'stats' object with keys 'newLeads', 'pendingQuotes', etc.
    // Let's model it as a single document with nested subdocuments for flexibility.

    newLeads: {
        value: Number,
        trend: Number,
        label: String
    },
    pendingQuotes: {
        value: Number,
        status: String,
        label: String
    },
    activeProjects: {
        value: Number,
        status: String,
        label: String
    },
    revenue: {
        value: String, // "Rp 186.750k" - stored as string in db.json
        trend: Number,
        label: String
    },
    id: { type: String, default: 'stats_v1' } // Singleton identifier
}, { timestamps: true });

export default mongoose.model('Stat', statSchema);
