import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';
import Category from './models/Category.js';
import Service from './models/Service.js';
import Lead from './models/Lead.js';
import Project from './models/Project.js';
import Setting from './models/Setting.js';
import Stat from './models/Stat.js';
import About from './models/About.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
// Use webrentaldb as confirmed by user/migration success
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/webrentaldb';
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-fallback-secret-key-12345'; // Recommendation: set this in .env

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for now to prevent issues with React SPA
    crossOriginEmbedderPolicy: false
}));

// Rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login requests per window
    message: { error: 'Terlalu banyak percobaan login, silakan coba lagi setelah 15 menit' }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory (uploaded images)
app.use(express.static(path.join(__dirname, 'public')));

// Serve built frontend (production)
app.use(express.static(path.join(__dirname, 'dist')));

// Database Connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Multer storage configuration
const uploadDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (!token) return res.status(401).json({ error: 'Akses ditolak. Token tidak ditemukan.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token tidak valid atau sudah kadaluarsa.' });
        req.user = user;
        next();
    });
};

// File Upload Route
// Protected: only admins can upload files
app.post('/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const relativePath = `/uploads/${req.file.filename}`;
    res.json({ url: relativePath });
});

// Helper for sorting
const getSortOption = (req) => {
    const { _sort, _order } = req.query;
    if (_sort) {
        return { [_sort]: _order === 'desc' ? -1 : 1 };
    }
    return {};
};



// API Routes

// --- Authentication ---
app.post('/api/login', authLimiter, (req, res) => {
    const { email, password } = req.body;

    // Hardcoded admin credentials as requested
    if (email === 'alfa@gmail.com' && password === 'YMedia88') {
        // Generate JWT token (expires in 24 hours)
        const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { email, role: 'admin' } });
    } else {
        res.status(401).json({ error: 'Email atau password salah' });
    }
});

// Categories
app.get('/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort(getSortOption(req));
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/categories/:id', async (req, res) => {
    try {
        const category = await Category.findOne({ id: req.params.id });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Protected
app.post('/categories', authenticateToken, async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Protected
app.put('/categories/:id', authenticateToken, async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Protected
app.delete('/categories/:id', authenticateToken, async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({ id: req.params.id });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Services
app.get('/services', async (req, res) => {
    try {
        const query = {};
        if (req.query.category) {
            query.category = req.query.category; // Simple match
            // If category is comma separated or array, need $in, but json-server usually requires specific format or exact match
        }
        // Handle json-server's `q` full text search if needed, but for now simple filter 
        // If req.query contains other fields, we could add them to query.

        const services = await Service.find(query).sort(getSortOption(req));
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/services/:id', async (req, res) => {
    try {
        const service = await Service.findOne({ id: req.params.id });
        if (!service) return res.status(404).json({ error: 'Service not found' });
        res.json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Protected
app.post('/services', authenticateToken, async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json(service);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Protected
app.put('/services/:id', authenticateToken, async (req, res) => {
    try {
        const service = await Service.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!service) return res.status(404).json({ error: 'Service not found' });
        res.json(service);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Protected
app.delete('/services/:id', authenticateToken, async (req, res) => {
    try {
        const service = await Service.findOneAndDelete({ id: req.params.id });
        if (!service) return res.status(404).json({ error: 'Service not found' });
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Leads
// NOTE: Leads use standard Mongo _id but expose it as 'id' in JSON.
// Frontend sends DELETE /leads/:id which is likely the Mongo ID string.
// Protected (only Admin can view leads)
app.get('/leads', authenticateToken, async (req, res) => {
    try {
        const leads = await Lead.find().sort(getSortOption(req));
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Public (anyone can submit a lead via contact form)
app.post('/leads', [
    // Validation & Sanitization
    body('firstName').trim().escape().notEmpty().withMessage('First name is required'),
    body('lastName').trim().escape().optional(),
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').trim().escape().optional(),
    body('company').trim().escape().optional(),
    body('eventType').trim().escape().optional(),
    body('message').trim().escape().optional(),
    body('bot_check').custom((value) => {
        // Honeypot check
        if (value) {
            throw new Error('Bot detected');
        }
        return true;
    })
], async (req, res) => {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    }

    try {
        const lead = new Lead(req.body);
        await lead.save();
        res.status(201).json(lead);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Protected
app.delete('/leads/:id', authenticateToken, async (req, res) => {
    try {
        // Find by _id
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });
        res.json({ message: 'Lead deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Projects
app.get('/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort(getSortOption(req));
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/projects/:id', async (req, res) => {
    try {
        // Try finding by internal ID string first
        const project = await Project.findOne({ id: req.params.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Protected
app.post('/projects', authenticateToken, async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Protected
app.put('/projects/:id', authenticateToken, async (req, res) => { // Full update
    try {
        const project = await Project.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Protected
app.patch('/projects/:id', authenticateToken, async (req, res) => { // Partial update (visibility toggle)
    try {
        const project = await Project.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Protected
app.delete('/projects/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ id: req.params.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Settings (Singleton)
app.get('/settings', async (req, res) => {
    try {
        const settings = await Setting.findOne();
        res.json(settings || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Protected
app.put('/settings', authenticateToken, async (req, res) => {
    try {
        const settings = await Setting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(settings);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Stats (Singleton)
app.get('/stats', async (req, res) => {
    try {
        const stats = await Stat.findOne();
        res.json(stats || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// About (Singleton)
app.get('/about', async (req, res) => {
    try {
        const about = await About.findOne();
        res.json(about || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Protected
app.put('/about', authenticateToken, async (req, res) => {
    try {
        const about = await About.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(about);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


// SPA Fallback: serve index.html for all non-API routes (must be AFTER API routes)
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`File uploads endpoint: POST http://localhost:${PORT}/upload`);
});
