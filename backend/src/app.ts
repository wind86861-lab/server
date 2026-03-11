import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import path from 'path';
import { env } from './config/env';
import { errorHandler } from './middleware/error.middleware';
import authRoutes from './modules/auth/auth.routes';
import categoryRoutes from './modules/categories/categories.routes';
import diagnosticRoutes from './modules/diagnostics/diagnostics.routes';
import surgicalRoutes from './modules/surgical/surgical.routes';
import clinicRoutes from './modules/clinics/clinics.routes';
import adminClinicRoutes from './modules/clinics/admin-clinics.routes';
import adminReviewRoutes from './modules/reviews/admin-reviews.routes';
import checkupPackageRoutes, { adminCheckupPackageRoutes, clinicCheckupPackageRoutes } from './modules/checkup-packages/checkup-packages.routes';
import adminRoutes from './modules/admin/admin.routes';
import clinicAdminRoutes from './modules/clinic/clinic.routes';
import { apiLimiter } from './middleware/rateLimiter';

const app = express();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Backend is running',
        timestamp: new Date().toISOString()
    });
});

// Simple admin creation endpoint - GET for easy browser access
app.get('/create-admin', async (req, res) => {
    try {
        const bcrypt = require('bcrypt');
        const prisma = require('./config/database').default;

        const existingAdmin = await prisma.user.findFirst({
            where: { email: 'admin@medicare.uz' }
        });

        if (existingAdmin) {
            return res.json({
                success: true,
                message: 'Admin already exists',
                email: 'admin@medicare.uz',
                password: 'admin123',
                loginUrl: '/admin/login'
            });
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);

        const newAdmin = await prisma.user.create({
            data: {
                phone: '+998901234567',
                email: 'admin@medicare.uz',
                passwordHash: hashedPassword,
                firstName: 'Super',
                lastName: 'Admin',
                role: 'SUPER_ADMIN',
            },
        });

        res.json({
            success: true,
            message: 'Admin created successfully!',
            email: 'admin@medicare.uz',
            password: 'admin123',
            userId: newAdmin.id,
            loginUrl: '/admin/login'
        });
    } catch (error: any) {
        console.error('Admin creation failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create admin',
            details: error.message
        });
    }
});

// Seed database with medical services and categories
app.get('/seed-data', async (req, res) => {
    try {
        const prisma = require('./config/database').default;

        // Check if data already exists
        const existingServices = await prisma.diagnosticService.count();
        if (existingServices > 0) {
            return res.json({
                success: true,
                message: 'Database already seeded',
                servicesCount: existingServices
            });
        }

        // Create categories
        const categories = await Promise.all([
            prisma.serviceCategory.create({ data: { name: 'Laboratory Tests', slug: 'laboratory-tests' } }),
            prisma.serviceCategory.create({ data: { name: 'Radiology', slug: 'radiology' } }),
            prisma.serviceCategory.create({ data: { name: 'Cardiology', slug: 'cardiology' } }),
            prisma.serviceCategory.create({ data: { name: 'General Health', slug: 'general-health' } })
        ]);

        // Create sample diagnostic services
        const services = await Promise.all([
            prisma.diagnosticService.create({
                data: {
                    name: 'Complete Blood Count (CBC)',
                    description: 'Comprehensive blood test',
                    price: 50000,
                    categoryId: categories[0].id
                }
            }),
            prisma.diagnosticService.create({
                data: {
                    name: 'X-Ray Chest',
                    description: 'Chest X-ray examination',
                    price: 80000,
                    categoryId: categories[1].id
                }
            }),
            prisma.diagnosticService.create({
                data: {
                    name: 'ECG',
                    description: 'Electrocardiogram test',
                    price: 60000,
                    categoryId: categories[2].id
                }
            }),
            prisma.diagnosticService.create({
                data: {
                    name: 'General Health Checkup',
                    description: 'Complete health screening',
                    price: 150000,
                    categoryId: categories[3].id
                }
            })
        ]);

        res.json({
            success: true,
            message: 'Database seeded successfully!',
            categoriesCreated: categories.length,
            servicesCreated: services.length
        });
    } catch (error: any) {
        console.error('Seed data failed:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to seed data',
            details: error.message
        });
    }
});

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'multipart/form-data'],
}));

// Global rate limiter — 100 req / 15 min per IP (VULN-02)
app.use('/api/', apiLimiter);

// Logic Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // required for HttpOnly refresh-token cookie (VULN-03)

// Static file serving (uploaded documents, logos, licenses)
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/diagnostics', diagnosticRoutes);
app.use('/api/surgical', surgicalRoutes);
app.use('/api/clinics', clinicRoutes);
app.use('/api/admin/clinics', adminClinicRoutes);
app.use('/api/admin/reviews', adminReviewRoutes);
app.use('/api/checkup-packages', checkupPackageRoutes);
app.use('/api/admin/checkup-packages', adminCheckupPackageRoutes);
app.use('/api/clinic/checkup-packages', clinicCheckupPackageRoutes);
app.use('/api/clinic', clinicAdminRoutes);
app.use('/api/admin', adminRoutes);

// Error Handling
app.use(errorHandler);

export default app;
