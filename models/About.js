import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
    homeSummary: {
        tagline: String,
        title: String,
        description1: String,
        description2: String,
        image: String
    },
    pageContent: {
        history: String,
        mission: String,
        whyChooseUs: [{
            title: String,
            description: String
        }],
        teamImage: String,
        bottomImage1: String,
        bottomImage2: String
    },
    id: String // to match db.json singular object structure usually has an ID or we query by findOne()
}, { timestamps: true });

export default mongoose.model('About', aboutSchema);
