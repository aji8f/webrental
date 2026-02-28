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
import ContactClick from './models/ContactClick.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/webrentaldb';
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-fallback-secret-key-12345';

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// Rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
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
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Akses ditolak. Token tidak ditemukan.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token tidak valid atau sudah kadaluarsa.' });
        req.user = user;
        next();
    });
};

// Helper for sorting
const getSortOption = (req) => {
    const { _sort, _order } = req.query;
    if (_sort) {
        return { [_sort]: _order === 'desc' ? -1 : 1 };
    }
    return {};
};

// ============================================================
// API Routes — all prefixed with /api to avoid SPA conflicts
// ============================================================

// File Upload
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    const relativePath = `/uploads/${req.file.filename}`;
    res.json({ url: relativePath });
});

// --- Authentication ---
app.post('/api/login', authLimiter, (req, res) => {
    const { email, password } = req.body;

    if (email === 'alfa@gmail.com' && password === 'YMedia88') {
        const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { email, role: 'admin' } });
    } else {
        res.status(401).json({ error: 'Email atau password salah' });
    }
});

// --- Categories ---
app.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find().sort(getSortOption(req));
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/categories/:id', async (req, res) => {
    try {
        const category = await Category.findOne({ id: req.params.id });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/categories', authenticateToken, async (req, res) => {
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/categories/:id', authenticateToken, async (req, res) => {
    try {
        const category = await Category.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/categories/:id', authenticateToken, async (req, res) => {
    try {
        const category = await Category.findOneAndDelete({ id: req.params.id });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json({ message: 'Category deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Services ---
app.get('/api/services', async (req, res) => {
    try {
        const query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }
        const services = await Service.find(query).sort(getSortOption(req));
        res.json(services);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/services/:id', async (req, res) => {
    try {
        const service = await Service.findOne({ id: req.params.id });
        if (!service) return res.status(404).json({ error: 'Service not found' });
        res.json(service);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/services', authenticateToken, async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json(service);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/services/:id', authenticateToken, async (req, res) => {
    try {
        const service = await Service.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!service) return res.status(404).json({ error: 'Service not found' });
        res.json(service);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/services/:id', authenticateToken, async (req, res) => {
    try {
        const service = await Service.findOneAndDelete({ id: req.params.id });
        if (!service) return res.status(404).json({ error: 'Service not found' });
        res.json({ message: 'Service deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Leads ---
app.get('/api/leads', authenticateToken, async (req, res) => {
    try {
        const leads = await Lead.find().sort(getSortOption(req));
        res.json(leads);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/leads', [
    body('firstName').trim().escape().notEmpty().withMessage('First name is required'),
    body('lastName').trim().escape().optional(),
    body('email').trim().isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').trim().escape().optional(),
    body('company').trim().escape().optional(),
    body('eventType').trim().escape().optional(),
    body('message').trim().escape().optional(),
    body('bot_check').custom((value) => {
        if (value) {
            throw new Error('Bot detected');
        }
        return true;
    })
], async (req, res) => {
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

app.delete('/api/leads/:id', authenticateToken, async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });
        res.json({ message: 'Lead deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Projects ---
app.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find().sort(getSortOption(req));
        res.json(projects);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/projects/:id', async (req, res) => {
    try {
        const project = await Project.findOne({ id: req.params.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/projects/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.patch('/api/projects/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/projects/:id', authenticateToken, async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ id: req.params.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Settings (Singleton) ---
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await Setting.findOne();
        res.json(settings || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/settings', authenticateToken, async (req, res) => {
    try {
        const settings = await Setting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(settings);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Stats (Singleton) ---
app.get('/api/stats', async (req, res) => {
    try {
        const stats = await Stat.findOne();
        res.json(stats || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- About (Singleton) ---
app.get('/api/about', async (req, res) => {
    try {
        const about = await About.findOne();
        res.json(about || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/about', authenticateToken, async (req, res) => {
    try {
        const about = await About.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(about);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Contact Click Tracking ---
const clickLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30, // max 30 clicks per minute per IP
    message: { error: 'Too many requests' }
});

app.post('/api/contact-clicks', clickLimiter, async (req, res) => {
    try {
        const { type, source } = req.body;
        const validTypes = ['whatsapp', 'email', 'phone'];
        const validSources = ['home', 'contact', 'footer', 'floating'];
        if (!validTypes.includes(type) || !validSources.includes(source)) {
            return res.status(400).json({ error: 'Invalid type or source' });
        }
        const click = new ContactClick({ type, source });
        await click.save();
        res.status(201).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/contact-clicks/stats', authenticateToken, async (req, res) => {
    try {
        const total = await ContactClick.countDocuments();
        const byType = await ContactClick.aggregate([
            { $group: { _id: '$type', count: { $sum: 1 } } }
        ]);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayCount = await ContactClick.countDocuments({ createdAt: { $gte: today } });
        res.json({
            total,
            today: todayCount,
            byType: byType.reduce((acc, item) => { acc[item._id] = item.count; return acc; }, {})
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ============================================================
// SPA Fallback: serve index.html for all non-API routes
// ============================================================
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoints: http://localhost:${PORT}/api/*`);
    console.log(`File uploads: POST http://localhost:${PORT}/api/upload`);
});
