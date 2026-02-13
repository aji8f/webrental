import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Category from './models/Category.js';
import Service from './models/Service.js';
import Lead from './models/Lead.js';
import Project from './models/Project.js';
import Setting from './models/Setting.js';
import Stat from './models/Stat.js';
import About from './models/About.js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/webrentaldb';

async function migrate() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const dbPath = path.join(__dirname, 'db.json');
        const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

        // Clear existing collections provided we are doing a fresh logic migration
        // WARNING: This clears the DB.
        console.log('Clearing existing collections...');
        await Promise.all([
            Category.deleteMany({}),
            Service.deleteMany({}),
            Lead.deleteMany({}),
            Project.deleteMany({}),
            Setting.deleteMany({}),
            Stat.deleteMany({}),
            About.deleteMany({})
        ]);

        console.log('Migrating Categories...');
        if (dbData.categories) await Category.insertMany(dbData.categories);

        console.log('Migrating Services...');
        if (dbData.services) await Service.insertMany(dbData.services);

        console.log('Migrating Leads...');
        // Transform leads if necessary. db.json uses integer 'id', mongo will generate _id.
        // We can keep 'id' if we want, or just let mongo handle it.
        // Our schema has 'oldId' if we want to preserve it, but for simplicity let's just insert.
        // We'll strip the 'id' from db.json if it conflicts or let it be 'oldId'.
        const leads = dbData.leads.map(l => ({ ...l, oldId: l.id }));
        // Note: we removed 'id' from schema required, so it won't conflict with _id unless we force it.
        // Mongoose ignores 'id' unless defined in schema typically, but let's be safe.
        if (leads.length) await Lead.insertMany(leads);

        console.log('Migrating Projects...');
        if (dbData.projects) await Project.insertMany(dbData.projects);

        console.log('Migrating Settings...');
        if (dbData.settings) await Setting.create(dbData.settings);

        console.log('Migrating Stats...');
        // db.json 'stats' is an object, not array.
        if (dbData.stats) await Stat.create(dbData.stats);

        console.log('Migrating About...');
        // db.json 'about' is an object.
        if (dbData.about) await About.create(dbData.about);

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
