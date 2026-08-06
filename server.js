import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
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

// Fail fast on missing required secrets instead of silently falling back to
// insecure defaults — a missing env var should never downgrade security.
const REQUIRED_ENV_VARS = ['JWT_SECRET', 'ADMIN_EMAIL', 'ADMIN_PASSWORD_HASH'];
const missingEnvVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missingEnvVars.length > 0) {
    console.error(`Missing required environment variable(s): ${missingEnvVars.join(', ')}. See .env.example.`);
    process.exit(1);
}

const app = express();
// Behind Nginx/Cloudflare — trust X-Forwarded-Proto so req.protocol reflects the
// real (https) scheme, not the plain-HTTP connection Nginx makes to this process.
app.set('trust proxy', 1);
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/webrentaldb';
const JWT_SECRET = process.env.JWT_SECRET;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '').split(',').map((o) => o.trim()).filter(Boolean);

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            scriptSrc: ["'self'", 'https://static.cloudflareinsights.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            frameAncestors: ["'none'"]
        }
    },
    // Cross-origin images (e.g. externally hosted hero/logo assets) don't all send
    // Cross-Origin-Resource-Policy headers; disable COEP rather than break image loading.
    crossOriginEmbedderPolicy: false
}));

// Rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { error: 'Terlalu banyak percobaan login, silakan coba lagi setelah 15 menit' }
});

// General limiter for mutating admin routes (defense in depth beyond the JWT check)
const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { error: 'Terlalu banyak permintaan, silakan coba lagi nanti' }
});

// Separate, tighter limiter for public-facing writes (no auth to fall back on)
const publicWriteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Terlalu banyak permintaan, silakan coba lagi nanti' }
});

// Middleware
// CORS: browsers attach an Origin header even to same-origin requests for
// resources loaded with a `crossorigin` attribute (Vite adds this to built
// <script>/<link> tags), so "has an Origin header" does NOT mean cross-origin.
// Compare against the request's own origin first; only requests from a
// genuinely different, non-whitelisted origin get rejected.
app.use((req, res, next) => {
    const origin = req.headers.origin;
    const selfOrigin = `${req.protocol}://${req.get('host')}`;
    const isAllowed = !origin || origin === selfOrigin || ALLOWED_ORIGINS.includes(origin);

    if (origin && isAllowed) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    if (req.method === 'OPTIONS') {
        res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        return res.sendStatus(204);
    }

    if (origin && !isAllowed) {
        return res.status(403).json({ error: 'Not allowed by CORS' });
    }

    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Strip Mongo operator keys ($set, $where, dotted paths, etc.) from request
// bodies before they ever reach Mongoose, so a malicious/compromised client
// can't smuggle query operators into an update document.
const sanitizeMongoOperators = (value) => {
    if (Array.isArray(value)) {
        return value.map(sanitizeMongoOperators);
    }
    if (value && typeof value === 'object') {
        const clean = {};
        for (const [key, val] of Object.entries(value)) {
            if (key.startsWith('$') || key.includes('.')) continue;
            clean[key] = sanitizeMongoOperators(val);
        }
        return clean;
    }
    return value;
};

app.use((req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeMongoOperators(req.body);
    }
    next();
});

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

const ALLOWED_IMAGE_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

const upload = multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
    fileFilter: (req, file, cb) => {
        if (!ALLOWED_IMAGE_MIME_TYPES.has(file.mimetype)) {
            return cb(new Error('Only JPEG, PNG, WEBP, or GIF images are allowed'));
        }
        cb(null, true);
    }
});

// Authentication Middleware — reads the JWT from an httpOnly cookie so it's
// inaccessible to page JavaScript (mitigates token theft via XSS).
const authenticateToken = (req, res, next) => {
    const token = req.cookies?.token;

    if (!token) return res.status(401).json({ error: 'Akses ditolak. Token tidak ditemukan.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token tidak valid atau sudah kadaluarsa.' });
        req.user = user;
        next();
    });
};

const AUTH_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000 // 24h, matches JWT expiry
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

// --- Authentication ---
app.post('/api/login', authLimiter, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email dan password wajib diisi' });
    }

    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

    const passwordMatches = email === ADMIN_EMAIL && await bcrypt.compare(password, ADMIN_PASSWORD_HASH).catch(() => false);

    if (!passwordMatches) {
        return res.status(401).json({ error: 'Email atau password salah' });
    }

    const token = jwt.sign({ email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    res.cookie('token', token, AUTH_COOKIE_OPTIONS);
    // Token intentionally omitted from the response body — it only ever lives
    // in the httpOnly cookie, so an XSS payload reading fetch/axios responses
    // can't exfiltrate it.
    res.json({ user: { email, role: 'admin' } });
});

app.post('/api/logout', (req, res) => {
    res.clearCookie('token', AUTH_COOKIE_OPTIONS);
    res.json({ success: true });
});

app.get('/api/me', authenticateToken, (req, res) => {
    res.json({ user: req.user });
});

// File Upload
app.post('/api/upload', authenticateToken, (req, res) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            return res.status(400).json({ error: err.message || 'Upload failed' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        const relativePath = `/uploads/${req.file.filename}`;
        res.json({ url: relativePath });
    });
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

const categoryValidators = [
    body('id').trim().notEmpty().withMessage('id is required'),
    body('name').trim().notEmpty().withMessage('name is required'),
    body('slug').trim().notEmpty().withMessage('slug is required'),
    body('type').optional().trim().isIn(['service', 'portfolio']).withMessage('type must be service or portfolio'),
    body('count').optional().isInt({ min: 0 })
];

app.post('/api/categories', authenticateToken, writeLimiter, categoryValidators, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    try {
        const category = new Category(req.body);
        await category.save();
        res.status(201).json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/categories/:id', authenticateToken, writeLimiter, categoryValidators, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    try {
        const category = await Category.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!category) return res.status(404).json({ error: 'Category not found' });
        res.json(category);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/categories/:id', authenticateToken, writeLimiter, async (req, res) => {
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

const serviceValidators = [
    body('id').trim().notEmpty().withMessage('id is required'),
    body('name').trim().notEmpty().withMessage('name is required'),
    body('category').trim().notEmpty().withMessage('category is required'),
    body('price_daily').optional().isFloat({ min: 0 }),
    body('inventory_count').optional().isInt({ min: 0 })
];

app.post('/api/services', authenticateToken, writeLimiter, serviceValidators, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    try {
        const service = new Service(req.body);
        await service.save();
        res.status(201).json(service);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/services/:id', authenticateToken, writeLimiter, serviceValidators, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    try {
        const service = await Service.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!service) return res.status(404).json({ error: 'Service not found' });
        res.json(service);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/services/:id', authenticateToken, writeLimiter, async (req, res) => {
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

app.post('/api/leads', publicWriteLimiter, [
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

app.delete('/api/leads/:id', authenticateToken, writeLimiter, async (req, res) => {
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

const projectValidators = [
    body('title').trim().notEmpty().withMessage('title is required'),
    body('visible').optional().isBoolean(),
    body('featured').optional().isBoolean(),
    body('access').optional().isIn(['public', 'client', 'internal']),
    body('gallery').optional().isArray()
];

app.post('/api/projects', authenticateToken, writeLimiter, projectValidators, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put('/api/projects/:id', authenticateToken, writeLimiter, projectValidators, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: 'Validation failed', details: errors.array() });
    try {
        const project = await Project.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.patch('/api/projects/:id', authenticateToken, writeLimiter, async (req, res) => {
    try {
        const project = await Project.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true });
        if (!project) return res.status(404).json({ error: 'Project not found' });
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/api/projects/:id', authenticateToken, writeLimiter, async (req, res) => {
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

app.put('/api/settings', authenticateToken, writeLimiter, async (req, res) => {
    try {
        const settings = await Setting.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.json(settings);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// --- Stats (Singleton) ---
app.get('/api/stats', authenticateToken, async (req, res) => {
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

app.put('/api/about', authenticateToken, writeLimiter, async (req, res) => {
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

// Central error handler (e.g. CORS rejections, uncaught async errors) — always
// respond with JSON and never leak stack traces to the client.
app.use((err, req, res, _next) => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API endpoints: http://localhost:${PORT}/api/*`);
    console.log(`File uploads: POST http://localhost:${PORT}/api/upload`);
});
