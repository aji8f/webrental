import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
    id: { type: Number, default: 1 }, // singleton ID
    contact: {
        headquarters: {
            street: String,
            city: String,
            zip: String
        },
        email: {
            sales: String,
            support: String
        },
        phone: String,
        businessHours: {
            weekday: String,
            emergency: String
        },
        mapUrl: String
    },
    heroImages: {
        home: String,
        portfolio: String,
        about: String,
        services: String,
        contact: String
    },
    logo: String,
    profile: {
        name: String
    }
}, { timestamps: true });

export default mongoose.model('Setting', settingSchema);
