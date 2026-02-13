
import mongoose from 'mongoose';
import Category from './models/Category.js';

const MONGODB_URI = 'mongodb://127.0.0.1:27017/webrentaldb';

async function check() {
    try {
        console.log('Connecting to:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected!');

        console.log('Fetching categories...');
        const categories = await Category.find();
        console.log(`Found ${categories.length} categories`);
        console.log(categories); // Print content to see if it's there

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

check();
